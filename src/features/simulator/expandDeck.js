/**
 * Turn deck entries (with counts) into one object per physical card.
 * @param {import('../cards/types').DeckEntry[]} deckEntries
 * @param {Map<string, import('../cards/types').Card>} cardMap
 * @returns {import('../cards/types').ExpandedCard[]}
 */

export function expandDeck(deckEntries, cardMap) {
    const expanded = [];

    for (const {cardCode, count} of deckEntries) {
        const card = cardMap.get(cardCode);

        for (let i = 0; i < count; i++) {
            expanded.push({
                instanceId: `${cardCode}#${i}`,
                cardCode,
                name: card?.name ?? cardCode,
                imageUrl: card?.imageUrl ?? null,
                missingData: !card,
            });
        }
    }
    return expanded;
}