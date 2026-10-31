class Katze {
  constructor(name) {
    this.name = name;
  }
  miau() {
    return `${this.name} sagt Miau`;
  }
}

const minka = new Katze("Minka");
const felix = new Katze("Felix");

const geteilt = minka.miau === felix.miau;
const eigene = Object.keys(minka);
const istPrototyp = Object.getPrototypeOf(minka) === Katze.prototype;

function Punkt(x, y) {
  this.x = x;
  this.y = y;
}

Punkt.prototype.abstand = function () {
  return Math.sqrt(this.x ** 2 + this.y ** 2);
};
