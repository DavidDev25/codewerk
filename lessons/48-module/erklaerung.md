## Ordnung in großen Programmen

Echte Programme bestehen aus Hunderten Dateien. Jede Datei ist ein **Modul**: Sie hat ihre eigenen Variablen und gibt nur das nach außen, was andere wirklich brauchen.

:::alltag
Ein Restaurant: Die Küche ist ein Modul. Gäste sehen nur die **Speisekarte** (das, was exportiert wird). Wie gekocht wird, welche Vorräte es gibt und wer abwäscht, bleibt in der Küche (privat).
:::

## export und import

Eine Datei `mathe.js` gibt mit `export` frei, was andere benutzen dürfen:

```mjs
// mathe.js
const geheimFaktor = 2;

export function verdoppeln(x) {
  return x * geheimFaktor;
}

export const PI = 3.14159;
```

Eine andere Datei holt es sich mit `import`:

```mjs
// main.js
import { verdoppeln, PI } from "./mathe.js";

console.log(verdoppeln(PI));
```

- Nur was mit `export` markiert ist, kann importiert werden. `geheimFaktor` bleibt privat.
- Die Namen in `{ … }` müssen zu den Exporten passen. Mit `as` kannst du umbenennen: `import { verdoppeln as mal2 } from "./mathe.js";`
- Der Pfad beginnt mit `./` (gleicher Ordner) oder `../` (ein Ordner höher) und endet auf `.js`. Im Browser ist beides Pflicht.

In dieser Lektion hat der Editor deshalb **mehrere Reiter**, einen pro Datei. `main.js` ist mit ▶ markiert: Hier startet das Programm, alle anderen Dateien laufen nur, wenn jemand sie importiert.

## Der Standard-Export

Jede Datei darf zusätzlich **einen** Standard-Export haben. Beim Import fehlen dann die geschweiften Klammern, und du wählst den Namen selbst:

```mjs
// warenkorb.js
export default class Warenkorb { /* … */ }

// main.js
import Warenkorb from "./warenkorb.js";
import Korb from "./warenkorb.js";   // derselbe Export, anderer Name
```

Viele Teams verzichten auf `export default` und nutzen nur benannte Exporte: Dann heißt eine Sache überall gleich, und der Editor kann beim Umbenennen helfen.

## Was ein Modul besonders macht

| Eigenschaft | Was das heißt |
| --- | --- |
| eigener Bereich | Variablen oben in einer Datei sind **nicht** global. Zwei Dateien dürfen beide `const liste` haben. |
| läuft genau einmal | Importieren drei Dateien `rechner.js`, wird es nur einmal ausgeführt. Alle teilen sich **dasselbe** `verlauf`. |
| immer strict mode | Fehler wie eine vergessene Deklaration (`x = 5` ohne `let`) werfen sofort einen Fehler. |
| Importe sind schreibgeschützt | `addiere = 5` in `main.js` geht nicht. Ändern darf nur das Modul selbst. |
| Fehler vor dem Start | Importierst du einen Namen, den es nicht gibt, startet das Programm gar nicht erst. |

Der Punkt „läuft genau einmal“ ist wichtig: Ein Modul ist ein guter Ort für gemeinsamen Zustand, etwa einen Warenkorb, den mehrere Teile einer Seite benutzen.

## Alles auf einmal: der Namensraum

Brauchst du viele Exporte einer Datei, holst du sie gesammelt als Objekt:

```mjs
import * as rechner from "./rechner.js";

rechner.addiere(2, 3);
console.log(rechner.letzteRechnung());
```

`rechner` ist ein **Namensraum-Objekt**. Es ist immer aktuell: Ändert das Modul eine exportierte `let`-Variable, siehst du über `rechner.name` sofort den neuen Wert.

## Weiterreichen: eine Datei als Eingang

Größere Ordner haben oft eine `index.js`, die nur weiterreicht. Andere Teile des Programms müssen dann nur eine Datei kennen:

```mjs
// werkzeuge/index.js
export { addiere, letzteRechnung } from "./rechner.js";
export * from "./format.js";             // alle benannten Exporte
export { default as Korb } from "./korb.js";

// main.js
import { addiere, Korb } from "./werkzeuge/index.js";
```

## Profiwissen: Laden bei Bedarf

`import { … } from` steht immer ganz oben und lädt alles **vor** dem Start. Manchmal willst du ein Modul erst laden, wenn es gebraucht wird, etwa einen großen Diagramm-Baustein erst beim Klick. Dafür gibt es `import(…)` als Funktion. Sie gibt ein Promise mit dem Namensraum zurück:

```mjs
async function diagrammZeigen() {
  const { zeichnen } = await import("./diagramm.js");
  zeichnen();
}
```

In Modulen darfst du `await` außerdem **ganz oben** benutzen, ohne `async function` drumherum (Top-Level-await). Wer dieses Modul importiert, wartet automatisch, bis es fertig ist:

```mjs
// daten.js
const antwort = await fetch("/uebung/nutzer");
export const nutzer = await antwort.json();
```

## Pakete von anderen

Pakete, die du mit `npm` installierst, importierst du ohne `./`: `import express from "express";` Den Weg zum Paket findet dann Node.js oder ein Werkzeug wie Vite. Das lernst du im Node.js-Teil. In Codewerk importierst du nur deine eigenen Dateien.

## Früher: das Modul-Muster

Bevor es `import` gab, baute man Module aus einer Funktion, die sofort aufgerufen wird. Was sie zurückgibt, ist die „Speisekarte“:

```js
const zaehler = (() => {
  let stand = 0;
  function erhoehen() { stand++; return stand; }
  return { erhoehen };
})();

zaehler.erhoehen();
console.log(zaehler.erhoehen());
console.log(typeof stand);
```

Das Prinzip ist dasselbe: privat drinnen, öffentlich nur das Nötige. Du triffst dieses Muster noch in älterem Code, und Werkzeuge wie Vite verwandeln deine Module beim Bauen der Webseite in ähnliche Konstrukte.

## Fehler, die du sehen wirst

| Meldung (sinngemäß) | Ursache |
| --- | --- |
| „rechner.js exportiert nichts mit dem Namen …“ | Tippfehler im Import oder `export` vergessen |
| „… hat keinen Standard-Export“ | `import x from` statt `import { x } from` |
| „Im Browser braucht der Pfad die Endung .js“ | `"./rechner"` statt `"./rechner.js"` |
| „… ist kein Pfad zu einer Datei“ | `"rechner.js"` ohne `./` davor |
| „Importierte Werte sind schreibgeschützt“ | du hast einem importierten Namen etwas zugewiesen |
