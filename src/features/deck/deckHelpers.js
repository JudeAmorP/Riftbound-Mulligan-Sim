export const countCards = (entries) => 
    entries.reduce((sum, e) => sum + e.count, 0)

export const getUniqueCardCodes = (entries) => 
[...new Set(entries.map((e) => e.cardCode))]