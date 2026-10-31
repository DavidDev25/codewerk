class Tier {
  constructor(name) {
    this.name = name;
  }

  beschreibung() {
    return `${this.name} ist ein Tier.`;
  }
}

class Hund extends Tier {
  bellen() {
    return "Wuff";
  }
}

class Katze extends Tier {
  miauen() {
    return "Miau";
  }
}

const bello = new Hund("Bello");
const minka = new Katze("Minka");
