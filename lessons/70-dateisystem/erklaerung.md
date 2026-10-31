## Dateien: das Gedächtnis eines Programms

Variablen sind weg, sobald ein Programm endet. Was bleiben soll, landet in **Dateien**: Einstellungen, Protokolle und Daten. In Node erledigt das das eingebaute Modul `node:fs`. Die Abkürzung steht für „file system“, also Dateisystem.

:::alltag
`fs` ist wie ein Aktenschrank. Du kannst Ordner anlegen, Blätter herausnehmen und lesen, neue Blätter einheften oder unten auf ein Blatt etwas dazuschreiben. Und manchmal ist eine Akte einfach nicht da.
:::

In Codewerk liegt das Dateisystem im Speicher. Es startet bei jedem Lauf mit den Dateien aus dem Editor. Was dein Programm ändert, siehst du im Reiter **Ausgabe** unter „Dateien nach dem Lauf“.

## Lesen und schreiben

Im Beispiel liest du die Notizen, schreibst eine neue Datei und hängst eine Zeile an:

```js
const fs = require("node:fs");

const text = fs.readFileSync("notizen.txt", "utf8");
console.log(text);

fs.writeFileSync("gruss.txt", "Hallo Datei!");
fs.appendFileSync("notizen.txt", "\nNeue Zeile");
```

Ausgegeben wird der Inhalt von `notizen.txt`. Danach gibt es eine neue Datei `gruss.txt`, und in `notizen.txt` steht unten eine Zeile mehr. Beides siehst du unter „Dateien nach dem Lauf“.

- Ohne `"utf8"` liefert echtes Node rohe Bytes statt Text, einen sogenannten **Buffer**. Gib die Kodierung deshalb immer an.
- `writeFileSync` **ersetzt** den ganzen Inhalt. `appendFileSync` hängt hinten an.
- Gespeichert wird nur Text. Objekte wandelst du vorher um: `JSON.stringify(daten, null, 2)`. Beim Lesen geht es mit `JSON.parse(text)` zurück.

## Ordner

Im Beispiel legst du zwei Ordner ineinander an und speicherst darin eine Datei:

```js
const fs = require("node:fs");

fs.mkdirSync("berichte/2026", { recursive: true });
fs.writeFileSync("berichte/2026/januar.txt", "Alles gut.");
console.log(fs.readdirSync("berichte"));
console.log(fs.existsSync("berichte/2026/januar.txt"));
```

Ausgegeben werden `["2026"]` und `true`. `readdirSync` listet auf, was in einem Ordner liegt. `existsSync` prüft, ob es einen Pfad gibt.

`{ recursive: true }` legt auch fehlende Zwischenordner an. Hier entsteht also zuerst `berichte` und darin `2026`. Gibt es den Ordner schon, gibt es keinen Fehler.

## Pfade mit node:path

Pfade als Text zusammenzukleben geht schnell schief: doppelte Schrägstriche, Windows mit `\` oder `..` an der falschen Stelle. `path` erledigt das sauber:

```js
const path = require("node:path");

console.log(path.join(__dirname, "texte", "gedicht.txt"));
console.log(path.basename("/projekt/texte/gedicht.txt"));
console.log(path.extname("gedicht.txt"));
console.log(path.dirname("/projekt/texte/gedicht.txt"));
```

Ausgegeben werden „/projekt/texte/gedicht.txt“, „gedicht.txt“, „.txt“ und „/projekt/texte“. `join` setzt Teile zusammen. `basename` liefert den Dateinamen, `extname` die Endung und `dirname` den Ordner.

Mit `__dirname` hängt der Pfad an deiner Datei und nicht daran, aus welchem Ordner jemand `node` gestartet hat.

## Wenn eine Datei fehlt

Geht etwas schief, wirft `fs` einen Fehler mit einem **Code**. Den kannst du gezielt prüfen:

| Code | Bedeutung |
| --- | --- |
| `ENOENT` | Datei oder Ordner gibt es nicht |
| `EEXIST` | gibt es schon, zum Beispiel bei `mkdirSync` ohne `recursive` |
| `EISDIR` | das ist ein Ordner, keine Datei |
| `ENOTDIR` | ein Teil des Pfades ist kein Ordner |

Im Beispiel liefert `lesen` für eine fehlende Datei einen leeren Text:

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

Ausgegeben wird `""`, also ein leerer Text. Die Datei fehlt, der Fehler hat den Code `ENOENT`, und `lesen` gibt deshalb `""` zurück.

Wichtig: Fange nur den **erwarteten** Fehler ab und wirf alles andere mit `throw fehler;` weiter. Sonst verschluckst du echte Probleme. Das kennst du schon aus Lektion 40.

## Drei Schreibweisen für dieselbe Arbeit

Dateizugriffe dauern. Ein Server soll in der Zwischenzeit andere Anfragen beantworten können. Deshalb gibt es jede Funktion in drei Formen. Im Beispiel liest du dieselbe Datei auf alle drei Arten:

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

Die Zahlen vor den Ausgaben zeigen die Reihenfolge. Die synchrone Form wartet, bis die Datei gelesen ist. Die beiden anderen lesen im Hintergrund weiter. Deshalb erscheint „2. weiter geht's“ vor den Ergebnissen von Callback und Promise.

| Form | Wann |
| --- | --- |
| `readFileSync` | Skripte und Start eines Programms, einfach und klar |
| `readFile(…, callback)` | ältere Programme. Der Callback bekommt immer zuerst den Fehler |
| `await fsp.readFile(…)` | Server und moderne Programme, am besten lesbar mit `async` und `await` |
