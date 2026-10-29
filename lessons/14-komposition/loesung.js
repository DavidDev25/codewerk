class Motor {
  #laeuft = false;

  starten() {
    this.#laeuft = true;
  }

  stoppen() {
    this.#laeuft = false;
  }

  get laeuft() {
    return this.#laeuft;
  }
}

class Auto {
  constructor(marke) {
    this.marke = marke;
    this.motor = new Motor();
  }

  fahren() {
    if (!this.motor.laeuft) {
      this.motor.starten();
    }
    return `${this.marke} fährt`;
  }

  anhalten() {
    this.motor.stoppen();
    return `${this.marke} steht`;
  }

  status() {
    return `${this.marke}: Motor ${this.motor.laeuft ? "an" : "aus"}`;
  }
}

const golf = new Auto("Golf");
