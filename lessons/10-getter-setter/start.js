// Lektion 10 – Getter & Setter

class Thermometer {
  #celsius = 20;

  get celsius() {

  }

  set celsius(wert) {

  }

  // get fahrenheit() fehlt noch
}

const t = new Thermometer();
t.celsius = 25;
console.log(t.celsius);
