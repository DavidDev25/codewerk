## JavaScript ohne Browser

Bisher lief dein Code im Browser. **Node.js** ist ein Programm, das JavaScript ohne Browser ausführt: im Terminal, auf einem Server, in Werkzeugen wie Vite oder ESLint. Codewerk selbst läuft auf einem Server mit Node.js.

:::alltag
Ein Motor (die JavaScript-Sprache) kann in ein Auto (den Browser) oder in ein Boot (Node.js) eingebaut werden. Gas geben funktioniert gleich, aber das Boot hat kein Lenkrad und keine Bremsen, dafür eine Schraube und einen Anker. Genauso hat Node kein `document` und kein `window`, dafür Dateien, Netzwerk und Prozesse.
:::

| | Browser | Node.js |
| --- | --- | --- |
| Sprache | JavaScript | dasselbe JavaScript |
| Seite | `document`, `window` | gibt es nicht |
| Dateien | kein Zugriff | `fs` liest und schreibt Dateien |
| Server | nein | `http` beantwortet Anfragen |
| Programm-Infos | `location`, `navigator` | `process` |

In Codewerk ist Node **nachgebildet**: Dein Code läuft weiter sicher in deinem Browser, Dateien liegen nur im Speicher. Was du hier lernst, funktioniert aber genau so in echtem Node.

## Ein Programm starten

Im Terminal startest du ein Programm mit `node` und dem Dateinamen. Alles danach sind **Argumente**:

```bash
node main.js Mara 2
```

In Codewerk drückst du einfach **Ausführen**. Die Argumente dieser Lektion sind schon eingestellt: `Mara` und `2`.

## process.argv: die Argumente

`process` ist überall da, ohne `require`. `process.argv` ist ein Array mit allem aus der Befehlszeile:

```js
console.log(process.argv);
```

Die ersten zwei Einträge sind immer der Pfad zu Node und zu deiner Datei. Deine eigenen Argumente beginnen bei Index 2:

```js
const [name, anzahlText] = process.argv.slice(2);
console.log(name, Number(anzahlText));
```

Argumente sind **immer Texte**. Zahlen musst du selbst umwandeln.

## process.env: Umgebungsvariablen

Umgebungsvariablen sind Einstellungen von außen: Port, Datenbank-Adresse, geheime Schlüssel. So muss nichts davon im Code stehen.

```js
console.log(process.env.GRUSS);
console.log(process.env.PORT ?? "3000");
```

Fehlt eine Variable, ist sie `undefined`. Mit `??` setzt du einen Standardwert. Im Terminal setzt man sie z. B. so: `GRUSS=Moin node main.js`.

## Der Exit-Code: hat es geklappt?

Jedes Programm meldet beim Ende eine Zahl: `0` heißt „alles gut“, alles andere heißt „Fehler“. Andere Programme, Skripte und Server-Werkzeuge prüfen diese Zahl.

```js
console.error("Etwas fehlt!");
process.exitCode = 1;
```

- `console.error` schreibt in den Fehlerkanal (stderr), `console.log` in die normale Ausgabe (stdout).
- `process.exitCode = 1` setzt den Code und lässt das Programm normal zu Ende laufen.
- `process.exit(1)` bricht **sofort** ab. Das ist selten nötig und kann z. B. halb geschriebene Dateien hinterlassen.

## Eine Besonderheit: process.nextTick

Node hat eine eigene, sehr eilige Warteschlange: `process.nextTick` kommt noch **vor** Promises dran.

```js
Promise.resolve().then(() => console.log("Promise"));
process.nextTick(() => console.log("nextTick"));
setTimeout(() => console.log("Timer"), 0);
console.log("sofort");
```

Die Reihenfolge ist: sofort, nextTick, Promise, Timer. Die Event Loop aus Teil 3 gilt also auch hier, mit einer Stufe mehr.
