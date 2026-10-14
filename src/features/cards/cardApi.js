import {http} from "../../services/http";
import { normalizeCard, placeholderCard, toCodeKey } from "./normalizeCard";
import { cardCache } from "./cardCache";

const CONCURRENCY = 5;

// This returns an array and anything else is treated as no Result due to isArray method
function extractItems(data) {
    return Array.isArray(data) ? data : [];
}

export function pickBestVariant(cards, requestedCode) {
    const wanted = toCodeKey(requestedCode);
    const matches = cards.filter((c) => c.codeKey === wanted);
    if (matches.length === 0) return null;

    const score = (c) => 
    (c.isSignature ? 4 : 0) + (c.isOvernumbered ? 2 : 0) + (c.isAlternateArt ? 1 : 0);
    return [...matches].sort((a,b) => score(a) - score(b))[0]; 
}

async function getWithRetry(url, retries = 2) {
  try {
    return await http.get(url);
  } catch (err) {
    const status = err.response?.status;
    const retryable = !status || status >= 500;
    if (retryable && retries > 0) {
      await new Promise((r) => setTimeout(r, 500 * (3 - retries)));
      return getWithRetry(url, retries - 1);
    }
    throw err;
  }
}

// Always resolves to { ok, card, reason? }. Never throws.
export async function getCardByCode(cardCode) {
  const code = String(cardCode).trim();

  if (cardCache.has(code)) return { ok: true, card: cardCache.get(code) };

  const pending = cardCache.getInFlight(code);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const url = `/cards/riftbound/${encodeURIComponent(code.toLowerCase())}`;
      const res = await getWithRetry(url);
      const cards = extractItems(res.data).map(normalizeCard).filter(Boolean);
      const best = pickBestVariant(cards, code);

      if (!best) return { ok: false, card: placeholderCard(code), reason: "not-found" };

      cardCache.set(code, best);
      return { ok: true, card: best };
    } catch (err) {
      const status = err.response?.status;
      const reason =
        status === 404 ? "not-found" : status === 429 ? "rate-limited" : "network";
      return { ok: false, card: placeholderCard(code), reason };
    } finally {
      cardCache.clearInFlight(code);
    }
  })();

  cardCache.setInFlight(code, promise);
  return promise;
}

// Fetches each UNIQUE code once, max CONCURRENCY at a time.
export async function getCardsByCodes(cardCodes, { onProgress } = {}) {
  const unique = [...new Set(cardCodes.map((c) => String(c).trim()))];
  const cards = new Map();
  const failures = [];
  let done = 0;

  const queue = [...unique];
  async function worker() {
    while (queue.length > 0) {
      const code = queue.shift();
      const result = await getCardByCode(code);
      cards.set(code, result.card);
      if (!result.ok) failures.push({ cardCode: code, reason: result.reason });
      onProgress?.(++done, unique.length);
    }
  }

  const workers = Math.min(CONCURRENCY, unique.length);
  await Promise.all(Array.from({ length: workers }, worker));

  return { cards, failures };
}