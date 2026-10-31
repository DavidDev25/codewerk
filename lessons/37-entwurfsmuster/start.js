// Lektion 37 – Entwurfsmuster
class Hund {
  constructor(name) { this.name = name; }
  laut() { return "Wuff"; }
}
class Katze {
  constructor(name) { this.name = name; }
  laut() { return "Miau"; }
}

// 1. class Ereignisse { on … off … emit … einmal … }


// 2. function tierErstellen(art, name) { ... }
