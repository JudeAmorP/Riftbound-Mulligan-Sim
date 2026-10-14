import { DECK_RULES } from "../../utils/constants";

// TODO: confirm exact type strings from the console.table output
const ZONE_BY_TYPE = {
  Rune: "runes",
  Battlefield: "battlefields",
  Legend: "legend",
};

export function partitionDeck(deck, cards) {
  const zones = {
    drawPile: [],
    runes: [],
    battlefields: [],
    legend: [],
    champion: [],
    unknown: [],
  };

  for (const { cardCode, count } of deck.mainDeck) {
    const card = cards.get(cardCode);
    const zone = !card || card.missing ? "unknown" : ZONE_BY_TYPE[card.type] ?? "drawPile";
    for (let i = 0; i < count; i++) zones[zone].push(cardCode);
  }

  // Move exactly ONE copy of the chosen champion out of the draw pile
  if (deck.chosenChampion) {
    const idx = zones.drawPile.indexOf(deck.chosenChampion);
    if (idx !== -1) {
      zones.drawPile.splice(idx, 1);
      zones.champion.push(deck.chosenChampion);
    }
  }

  const problems = [];
  const expect = (zone, expected, label) => {
    if (zones[zone].length !== expected)
      problems.push(`Expected ${expected} ${label}, found ${zones[zone].length}`);
  };
  expect("runes", DECK_RULES.RUNE_COUNT, "runes");
  expect("battlefields", DECK_RULES.BATTLEFIELD_COUNT, "battlefields");
  expect("legend", DECK_RULES.LEGEND_COUNT, "legend");
  expect("champion", DECK_RULES.CHAMPION_COUNT, "chosen champion");
  expect("drawPile", DECK_RULES.DRAW_PILE_SIZE, "draw-pile cards");
  if (zones.unknown.length > 0)
    problems.push(`${zones.unknown.length} cards could not be identified`);

  return { zones, problems };
}