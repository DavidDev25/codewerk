class Thermometer {
  #celsius = 20;

  get celsius() {
    return this.#celsius;
  }

  set celsius(wert) {
    if (wert < -273.15) {
      throw new Error("Zu kalt!");
    }
    this.#celsius = wert;
  }

  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }
}

const t = new Thermometer();
t.celsius = 25;
console.log(t.celsius);
