class Buch {
  constructor(titel, autor, seiten) {
    this.titel = titel;
    this.autor = autor;
    this.seiten = seiten;
  }
}

const hobbit = new Buch("Der Hobbit", "J. R. R. Tolkien", 310);
const krimi = new Buch("Mord im Orient-Express", "Agatha Christie", 256);

console.log(hobbit);
