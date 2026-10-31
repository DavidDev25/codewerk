class Konto {
  #saldo = 0;

  einzahlen(betrag) {
    if (betrag > 0) {
      this.#saldo += betrag;
    }
  }

  abheben(betrag) {
    if (betrag > 0 && betrag <= this.#saldo) {
      this.#saldo -= betrag;
      return true;
    }
    return false;
  }

  kontostand() {
    return this.#saldo;
  }
}

const meinKonto = new Konto();
meinKonto.einzahlen(100);
