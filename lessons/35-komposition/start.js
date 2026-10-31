// Lektion 35 – Komposition

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

// class Auto { ... }


// const golf = ...
