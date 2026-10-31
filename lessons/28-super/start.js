// Lektion 28 – super

class Tier {
  constructor(name) {
    this.name = name;
  }

  beschreibung() {
    return `${this.name} ist ein Tier.`;
  }
}

class Hund extends Tier {
  constructor(name, rasse) {
    // 1. Erst super(...), dann this.rasse
  }

  // 2. beschreibung() überschreiben
}

// const bello = ...
