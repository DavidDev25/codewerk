class Zaehler {
  constructor(start = 0) {
    this.wert = start;
  }

  erhoehen() {
    this.wert = this.wert + 1;
  }

  verringern() {
    this.wert = this.wert - 1;
  }

  zuruecksetzen() {
    this.wert = 0;
  }

  beschreibung() {
    return `Zählerstand: ${this.wert}`;
  }
}

const klicker = new Zaehler();
klicker.erhoehen();
klicker.erhoehen();
klicker.erhoehen();

console.log(klicker.wert);
