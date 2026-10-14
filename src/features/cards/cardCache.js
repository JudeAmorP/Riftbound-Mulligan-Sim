const cache = new Map(); // for cardcode to card
const inFlight = new Map(); // for cardcode to promise<result>

export const cardCache = {
    get: (code) => cache.get(code),
    has: (code) => cache.has(code),
    set: (code, card) => cache.set(code, card),
    getInFlight: (code) => inFlight.get(code),
    setInFlight: (code, promise) => inFlight.set(code, promise),
    clearInFlight: (code) => inFlight.delete(code),
    clear: () => {cache.clear(); inFlight.clear();} 
}