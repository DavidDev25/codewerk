class Form {
  flaeche() {
    return 0;
  }

  beschreibe() {
    return `${this.constructor.name} mit Fläche ${this.flaeche().toFixed(2)}`;
  }
}

class Kreis extends Form {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  flaeche() {
    return Math.PI * this.radius * this.radius;
  }
}

class Rechteck extends Form {
  constructor(breite, hoehe) {
    super();
    this.breite = breite;
    this.hoehe = hoehe;
  }

  flaeche() {
    return this.breite * this.hoehe;
  }
}

function gesamtFlaeche(formen) {
  let summe = 0;
  for (const form of formen) {
    summe += form.flaeche();
  }
  return summe;
}
