class Hund {
  constructor(name) { this.name = name; }
  laut() { return "Wuff"; }
}
class Katze {
  constructor(name) { this.name = name; }
  laut() { return "Miau"; }
}

class Ereignisse {
  #abos = new Map();

  on(name, fn) {
    this.#abos.set(name, [...(this.#abos.get(name) ?? []), fn]);
  }

  off(name, fn) {
    this.#abos.set(name, (this.#abos.get(name) ?? []).filter((f) => f !== fn));
  }

  emit(name, ...daten) {
    const liste = this.#abos.get(name) ?? [];
    for (const fn of liste) {
      fn(...daten);
    }
    return liste.length;
  }

  einmal(name, fn) {
    const hilfe = (...daten) => {
      this.off(name, hilfe);
      fn(...daten);
    };
    this.on(name, hilfe);
  }
}

function tierErstellen(art, name) {
  if (art === "hund") return new Hund(name);
  if (art === "katze") return new Katze(name);
  return null;
}
