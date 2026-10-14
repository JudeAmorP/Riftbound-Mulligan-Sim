/**
 * Convert a raw Riftcodex card into the internal Card model.
 * This is the only file that knows Riftcodex's response format.
 * @returns {import('./types').Card | null}
 */

export function toCodeKey(code) {
    return String(code).trim().toLocaleLowerCase().split("-").slice(0,2).join("-");
}

export function normalizeCard(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (!raw.riftbound_id || !raw.name) return null;

    return {
        id: raw.id,
        riftboundId: raw.riftbound_id,
        codeKey: toCodeKey(raw.riftbound_id),
        name: raw.name,
        setId: raw.set?.set_id ?? null,
        imageUrl: raw.media?.image_url ?? null,
        altText: raw.media?.accessibility_text || raw.name,
        type: raw.classification?.type ?? null,
        supertype: raw.classification?.supertype ?? null,
        rarity: raw.classification?.rarity ?? null,
        domains: raw.classification?.domain ?? [],
        energy: raw.attributes?.energy ?? null,
        might: raw.attributes?.might ?? null,
        power: raw.attributes?.power ?? null,
        isAlternateArt: raw.metadata?.alternate_art ?? false,
        isOvernumbered: raw.metadata?.overnumbered ?? false,
        isSignature: raw.metadata?.signature ?? false,
        missing: false,
    };
}

export function placeholderCard (cardcode) {
    return {
        id:null,
        riftboundId: null,
        codeKey: toCodeKey(cardcode),
        name: cardcode,
        setId: null,
        imageUrl: null,
        altText: `Card ${cardcode} (data unavailable)`,
        type: null,
        supertype: null,
        rarity: null,
        domains: [],
        energy: null,
        might: null,
        power: null,
        isAlternateArt: false,
        isOvernumbered: false,
        isSignature: false,
        missing: true,
    };
}