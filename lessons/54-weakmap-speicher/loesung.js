const besuche = new WeakMap();

function besuchZaehlen(nutzer) {
  const neu = (besuche.get(nutzer) ?? 0) + 1;
  besuche.set(nutzer, neu);
  return neu;
}

const gesperrt = new WeakSet();

function sperren(nutzer) {
  gesperrt.add(nutzer);
}

function istGesperrt(nutzer) {
  return gesperrt.has(nutzer);
}

function objektCache(fn) {
  const speicher = new WeakMap();
  return (obj) => {
    if (!speicher.has(obj)) {
      speicher.set(obj, fn(obj));
    }
    return speicher.get(obj);
  };
}

class Uhr {
  constructor(beiJedemTakt) {
    this.beiJedemTakt = beiJedemTakt;
  }

  start() {
    this.id = setInterval(() => this.beiJedemTakt(), 10);
  }

  stop() {
    clearInterval(this.id);
  }
}
