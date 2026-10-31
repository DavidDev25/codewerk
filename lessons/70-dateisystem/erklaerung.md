## Dateien: das Gedächtnis eines Programms

Variablen sind weg, sobald ein Programm endet. Was bleiben soll, landet in **Dateien**: Einstellungen, Protokolle, Daten. In Node erledigt das das eingebaute Modul `node:fs` (file system).

:::alltag
`fs` ist wie ein Aktenschrank: Ordner anlegen, Blätter herausnehmen (lesen), neue Blätter einheften (schreiben) oder unten etwas dazuschreiben (anhängen). Und manchmal ist eine Akte einfach nicht da.
:::

In Codewerk liegt das Dateisystem im Speicher. Es startet bei jedem Lauf mit den Dateien aus dem Editor. Was dein Programm ändert, siehst du unter **Ausgabe** bei „Dateien nach dem Lauf“.

## Lesen und schreiben

```js
const fs = require("node:fs");

const text = fs.readFileSync("notizen.txt", "utf8");
console.log(text);

fs.writeFileSync("gruss.txt", "Hallo Datei!");
fs.appendFileSync("notizen.txt", "\nNeue Zeile");
```

- Ohne `"utf8"` liefert echtes Node einen **Buffer** (rohe Bytes) statt Text. Gib die Kodierung also immer an.
- `writeFileSync` **ersetzt** den ganzen Inhalt, `appendFileSync` hängt hinten an.
- Gespeichert wird nur Text. Objekte wandelst du vorher um: `JSON.stringify(daten, null, 2)`. Beim Lesen wieder zurück: `JSON.parse(text)`.

## Ordner

```js
const fs = require("node:fs");

fs.mkdirSync("berichte/2026", { recursive: true });
fs.writeFileSync("berichte/2026/januar.txt", "Alles gut.");
console.log(fs.readdirSync("berichte"));
console.log(fs.existsSync("berichte/2026/januar.txt"));
```

`{ recursive: true }` legt auch fehlende Zwischenordner an und meckert nicht, wenn der Ordner schon existiert.

## Pfade mit node:path

Pfade als Text zusammenzukleben geht schnell schief: doppelte `/`, Windows mit `\`, `..` an der falschen Stelle. `path` erledigt das sauber:

```js
const path = require("node:path");

console.log(path.join(__dirname, "texte", "gedicht.txt"));
console.log(path.basename("/projekt/texte/gedicht.txt"));
console.log(path.extname("gedicht.txt"));
console.log(path.dirname("/projekt/texte/gedicht.txt"));
```

Mit `__dirname` hängt der Pfad an der Datei, nicht daran, aus welchem Ordner jemand `node` gestartet hat.

## Wenn eine Datei fehlt: Fehlercodes

Geht etwas schief, wirft `fs` einen Fehler mit einem **Code**. Den prüfst du gezielt:

| Code | Bedeutung |
| --- | --- |
| `ENOENT` | Datei oder Ordner gibt es nicht |
| `EEXIST` | gibt es schon (z. B. bei `mkdirSync` ohne `recursive`) |
| `EISDIR` | das ist ein Ordner, keine Datei |
| `ENOTDIR` | ein Teil des Pfades ist kein Ordner |

```js
const fs = require("node:fs");

function lesen(pfad) {
  try {
    return fs.readFileSync(pfad, "utf8");
  } catch (fehler) {
    if (fehler.code === "ENOENT") return "";
    throw fehler;
  }
}

console.log(JSON.stringify(lesen("gibt-es-nicht.txt")));
```

Wichtig: Nur den **erwarteten** Fehler abfangen und alles andere mit `throw fehler;` weiterwerfen. Sonst verschluckst du echte Probleme.

## Drei Schreibweisen für dieselbe Arbeit

Dateizugriffe dauern. Ein Server soll in der Zwischenzeit andere Anfragen beantworten. Deshalb gibt es jede Funktion in drei Formen:

```js
const fs = require("node:fs");
const fsp = require("node:fs/promises");

const a = fs.readFileSync("notizen.txt", "utf8");
console.log("1. synchron:", a.length);

fs.readFile("notizen.txt", "utf8", (fehler, b) => {
  console.log("3. Callback:", b.length);
});

fsp.readFile("notizen.txt", "utf8").then((c) => console.log("4. Promise:", c.length));
console.log("2. weiter geht's");
```

| Form | Wann |
| --- | --- |
| `readFileSync` | Skripte und Start eines Programms, einfach und klar |
| `readFile(…, callback)` | ältere Programme. Der Callback bekommt immer zuerst den Fehler |
| `await fsp.readFile(…)` | Server und moderne Programme. Am besten lesbar mit `async`/`await` |
