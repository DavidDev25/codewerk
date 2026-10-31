const { EventEmitter } = require("node:events");

// 1. und 2. class Kasse extends EventEmitter { … }
class Kasse {
}


// 3. Kasse mit Tagesziel 50, Listener anmelden, 20, -5, 40 und 10 bezahlen


module.exports = { Kasse };
