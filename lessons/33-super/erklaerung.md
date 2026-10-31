## Auf der Elternklasse aufbauen

In Lektion 32 hat die Kindklasse einfach alles von der Elternklasse übernommen. Oft soll sie aber etwas Eigenes dazubekommen, zum Beispiel einen zusätzlichen Wert. Dann baut sie auf der Elternklasse auf, statt alles neu zu schreiben. Dafür gibt es das Wort `super`.

:::alltag
Denk an ein Rezept, in dem steht: „Bereite den Grundteig zu wie immer und gib dann Schokolade dazu.“ Du machst nicht alles neu. Du **baust auf dem Grundrezept auf**.
:::

Im Beispiel bekommt der Hund zusätzlich zum Namen eine Rasse. Dafür braucht er einen eigenen `constructor`:

```js
class Tier {
  constructor(name) {
    this.name = name;
  }
  beschreibung() {
    return this.name + " ist ein Tier.";
  }
}

class Hund extends Tier {
  constructor(name, rasse) {
    super(name);
    this.rasse = rasse;
  }

  beschreibung() {
    return super.beschreibung() + " Rasse: " + this.rasse;
  }
}

console.log(new Hund("Bello", "Dackel").beschreibung());
```

Ausgegeben wird „Bello ist ein Tier. Rasse: Dackel“. Der erste Teil des Satzes kommt aus `Tier`, der zweite aus `Hund`.

- `super(name)` ruft den `constructor` der Elternklasse auf. Der speichert den Namen.
- Erst **danach** darfst du `this` benutzen. Vorher gibt es das neue Objekt noch gar nicht.
- `Hund` hat eine eigene Methode `beschreibung`. Sie ersetzt die von `Tier`. Das nennt man **überschreiben**.
- Mit `super.beschreibung()` holt sich die neue Methode trotzdem das Ergebnis der alten und hängt etwas an.
