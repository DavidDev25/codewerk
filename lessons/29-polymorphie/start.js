// Lektion 29 – Polymorphie

class Form {
  flaeche() {
    return 0;
  }

  beschreibe() {
    return `${this.constructor.name} mit Fläche ${this.flaeche().toFixed(2)}`;
  }
}

// 1. class Kreis extends Form { ... }


// 2. class Rechteck extends Form { ... }


// 3. Summe aller Flächen – ohne instanceof
function gesamtFlaeche(formen) {

}
