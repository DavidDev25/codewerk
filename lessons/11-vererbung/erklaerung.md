## extends: „ist ein“

:::alltag
Ein Hund **ist ein** Tier. Alles, was für Tiere gilt (Name, Atmen, Fressen), gilt auch für ihn. Dazu kann er Dinge, die nur Hunde können: bellen.
:::

```js
class Tier {
  constructor(name) {
    this.name = name;
  }

  atmen() {
    return this.name + " atmet.";
  }
}

class Vogel extends Tier {
  fliegen() {
    return this.name + " fliegt.";
  }
}

const spatz = new Vogel("Spatz");
console.log(spatz.atmen());
console.log(spatz.fliegen());
```

- `extends Tier` heißt: Vogel **erbt** alles von Tier.
- Die Elternklasse nennt man auch „Basisklasse“.
- Die Kindklasse darf **neue** Methoden dazubekommen.

Im **Diagramm** zeigt ein dicker Pfeil „erbt von“ von der Kindklasse zur Elternklasse. Ein gestrichelter Pfeil „ist ein“ geht vom Objekt zu seiner Klasse.
