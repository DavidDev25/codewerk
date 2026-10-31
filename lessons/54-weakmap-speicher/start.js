// Lektion 54 – Speicher, WeakMap & Lecks

// 1. const besuche = ...
//    function besuchZaehlen(nutzer) { ... }


// 2. const gesperrt = ...
//    function sperren(nutzer) { ... }
//    function istGesperrt(nutzer) { ... }


// 3. function objektCache(fn) { ... }


// 4. Ergänze stop()
class Uhr {
  constructor(beiJedemTakt) {
    this.beiJedemTakt = beiJedemTakt;
  }

  start() {
    setInterval(() => this.beiJedemTakt(), 10);
  }
}
