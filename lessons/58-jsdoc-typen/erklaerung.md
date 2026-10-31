## Das Problem mit den Typen

JavaScript prüft Typen erst, **während** das Programm läuft, und oft nicht einmal dann. `"3" * 2` ergibt `6`, `"3" + 2` ergibt `"32"`. In großen Projekten weiß niemand mehr sicher, ob eine Funktion eine Zahl, einen Text oder ein Objekt erwartet.

Dagegen gibt es zwei Werkzeuge: **beschreiben** (JSDoc, TypeScript) und **prüfen** (Laufzeitprüfungen).

## JSDoc: Typen als Kommentar

JSDoc-Kommentare beginnen mit `/**`. Editoren wie VS Code (und der Codewerk-Editor) lesen sie und zeigen dir beim Tippen an, was erwartet wird:

```js
/**
 * Berechnet den Bruttopreis.
 * @param {number} netto - Preis ohne Steuer in Euro
 * @param {number} [steuer=0.19] - Steuersatz, optional
 * @returns {number} Preis mit Steuer
 */
function brutto(netto, steuer = 0.19) {
  return netto * (1 + steuer);
}

console.log(brutto(100));
```

Für eigene Objekttypen gibt es `@typedef`:

```js
/**
 * @typedef {Object} Nutzer
 * @property {string} name
 * @property {number} alter
 * @property {string[]} hobbys
 */

/** @param {Nutzer} nutzer */
function vorstellen(nutzer) {
  return `${nutzer.name} (${nutzer.alter})`;
}

console.log(vorstellen({ name: "Ali", alter: 25, hobbys: [] }));
```

Fahre im Editor mit der Maus über `nutzer`, dann siehst du den Typ.

## Laufzeitprüfungen

JSDoc ist nur eine Beschreibung. An den **Rändern** deines Programms (Formulare, Daten vom Server, öffentliche Funktionen) solltest du Werte zusätzlich echt prüfen:

```js
function mussZahlSein(wert, name) {
  if (typeof wert !== "number" || !Number.isFinite(wert)) {
    throw new TypeError(`${name} muss eine Zahl sein, war aber ${typeof wert}`);
  }
}

try {
  mussZahlSein("12", "preis");
} catch (fehler) {
  console.log(fehler.message);
}
```

## Ein Blick auf TypeScript

**TypeScript** ist JavaScript mit Typen direkt im Code. Ein Werkzeug prüft sie **vor** dem Ausführen und übersetzt dann in normales JavaScript:

```ts
type Nutzer = { name: string; alter: number };

function vorstellen(nutzer: Nutzer): string {
  return `${nutzer.name} (${nutzer.alter})`;
}

vorstellen({ name: "Ali", alter: "25" }); // Fehler schon beim Schreiben!
```

Fast alle großen Projekte und Firmen nutzen heute TypeScript. Wer JSDoc versteht, kann TypeScript schnell lernen: Die Ideen sind dieselben, nur die Schreibweise ist kürzer.
