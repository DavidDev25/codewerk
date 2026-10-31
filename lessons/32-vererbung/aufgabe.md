## Aufgabe: Hund und Katze

Im Editor steht schon die Klasse `Tier`. Sie speichert einen Namen und hat die Methode `beschreibung()`. Du schreibst zwei Kindklassen, die alles davon übernehmen und je einen eigenen Laut dazubekommen.

### Schritt 1: Der Hund

```js
const rex = new Hund("Rex");
rex.name;           // "Rex"
rex.bellen();       // "Wuff"
rex.beschreibung(); // "Rex ist ein Tier."
```

So gehst du vor:

1. Schreibe `class Hund extends Tier { ... }`.
2. Schreibe darin die Methode `bellen()`. Sie gibt `"Wuff"` zurück.

Einen eigenen `constructor` brauchst du nicht. Den Namen speichert schon der `constructor` von `Tier`.

### Schritt 2: Die Katze

```js
new Katze("Tom").miauen(); // "Miau"
```

Schreibe `class Katze extends Tier` genauso wie den Hund. Die Methode heißt hier `miauen()` und gibt `"Miau"` zurück.

### Schritt 3: Zwei Tiere

Baue unter den Klassen zwei Tiere:

```js
const bello = new Hund("Bello");
const minka = new Katze("Minka");
```
