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
    super(name);
    this.rasse = rasse;
  }

  beschreibung() {
    return `${super.beschreibung()} Rasse: ${this.rasse}`;
  }
}

const bello = new Hund("Bello", "Dackel");
