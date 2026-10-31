## Das Problem mit den Typen

JavaScript prüft Typen erst, **während** das Programm läuft, und oft nicht einmal dann. `"3" * 2` ergibt `6`, aber `"3" + 2` ergibt `"32"`. In großen Projekten weiß deshalb bald niemand mehr sicher, ob eine Funktion eine Zahl, einen Text oder ein Objekt erwartet.

Dagegen helfen zwei Dinge: Typen **beschreiben** und Werte **prüfen**. Beschreiben kannst du sie mit JSDoc oder TypeScript. Prüfen musst du selbst, während das Programm läuft.

## JSDoc: Typen als Kommentar

JSDoc-Kommentare beginnen mit `/**`. Editoren wie VS Code und auch der Editor in Codewerk lesen sie. Beim Tippen zeigen sie dir dann an, was erwartet wird. Im Beispiel beschreibst du eine Funktion für den Bruttopreis:

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

Ausgegeben wird 119. Der Kommentar ändert nichts am Ergebnis. Er sagt nur, was die Funktion erwartet:

- `@param {number} netto` beschreibt den ersten Wert. In geschweiften Klammern steht der Typ, dahinter der Name und nach dem Strich eine Erklärung.
- Die eckigen Klammern um `[steuer=0.19]` zeigen, dass dieser Wert weggelassen werden darf. Dann gilt 0.19.
- `@returns {number}` sagt, was zurückkommt.

Für eigene Objekttypen gibt es `@typedef`. Damit beschreibst du einmal, welche Eigenschaften ein Objekt hat:

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

Ausgegeben wird „Ali (25)“. `string[]` bedeutet: eine Liste von Texten. Fahre im Editor mit der Maus über `nutzer`, dann siehst du den beschriebenen Typ.

## Prüfen, während das Programm läuft

JSDoc ist nur eine Beschreibung. Niemand hindert dich daran, trotzdem einen Text zu übergeben. An den **Rändern** deines Programms solltest du Werte deshalb zusätzlich echt prüfen. Ränder sind alle Stellen, an denen Daten von außen kommen: Formulare, Antworten vom Server und Funktionen, die andere benutzen.

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

Ausgegeben wird „preis muss eine Zahl sein, war aber string“. `"12"` sieht zwar aus wie eine Zahl, ist aber ein Text. `Number.isFinite` lehnt außerdem `NaN` und `Infinity` ab, die beide zum Typ `number` gehören.

## Ein Blick auf TypeScript

**TypeScript** ist JavaScript mit Typen direkt im Code. Ein Werkzeug prüft sie **vor** dem Ausführen und übersetzt den Code dann in normales JavaScript:

```ts
type Nutzer = { name: string; alter: number };

function vorstellen(nutzer: Nutzer): string {
  return `${nutzer.name} (${nutzer.alter})`;
}

vorstellen({ name: "Ali", alter: "25" }); // Fehler schon beim Schreiben!
```

Hier steht der Typ direkt hinter dem Namen, zum Beispiel `nutzer: Nutzer`. Die letzte Zeile übergibt das Alter als Text. TypeScript meldet das schon beim Schreiben, lange bevor das Programm läuft.

Fast alle großen Projekte und Firmen benutzen heute TypeScript. Wer JSDoc versteht, lernt TypeScript schnell. Die Ideen sind dieselben, nur die Schreibweise ist kürzer.
