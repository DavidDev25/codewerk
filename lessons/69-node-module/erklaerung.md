## Zwei Arten von Modulen

Node gab es schon, bevor JavaScript `import` und `export` hatte. Deshalb hat Node damals ein eigenes System erfunden: **CommonJS**. Heute kennt Node beide Systeme, und du triffst in echten Projekten auf beide.

| | CommonJS | ES-Module |
| --- | --- | --- |
| laden | `const x = require("./x")` | `import x from "./x.js"` |
| freigeben | `module.exports = …` | `export …` |
| Endung im Pfad | darf fehlen | Pflicht |
| wann geladen | wenn die Zeile läuft | vor dem Start |
| typisch für | ältere Projekte, viele Pakete | neue Projekte, Browser |

:::alltag
CommonJS ist wie ein Werkzeug, das du genau dann aus dem Keller holst, wenn du es brauchst. `require` steht mitten im Code. ES-Module sind wie eine Packliste: Vor der Abfahrt liegt alles bereit.
:::

## Laden mit require, freigeben mit module.exports

Im Beispiel gibt `rechner.js` eine Funktion frei, und `main.js` holt sie sich:

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

`main.js` gibt 5 aus. `verlauf` bleibt in `rechner.js` privat, weil es nicht in `module.exports` steht.

- `module.exports` ist das, was `require` zurückgibt. Meistens ist das ein Objekt mit Funktionen.
- Die Kurzform `exports.addiere = addiere;` fügt einzelne Teile hinzu. Aber Vorsicht: `exports = { … }` ohne `module.` davor wirkt **nicht**. Damit überschreibst du nur eine lokale Variable.
- `require("./rechner")` findet `rechner.js`, `rechner.json` oder `rechner/index.js`. Die Endung darf also fehlen.
- Auch hier gilt: Ein Modul läuft **nur beim ersten** `require`. Danach bekommt jeder dasselbe Objekt.

## JSON-Dateien laden

`require` kann JSON-Dateien direkt lesen. Heraus kommt ein ganz normales Objekt:

```cjs
const einstellungen = require("./einstellungen.json");
console.log(einstellungen.sprache);
```

Steht in der Datei `{"sprache": "de"}`, wird „de“ ausgegeben. Du musst den Text nicht selbst mit `JSON.parse` umwandeln.

## Eingebaute Module

Node bringt viele Module mit. Du lädst sie ohne `./`, am besten mit `node:` davor. Dann ist sofort klar, dass es kein installiertes Paket ist. Im Beispiel benutzt du das Modul für Pfade:

```js
const path = require("node:path");
console.log(path.join("daten", "kunden", "liste.json"));
console.log(path.extname("foto.png"));
```

Ausgegeben werden „daten/kunden/liste.json“ und „.png“. `join` setzt die Teile mit dem richtigen Trennzeichen zusammen, `extname` liefert die Endung.

Die wichtigsten eingebauten Module sind `node:fs` für Dateien, `node:path` für Pfade, `node:events` für Ereignisse, `node:http` für Server und `node:util` für Helfer. Sie kommen in den nächsten Lektionen dran.

## Wo liegt die Datei?

In CommonJS gibt es zwei praktische Variablen: den Ordner und den vollen Pfad der aktuellen Datei.

```js
console.log(__dirname);
console.log(__filename);
```

Ausgegeben werden „/projekt“ und „/projekt/main.js“. Damit baust du Pfade, die immer funktionieren, egal aus welchem Ordner jemand das Programm startet: `path.join(__dirname, "daten.json")`.

## ES-Module in Node

Willst du in Node `import` benutzen, gibt es drei Wege:

1. In der Datei `package.json` steht `"type": "module"`. Dann sind alle `.js`-Dateien ES-Module.
2. Die Datei endet auf `.mjs`.
3. Seit Node 22 erkennt Node `import` und `export` auch von selbst und behandelt die Datei dann als ES-Modul.

```mjs
import { readFileSync } from "node:fs";
import path from "node:path";

console.log(import.meta.dirname);
```

In ES-Modulen gibt es kein `__dirname`. Stattdessen benutzt du `import.meta.dirname` und `import.meta.filename`. Ein ES-Modul darf CommonJS-Module importieren. Andersherum geht es mit `await import(…)`.

## Wurde ich direkt gestartet?

Eine Datei kann prüfen, ob sie selbst das Hauptprogramm ist:

```js
if (require.main === module) {
  console.log("Ich bin das Hauptprogramm");
}
```

Startest du die Datei direkt, erscheint „Ich bin das Hauptprogramm“. Lädt eine andere Datei sie mit `require`, passiert nichts. So kann eine Datei als Programm laufen **und** von anderen als Modul benutzt werden.
