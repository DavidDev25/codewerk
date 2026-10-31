## Aufgabe: Die Kursverwaltung

Du verwaltest einen Kurs, ohne die Daten im Original zu ändern. Im Editor stehen schon die Liste `zahlen` und das Objekt `kurs`. Bei **keinem** Schritt dürfen sich die beiden verändern. Die Tests prüfen das.

### Schritt 1: Drei neue Listen

```js
sortiert;    // [1, 2, 3]
rueckwaerts; // [2, 1, 3]
ersetzt;     // [10, 1, 2]
zahlen;      // [3, 1, 2]
```

So gehst du vor:

1. `sortiert` bekommst du mit `toSorted` und der Vergleichsfunktion `(a, b) => a - b`.
2. `rueckwaerts` bekommst du mit `toReversed`.
3. `ersetzt` bekommst du mit `with`. Ersetzt wird Position 0 durch `10`.

Wichtig: Nimm nicht `sort` oder `reverse`. Die beiden verändern `zahlen` selbst.

### Schritt 2: Eine tiefe Kopie

`kopie` ist eine Kopie von `kurs`, die mit dem Original nichts mehr teilt. Danach ziehst du mit der Kopie um:

```js
kopie.ort.stadt; // "Fürth"
kurs.ort.stadt;  // "Nürnberg"
```

So gehst du vor:

1. Lege `kopie` mit `structuredClone(kurs)` an.
2. Setze in der nächsten Zeile `kopie.ort.stadt` auf `"Fürth"`.

Wichtig: Mit `{ ...kurs }` klappt es nicht. Dann teilen sich beide das `ort`-Objekt, und auch in `kurs` stünde plötzlich Fürth.

### Schritt 3: Ein neuer Teilnehmer

`mitTeilnehmer(kurs, name)` gibt einen **neuen** Kurs zurück. Darin steht `name` zusätzlich in der Teilnehmerliste:

```js
const neu = mitTeilnehmer(kurs, "Ben");
neu.teilnehmer;  // ["Lea", "Tom", "Ben"]
kurs.teilnehmer; // ["Lea", "Tom"]
```

So gehst du vor:

1. Gib ein neues Objekt zurück, das mit `...kurs` alle Eigenschaften übernimmt.
2. Setze darin `teilnehmer` auf eine neue Liste: `[...kurs.teilnehmer, name]`.

Wichtig: `push` würde die alte Teilnehmerliste verändern. Baue deshalb mit `[...]` eine neue Liste.

### Schritt 4: Eingefrorene Einstellungen

```js
konfig.farbe;            // "blau"
Object.isFrozen(konfig); // true
```

Friere das Objekt `{ farbe: "blau" }` mit `Object.freeze` ein und speichere es in `konfig`.
