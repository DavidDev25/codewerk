class Buch {
  #verliehen = false;

  constructor(titel) {
    this.titel = titel;
  }

  get istVerliehen() {
    return this.#verliehen;
  }

  ausleihen() {
    if (this.#verliehen) {
      return false;
    }
    this.#verliehen = true;
    return true;
  }

  zurueckgeben() {
    this.#verliehen = false;
  }

  beschreibung() {
    return this.titel;
  }
}

class Hoerbuch extends Buch {
  constructor(titel, minuten) {
    super(titel);
    this.minuten = minuten;
  }

  beschreibung() {
    return `${super.beschreibung()} (Hörbuch, ${this.minuten} Min.)`;
  }
}

class Bibliothek {
  constructor() {
    this.buecher = [];
  }

  hinzufuegen(buch) {
    this.buecher.push(buch);
  }

  ausleihen(titel) {
    const buch = this.buecher.find((b) => b.titel === titel);
    if (!buch) {
      return `${titel} gibt es nicht.`;
    }
    if (!buch.ausleihen()) {
      return `${titel} ist schon verliehen.`;
    }
    return `Viel Spaß mit ${titel}!`;
  }

  verfuegbar() {
    const frei = [];
    for (const buch of this.buecher) {
      if (!buch.istVerliehen) {
        frei.push(buch.beschreibung());
      }
    }
    return frei;
  }
}

const bibliothek = new Bibliothek();
bibliothek.hinzufuegen(new Buch("Momo"));
bibliothek.hinzufuegen(new Hoerbuch("Der Hobbit", 660));
bibliothek.ausleihen("Momo");
