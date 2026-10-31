const figur = {
  name: "Ritter",
  leben: 100,
  treffer(schaden) {
    this.leben = Math.max(0, this.leben - schaden);
  },
  heilen(menge) {
    this.leben = Math.min(100, this.leben + menge);
  },
  status() {
    return `${this.name}: ${this.leben} Leben`;
  },
};

const melden = figur.status.bind(figur);
