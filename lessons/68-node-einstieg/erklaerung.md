## JavaScript ohne Browser

Bisher lief dein Code im Browser. **Node.js** ist ein Programm, das JavaScript ohne Browser ausführt: im Terminal, auf einem Server oder in Werkzeugen wie Vite und ESLint. Auch Codewerk selbst läuft auf einem Server mit Node.js.

:::alltag
Ein Motor kann in ein Auto oder in ein Boot eingebaut werden. Gas geben funktioniert gleich, aber das Boot hat keine Räder, dafür eine Schraube und einen Anker. Die Sprache JavaScript ist der Motor, der Browser das Auto und Node.js das Boot. Node hat kein `document` und kein `window`, dafür Dateien, Netzwerk und Prozesse.
:::

| | Browser | Node.js |
| --- | --- | --- |
| Sprache | JavaScript | dasselbe JavaScript |
| Seite | `document`, `window` | gibt es nicht |
| Dateien | kein Zugriff | `fs` liest und schreibt Dateien |
| Server | nein | `http` beantwortet Anfragen |
| Infos zum Programm | `location`, `navigator` | `process` |

In Codewerk ist Node **nachgebildet**. Dein Code läuft weiter sicher in deinem Browser, und Dateien liegen nur im Speicher. Was du hier lernst, funktioniert aber genauso in echtem Node.

## Ein Programm starten

Im Terminal startest du ein Programm mit `node` und dem Dateinamen. Alles danach sind **Argumente**, also zusätzliche Angaben für das Programm:

```bash
node main.js Mara 2
```

In Codewerk drückst du einfach **Ausführen**. Die Argumente dieser Lektion sind schon eingestellt: `Mara` und `2`.

## Die Argumente lesen

`process` ist überall da, ohne dass du es laden musst. `process.argv` ist ein Array mit allem aus der Befehlszeile:

```js
console.log(process.argv);
```

Ausgegeben wird `["/usr/local/bin/node", "/projekt/main.js", "Mara", "2"]`. Die ersten zwei Einträge sind immer der Pfad zu Node und der Pfad zu deiner Datei. Deine eigenen Argumente beginnen deshalb bei Position 2:

```js
const [name, anzahlText] = process.argv.slice(2);
console.log(name, Number(anzahlText));
```

Ausgegeben wird „Mara 2“. `slice(2)` schneidet die ersten zwei Einträge ab, und Destructuring packt den Rest in zwei Variablen. Argumente sind **immer Texte**. Zahlen musst du deshalb selbst mit `Number` umwandeln.

## Umgebungsvariablen

Umgebungsvariablen sind Einstellungen, die von außen kommen, zum Beispiel ein Port, eine Datenbank-Adresse oder ein geheimer Schlüssel. So muss nichts davon im Code stehen. Du liest sie aus `process.env`:

```js
console.log(process.env.GRUSS);
console.log(process.env.PORT ?? "3000");
```

Ausgegeben werden „Moin“ und „3000“. `GRUSS` ist in dieser Lektion eingestellt. `PORT` fehlt, ist also `undefined`, und `??` setzt den Standardwert. Im Terminal setzt man eine Umgebungsvariable zum Beispiel so: `GRUSS=Moin node main.js`.

## Hat es geklappt?

Jedes Programm meldet am Ende eine Zahl, den **Exit-Code**. `0` heißt „alles gut“, jede andere Zahl heißt „Fehler“. Andere Programme und Server-Werkzeuge prüfen diese Zahl. Im Beispiel meldet das Programm einen Fehler:

```js
console.error("Etwas fehlt!");
process.exitCode = 1;
```

„Etwas fehlt!“ erscheint als Fehlermeldung, und Codewerk zeigt an, dass das Programm mit dem Exit-Code 1 endet.

- `console.error` schreibt in den Fehlerkanal, `console.log` in die normale Ausgabe. Auf Englisch heißen die beiden stderr und stdout.
- `process.exitCode = 1` setzt den Code und lässt das Programm normal zu Ende laufen.
- `process.exit(1)` bricht **sofort** ab. Das ist selten nötig und kann zum Beispiel halb geschriebene Dateien hinterlassen.

## Eine Besonderheit: process.nextTick

Node hat eine eigene, besonders eilige Warteschlange. Was du mit `process.nextTick` einplanst, kommt noch **vor** den Promises dran:

```js
Promise.resolve().then(() => console.log("Promise"));
process.nextTick(() => console.log("nextTick"));
setTimeout(() => console.log("Timer"), 0);
console.log("sofort");
```

Die Reihenfolge ist „sofort“, „nextTick“, „Promise“ und „Timer“. Der Event Loop aus Lektion 43 gilt also auch hier, nur mit einer Stufe mehr.
