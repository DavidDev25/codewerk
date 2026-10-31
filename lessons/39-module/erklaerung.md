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
// app.js
import { verdoppeln, PI } from "./mathe.js";

console.log(verdoppeln(PI));
```

- Nur was mit `export` markiert ist, kann importiert werden. `geheimFaktor` bleibt privat.
- Die Namen in `{ … }` müssen zu den Exporten passen. Mit `as` kannst du umbenennen: `import { verdoppeln as mal2 } from "./mathe.js";`

Jede Datei darf zusätzlich **einen** Standard-Export haben. Beim Import fehlen dann die geschweiften Klammern, und du wählst den Namen selbst:

```mjs
// warenkorb.js
export default class Warenkorb { /* … */ }

// app.js
import Warenkorb from "./warenkorb.js";
```

Pakete aus dem Internet (über `npm` installiert) importierst du genauso, nur ohne `./`: `import express from "express";`

## Das Prinzip dahinter

In Codewerk läuft dein Code in **einer** Datei, deshalb funktionieren `import` und `export` hier nicht. Das Wichtigste an Modulen kannst du aber auch ohne sie bauen: einen eigenen Bereich mit privaten Variablen und einer kleinen öffentlichen Schnittstelle. Das kennst du schon von den Closures:

```js
const zaehlerModul = (() => {
  let stand = 0;

  function erhoehen() {
    stand++;
    return stand;
  }

  function zuruecksetzen() {
    stand = 0;
  }

  return { erhoehen, zuruecksetzen };
})();

zaehlerModul.erhoehen();
console.log(zaehlerModul.erhoehen());
console.log(typeof stand);
```

- `(() => { … })()` ist eine Funktion, die sofort einmal aufgerufen wird. Alles darin ist von außen unsichtbar.
- Das zurückgegebene Objekt ist die „Speisekarte“, also das, was ein `export` wäre.
- Mit Destructuring holst du dir einzelne Teile, fast wie mit `import`: `const { erhoehen } = zaehlerModul;`

Genau so haben Programmierer gearbeitet, bevor es `import` gab. Und Werkzeuge wie Vite oder Webpack verwandeln deine Module beim Bauen der Webseite noch heute in ähnliche Konstrukte.
