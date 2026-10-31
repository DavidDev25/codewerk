## Eine REST-API

Fast jede App spricht mit einer **API**: Die App schickt Anfragen, der Server antwortet mit JSON. Bei einer **REST-API** beschreibt die Adresse, *welche* Daten gemeint sind, und die Methode, *was* passieren soll:

| Methode | Adresse | Bedeutung | Antwort |
| --- | --- | --- | --- |
| `GET` | `/notizen` | alle Notizen lesen | `200` mit Liste |
| `POST` | `/notizen` | neue Notiz anlegen | `201` mit der neuen Notiz |
| `PATCH` | `/notizen/3` | Notiz 3 teilweise ändern | `200` mit der geänderten Notiz |
| `DELETE` | `/notizen/3` | Notiz 3 löschen | `204` ohne Inhalt |

Gibt es Notiz 3 nicht: `404`. Ist die Anfrage kaputt, etwa ohne Text: `400`.

:::alltag
Eine Bibliothek: `GET` ist nachschlagen, `POST` ein neues Buch einstellen, `PATCH` einen Vermerk im Buch ändern, `DELETE` das Buch aussortieren. Die Regalnummer (`/notizen/3`) sagt, welches Buch gemeint ist.
:::

## Den Body einer Anfrage lesen

Bei `POST` und `PATCH` schickt der Client Daten mit, den **Body**. Er kommt in Stücken an, weil große Uploads nicht auf einmal in den Speicher passen. `req` ist dafür ein **Stream**, den du mit `for await` liest (Async-Iteratoren aus Teil 4):

```js
async function bodyLesen(req) {
  let text = "";
  for await (const teil of req) text += teil;
  return text;
}
```

Danach wird aus dem Text ein Objekt. Aber Vorsicht: Der Client kann **alles** schicken. Ein Server darf bei kaputten Daten nie abstürzen:

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

Danach prüfst du die Felder: Ist `text` wirklich ein Text und nicht leer? Eingaben von außen sind nie vertrauenswürdig.

## Ein async-Handler

Weil das Lesen des Bodys wartet, ist der Handler `async`. Ein Fehler darin landet sonst als unbehandeltes Promise im Nichts. Deshalb fängt ein äußeres `try/catch` alles ab und antwortet mit `500`:

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

Interne Details (wie die Fehlermeldung) gehören ins Protokoll (`console.error`), nicht in die Antwort an Fremde.

## Projektaufbau mit ES-Modulen

Diesmal steht in `package.json` `"type": "module"`. Alle Dateien nutzen `import` und `export`:

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

Die Aufgaben sind sauber getrennt: `speicher.js` kümmert sich um die Daten und die Datei, `main.js` nur um HTTP. So kann man später die Datei durch eine Datenbank ersetzen, ohne den Server anzufassen.

## Ausprobieren

Im echten Terminal testet man APIs mit `curl`:

```bash
curl http://localhost:3000/notizen
curl -X POST -d '{"text":"Brot"}' http://localhost:3000/notizen
curl -X DELETE http://localhost:3000/notizen/1
```

In Codewerk nimmst du `fetch` im `listen`-Callback. Unter **Ausgabe** siehst du nach dem Lauf, wie `daten/notizen.json` aussieht.
