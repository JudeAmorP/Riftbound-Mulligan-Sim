import { describe, it, expect, vi, beforeEach } from "vitest";
import dataResponse from "../src/assets/ogn_007_data_response.json"
import { normalizeCard } from "../src/features/cards/normalizeCard";
import { pickBestVariant, getCardsByCodes } from "../src/features/cards/cardApi";
import { cardCache } from "../src/features/cards/cardCache";
import { http } from "../src/services/http";


vi.mock("../src/services/http", () => ({ http: { get: vi.fn() } }));

beforeEach(() => {
  cardCache.clear();
  http.get.mockReset();
});


console.log(typeof dataResponse, Array.isArray(dataResponse));

describe("normalizeCard", () => {
  it("maps nested Riftcodex fields", () => {
    const card = normalizeCard(dataResponse[0]);
    expect(card.name).toBe("Fury Rune");
    expect(card.codeKey).toBe("ogn-007");
    expect(card.type).toBe("Rune");
    expect(card.imageUrl).toMatch(/^https:/);
  });
  it("returns null for malformed input", () => {
    expect(normalizeCard(null)).toBeNull();
    expect(normalizeCard({ name: "x" })).toBeNull();
  });
});

describe("pickBestVariant", () => {
  const cards = dataResponse.map(normalizeCard);
    console.log(pickBestVariant(cards, "OGN-007"));

  it("returns the base printing for OGN-007", () => {
    expect(pickBestVariant(cards, "OGN-007").riftboundId).toBe("ogn-007-298");
  });
  it("returns the alt art for OGN-007a", () => {
    expect(pickBestVariant(cards, "OGN-007a").riftboundId).toBe("ogn-007a-298");
  });
  it("returns null when nothing matches exactly", () => {
    expect(pickBestVariant(cards, "OGN-07")).toBeNull();
  });
});

describe("getCardsByCodes", () => {
  it("fetches each unique code once and caches", async () => {
    http.get.mockResolvedValue({ data: dataResponse });
    await getCardsByCodes(["OGN-007", "OGN-007", "OGN-007"]);
    await getCardsByCodes(["OGN-007"]);
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it("reports a 404 as a failure with a placeholder", async () => {
    http.get.mockRejectedValue({ response: { status: 404 } });
    const { cards, failures } = await getCardsByCodes(["FAKE-999"]);
    expect(failures).toEqual([{ cardCode: "FAKE-999", reason: "not-found" }]);
    expect(cards.get("FAKE-999").missing).toBe(true);
  });
  it("does not retry a 429", async () => {
    http.get.mockRejectedValue({ response: { status: 429 } });
    await getCardsByCodes(["OGN-007"]);
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
