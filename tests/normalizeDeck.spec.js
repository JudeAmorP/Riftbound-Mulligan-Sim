import { test, expect } from '@playwright/test'
import { normalizeDeck } from '../src/features/deck/normalizeDeck.js'

test.describe('normalizeDeck', () => {

  test('keeps valid entries', () => {
    const deck = normalizeDeck({
      mainDeck: [{ cardCode: 'OGN-007', count: 3 }],
      sideboard: [],
    })
    expect(deck.mainDeck).toEqual([{ cardCode: 'OGN-007', count: 3 }])
  })

  test('trims card codes and coerces numeric strings', () => {
    const deck = normalizeDeck({ mainDeck: [{ cardCode: ' OGN-007 ', count: '2' }] })
    expect(deck.mainDeck).toEqual([{ cardCode: 'OGN-007', count: 2 }])
  })

  test('drops malformed entries', () => {
    const deck = normalizeDeck({
      mainDeck: [
        { cardCode: '', count: 1 },
        { cardCode: 'OGN-001', count: 0 },
        { cardCode: 'OGN-002', count: NaN },
        { cardCode: 'OGN-003', count: 1.5 },
        { cardCode: 'OGN-004', count: 2 },
      ],
    })
    expect(deck.mainDeck).toEqual([{ cardCode: 'OGN-004', count: 2 }])
  })

  test('returns safe defaults for missing fields', () => {
    expect(normalizeDeck({})).toEqual({
      mainDeck: [],
      sideboard: [],
      chosenChampion: null,
      additionalLegends: [],
    })
    expect(normalizeDeck(undefined).mainDeck).toEqual([])
  })

  test('does not mutate the input', () => {
    const input = { mainDeck: [{ cardCode: ' OGN-007 ', count: '2' }] }
    const snapshot = JSON.stringify(input)
    normalizeDeck(input)
    expect(JSON.stringify(input)).toBe(snapshot)
  })

  test('keep chosenChampion as a trimmied String', () => {
    expect(normalizeDeck({ chosenChampion: ' SFD-029    '}).chosenChampion).toBe('SFD-029')
  })

  test('turns a non-string or blank chosenChampion into null', () => {
  expect(normalizeDeck({ chosenChampion: undefined }).chosenChampion).toBeNull()
  expect(normalizeDeck({ chosenChampion: '   ' }).chosenChampion).toBeNull()
  expect(normalizeDeck({ chosenChampion: { code: 'SFD-029' } }).chosenChampion).toBeNull()
})

})