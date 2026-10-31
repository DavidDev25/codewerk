## Eine REST-API

Fast jede App spricht mit einer **API**. Die App schickt Anfragen, und der Server antwortet mit JSON. Bei einer **REST-API** gibt es dafür eine feste Regel: Die Adresse sagt, *welche* Daten gemeint sind. Die Methode sagt, *was* mit ihnen passieren soll.

| Methode | Adresse | Bedeutung | Antwort |
| --- | --- | --- | --- |
| `GET` | `/notizen` | alle Notizen lesen | `200` mit Liste |
| `POST` | `/notizen` | neue Notiz anlegen | `201` mit der neuen Notiz |
| `PATCH` | `/notizen/3` | Notiz 3 teilweise ändern | `200` mit der geänderten Notiz |
| `DELETE` | `/notizen/3` | Notiz 3 löschen | `204` ohne Inhalt |

Gibt es Notiz 3 nicht, antwortet der Server mit `404`. Ist die Anfrage kaputt, etwa weil der Text fehlt, antwortet er mit `400`.

:::alltag
Denk an eine Bibliothek. `GET` ist nachschlagen, `POST` ein neues Buch einstellen, `PATCH` einen Vermerk im Buch ändern und `DELETE` das Buch aussortieren. Die Regalnummer, hier `/notizen/3`, sagt, welches Buch gemeint ist.
:::

## Den Inhalt einer Anfrage lesen

Bei `POST` und `PATCH` schickt die App Daten mit. Diese Daten heißen **Body**. Sie kommen in Stücken an, weil große Uploads nicht auf einmal in den Speicher passen. `req` ist dafür ein **Stream**, also ein Datenstrom. Du liest ihn mit `for await`, wie die Async-Iteratoren aus Lektion 50:

```js
async function bodyLesen(req) {
  let text = "";
  for await (const teil of req) text += teil;
  return text;
}
```

Die Schleife hängt jedes ankommende Stück an `text` an. Ist der Strom zu Ende, gibt die Funktion den ganzen Text zurück.

Danach wird aus dem Text ein Objekt. Aber Vorsicht: Die App kann **alles** schicken. Ein Server darf bei kaputten Daten nie abstürzen:

```js
function jsonLesen(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

console.log(jsonLesen('{"text":"Tee"}'), jsonLesen("kaputt{"));
```

Ausgegeben werden `{ text: "Tee" }` und `null`. Den kaputten Text fängt `catch` ab, statt dass der Server abstürzt.

Danach prüfst du die Felder. Ist `text` wirklich ein Text und nicht leer? Eingaben von außen darfst du nie einfach vertrauen.

## Ein Handler, der warten kann

Weil das Lesen des Bodys wartet, ist der Handler `async`. Ein Fehler darin würde sonst als abgelehntes Promise unbemerkt verschwinden, und die Anfrage bekäme nie eine Antwort. Deshalb fängt ein äußeres `try` und `catch` alles ab und antwortet mit `500`:

```js
import http from "node:http";

const server = http.createServer(async (req, res) => {
  try {
    await bearbeiten(req, res);
  } catch (fehler) {
    console.error(fehler);
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ fehler: "Interner Fehler" }));
  }
});

async function bearbeiten(req, res) {
  throw new Error("Ups");
}

server.listen(3000, async () => {
  console.log((await fetch("http://localhost:3000/")).status);
});
```

Ausgegeben werden der Fehler „Error: Ups“ im Fehlerkanal und danach 500. `bearbeiten` wirft absichtlich einen Fehler. Der äußere `catch` schreibt ihn ins Protokoll und schickt der App eine allgemeine Antwort.

Interne Angaben wie die echte Fehlermeldung gehören ins Protokoll, also in `console.error`. In der Antwort an Fremde haben sie nichts zu suchen.

## Projektaufbau mit ES-Modulen

Diesmal steht in `package.json` der Eintrag `"type": "module"`. Alle Dateien benutzen deshalb `import` und `export`:

```mjs
// speicher.js
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";

export class Speicher extends EventEmitter { /* … */ }
```

```mjs
// main.js
import http from "node:http";
import path from "node:path";
import { Speicher } from "./speicher.js";

const speicher = new Speicher(path.join(import.meta.dirname, "daten", "notizen.json"));
```

Die Aufgaben sind sauber getrennt. `speicher.js` kümmert sich um die Daten und die Datei, `main.js` nur um HTTP. So kann man später die Datei durch eine Datenbank ersetzen, ohne den Server anzufassen.

## Ausprobieren

Im echten Terminal testet man APIs mit dem Programm `curl`:

```bash
curl http://localhost:3000/notizen
curl -X POST -d '{"text":"Brot"}' http://localhost:3000/notizen
curl -X DELETE http://localhost:3000/notizen/1
```

Die erste Zeile holt alle Notizen, die zweite legt eine an und die dritte löscht Notiz 1. In Codewerk nimmst du stattdessen `fetch` im `listen`-Callback. Im Reiter **Ausgabe** siehst du nach dem Lauf, wie `daten/notizen.json` aussieht.
