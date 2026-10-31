## Eine Klasse baut auf einer anderen auf

Manche Klassen sind Sonderfälle einer anderen. Ein Vogel ist ein Tier, ein Hund auch. Statt alles doppelt zu schreiben, lässt du die speziellere Klasse alles von der allgemeineren übernehmen. Das nennt man **Vererbung**.

:::alltag
Ein Hund **ist ein** Tier. Alles, was für Tiere gilt, gilt auch für ihn: Er hat einen Namen, er atmet, er frisst. Dazu kann er etwas, das nur Hunde können: bellen.
:::

Im Beispiel übernimmt `Vogel` alles von `Tier` und kann zusätzlich fliegen:

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

Ausgegeben werden „Spatz atmet.“ und „Spatz fliegt.“. `Vogel` hat selbst weder einen `constructor` noch eine Methode `atmen`. Beides kommt von `Tier`. Deshalb kennt der Spatz seinen Namen und kann atmen.

- Mit `extends Tier` übernimmt `Vogel` alles, was `Tier` hat.
- `Tier` nennt man die **Elternklasse**, `Vogel` die **Kindklasse**.
- Die Kindklasse darf **neue** Methoden dazubekommen, hier `fliegen`.

Im **Diagramm** zeigt ein dicker Pfeil „erbt von“ von der Kindklasse zur Elternklasse. Ein gestrichelter Pfeil „ist ein“ geht vom Objekt zu seiner Klasse.
