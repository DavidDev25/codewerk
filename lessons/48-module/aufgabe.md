## Aufgabe: Der Rechner als Modul

Diesmal besteht dein Programm aus **drei Dateien**. Oben im Editor wechselst du mit den Reitern zwischen ihnen. `main.js` ist mit ▶ markiert, dort beginnt das Programm. `format.js` musst du nicht ändern.

Am Ende soll im Reiter **Ausgabe** diese Zeile stehen:

```
Ergebnis: 10 + 4 = 14
```

### Schritt 1: rechner.js gibt etwas frei

Öffne den Reiter `rechner.js`. Dort steht schon die Funktion `addiere`. Sie schreibt jede Rechnung in die Liste `verlauf`.

So gehst du vor:

1. Schreibe `export` vor `function addiere`.
2. Schreibe darunter `export function letzteRechnung() { ... }`. Sie gibt den letzten Eintrag aus `verlauf` zurück, also `verlauf.at(-1)`.
3. Ist noch nichts gerechnet worden, gibt sie `null` zurück. Das geht mit `?? null` hinter `verlauf.at(-1)`.

Wichtig: Vor `const verlauf` gehört **kein** `export`. Die Liste bleibt privat.

### Schritt 2: main.js holt sich alles

Wechsle zum Reiter `main.js`.

1. Hole mit `import { addiere, letzteRechnung } from "./rechner.js";` beide Funktionen.
2. Hole den Standard-Export von `format.js` unter dem Namen `schoen`: `import schoen from "./format.js";`. Hier gibt es **keine** geschweiften Klammern.

### Schritt 3: Rechnen und ausgeben

```js
addiere(2, 3);
addiere(10, 4);
schoen(letzteRechnung()); // "Ergebnis: 10 + 4 = 14"
```

Schreibe die beiden Rechnungen in `main.js` und gib `schoen(letzteRechnung())` mit `console.log` aus.
