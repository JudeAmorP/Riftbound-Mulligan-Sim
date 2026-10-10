import { getDeckFromCode } from '@piltoverarchive/riftbound-deck-codes'

export function decodeDeckCode(input) {
  try {
    const code = input.trim()
    if (!code) return { ok: false, error: 'Please paste a deck code.' }
    const decoded = getDeckFromCode(code)
    return {
      ok: true,
      deck: {
        mainDeck: decoded.mainDeck,
        sideboard: decoded.sideboard,
        chosenChampion: decoded.chosenChampion,
        additionalLegends: decoded.additionalLegends,
      },
    }
  } catch {
    return { ok: false, error: 'Invalid deck code.' }
  }
}