function normalizeEntry (entry) {
    return {
        cardCode: String(entry?.cardCode ?? '').trim(),
        count: Number(entry?.count),
    }
}

function isValidEntry (entry) {
    return entry.cardCode != '' && Number.isInteger(entry.count) && entry.count > 0
}

function normalizeSection (section) {
    if (!Array.isArray(section)) return []
    return section.map(normalizeEntry).filter(isValidEntry)
}

function normalizeChampion (value) {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
}

export function normalizeDeck(decoded) {
    return {
        mainDeck: normalizeSection(decoded?.mainDeck),
        sideboard: normalizeSection(decoded?.sideboard),
        chosenChampion: normalizeChampion(decoded?.chosenChampion),
        additionalLegends: Array.isArray(decoded?.additionalLegends) ? decoded.additionalLegends : []
    }
}