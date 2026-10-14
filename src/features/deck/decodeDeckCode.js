import { getDeckFromCode } from '@piltoverarchive/riftbound-deck-codes'
import {normalizeDeck} from './normalizeDeck'

export function decodeDeckCode(input) {

  if (typeof input != 'string' || !input.trim()) {
    return {ok : false, error: 'Please paste a deck code'}
  }

  let decoded
    try {
    decoded = getDeckFromCode(input.trim())
  } catch {
    return { ok: false, error: 'Invalid deck code.' }
  }

  const deck = normalizeDeck(decoded)

  if (deck.mainDeck.length === 0 ) {
    return { ok: false, error: "Deck decoded but contains 0 cards"}
  }

  return {ok: true, deck}
}

export function getUniqueCardCodes(deck) {
  const codes = new Set();
  deck.mainDeck?.forEach((e) => codes.add(e.cardCode));
  deck.sideboard?.forEach((e) => codes.add(e.cardCode));
  if (deck.chosenChampion) codes.add(deck.chosenChampion); // string
  // additionalLegends is empty here since neeko is pain
  deck.additionalLegends?.forEach((e) => codes.add(typeof e === "string" ? e : e.cardCode));
  return [...codes];
}