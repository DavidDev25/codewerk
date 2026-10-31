## Zwei Arten von Modulen

Node gab es schon, bevor JavaScript `import` und `export` hatte. Deshalb erfand Node ein eigenes System: **CommonJS**. Heute kennt Node beides, und du triffst beides in echten Projekten.

| | CommonJS | ES-Module |
| --- | --- | --- |
| laden | `const x = require("./x")` | `import x from "./x.js"` |
| freigeben | `module.exports = …` | `export …` |
| Endung im Pfad | darf fehlen | Pflicht |
| wann geladen | wenn die Zeile läuft | vor dem Start |
| typisch für | ältere Projekte, viele Pakete | neue Projekte, Browser |

:::alltag
CommonJS ist wie ein Werkzeug, das du dir genau dann aus dem Keller holst, wenn du es brauchst (`require` mitten im Code). ES-Module sind wie eine Packliste: Vor der Abfahrt liegt alles bereit.
:::

## CommonJS: require und module.exports

```cjs
// rechner.js
const verlauf = [];

function addiere(a, b) {
  verlauf.push(a + b);
  return a + b;
}

module.exports = { addiere };
```

```cjs
// main.js
const { addiere } = require("./rechner");
console.log(addiere(2, 3));
```

- `module.exports` ist das, was `require` zurückgibt. Meist ein Objekt mit Funktionen.
- Die Kurzform `exports.addiere = addiere;` fügt einzelne Teile hinzu. Aber Vorsicht: `exports = { … }` (ohne `module.`) wirkt **nicht**, weil du damit nur eine lokale Variable überschreibst.
- `require("./rechner")` findet `rechner.js`, `rechner.json` oder `rechner/index.js`. Die Endung darf fehlen.
- Auch hier gilt: Ein Modul läuft **nur beim ersten** `require`. Danach bekommt jeder dasselbe Objekt.

## JSON-Dateien laden

`require` kann JSON-Dateien direkt lesen. Heraus kommt ein normales Objekt:

```cjs
const einstellungen = require("./einstellungen.json");
console.log(einstellungen.sprache);
```

## Eingebaute Module

Node bringt viele Module mit. Du lädst sie ohne `./`, am besten mit dem Präfix `node:`. Dann ist sofort klar, dass es kein installiertes Paket ist:

```js
const path = require("node:path");
console.log(path.join("daten", "kunden", "liste.json"));
console.log(path.extname("foto.png"));
```

Die wichtigsten: `node:fs` (Dateien), `node:path` (Pfade), `node:events` (Ereignisse), `node:http` (Server), `node:util` (Helfer). Die lernst du in den nächsten Lektionen kennen.

## __dirname und __filename

In CommonJS gibt es zwei praktische Variablen: den Ordner und den Pfad der aktuellen Datei.

```js
console.log(__dirname);
console.log(__filename);
```

So baust du Pfade, die unabhängig davon funktionieren, von wo aus das Programm gestartet wurde: `path.join(__dirname, "daten.json")`.

## ES-Module in Node

Willst du `import` benutzen, gibt es drei Wege:

1. In `package.json` steht `"type": "module"`. Dann sind alle `.js`-Dateien ES-Module.
2. Die Datei endet auf `.mjs`.
3. Seit Node 22 erkennt Node `import`/`export` auch so und behandelt die Datei als ES-Modul.

```mjs
import { readFileSync } from "node:fs";
import path from "node:path";

console.log(import.meta.dirname);
```

In ES-Modulen gibt es kein `__dirname`. Stattdessen: `import.meta.dirname` und `import.meta.filename`. Ein ES-Modul darf CommonJS-Module importieren. Andersherum geht es mit `await import(…)`.

## require.main: Wurde ich direkt gestartet?

```js
if (require.main === module) {
  console.log("Ich bin das Hauptprogramm");
}
```

So kann eine Datei als Programm laufen **und** als Modul von anderen benutzt werden, ohne dass dann ihr Programmteil startet.
