/**
 * @typedef {Object} DeckEntry
 * @property {string} cardCode  e.g. "OGN-007"
 * @property {number} count     copies in the deck
 */

/**
 * @typedef {Object} Card
 * @property {string} cardCode
 * @property {string} name
 * @property {string} setId
 * @property {string|null} imageUrl
 * @property {string|null} type
 * @property {string[]} domains
 * @property {string|null} rarity
 * @property {boolean} isSignature
 * @property {boolean} isAlternateArt
 */

/**
 * @typedef {Object} ExpandedCard
 * @property {string} instanceId  unique per physical copy
 * @property {string} cardCode
 * @property {string} name
 * @property {string|null} imageUrl
 * @property {boolean} missingData
 */

export {};