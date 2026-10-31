## Was ein Server macht

In Teil 3 hast du mit `fetch` Anfragen **gestellt**. Jetzt baust du die andere Seite: einen Server, der Anfragen **beantwortet**. Jede Webseite, jede App und auch Codewerk funktioniert so.

:::alltag
Ein Server ist wie die Theke einer Bäckerei. Kundschaft sagt, was sie will (**Methode** wie GET und **Adresse** wie `/brot`). Die Verkäuferin schaut nach und gibt eine Antwort: die Ware mit einem Etikett, was drin ist (**Content-Type**), oder „haben wir nicht“ (**Status 404**).
:::

## Der kleinste Server

```js
const http = require("node:http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hallo vom Server!");
});

server.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
```

- `createServer` bekommt eine Funktion, den **Handler**. Er läuft bei **jeder** Anfrage.
- `req` (request) ist die Anfrage: `req.method`, `req.url`, `req.headers`.
- `res` (response) ist die Antwort: Statuscode und Header setzen, dann mit `res.end(…)` abschicken.
- `listen(3000)` öffnet den Port. Der Server ist ein `EventEmitter`: Jede Anfrage ist ein `"request"`-Event.

**Jeder Weg durch den Handler muss `res.end(…)` aufrufen.** Sonst wartet der Browser ewig. Und `res.end` nimmt nur Text: Objekte musst du mit `JSON.stringify` umwandeln.

## Wichtige Statuscodes

| Code | Bedeutung |
| --- | --- |
| `200` | OK |
| `201` | Created: etwas wurde angelegt |
| `204` | No Content: erfolgreich, aber nichts zurückzugeben |
| `400` | Bad Request: die Anfrage ist falsch |
| `404` | Not Found: gibt es nicht |
| `405` | Method Not Allowed: Adresse stimmt, Methode nicht |
| `500` | Internal Server Error: der Server hat einen Fehler |

## Routing: Anfragen verteilen

Ein Server hat viele Adressen. Welche Antwort passt, entscheidest du anhand von Methode und Pfad. `req.url` enthält auch den Query-Teil (`/suche?q=tee`), deshalb zerlegst du sie mit `URL`:

```js
const http = require("node:http");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Startseite");
  } else if (req.method === "GET" && url.pathname === "/suche") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Gesucht: " + url.searchParams.get("q"));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Nicht gefunden");
  }
});

server.listen(3000, async () => {
  const antwort = await fetch("http://localhost:3000/suche?q=tee");
  console.log(antwort.status, await antwort.text());
});
```

In Codewerk kannst du deinen Server direkt mit `fetch("http://localhost:3000/…")` ausprobieren, so wie oben im `listen`-Callback.

## JSON ausliefern: eine API

Server für Apps antworten meist mit JSON. Der Header `Content-Type: application/json` sagt dem Gegenüber, was kommt:

```js
function json(res, status, daten) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(daten));
}
```

Eine kleine Hilfsfunktion wie diese spart viel Wiederholung.

## Teile der Adresse auslesen

Für Adressen wie `/api/produkte/2` nimmst du einen regulären Ausdruck mit Gruppe:

```js
const treffer = /^\/api\/produkte\/(\d+)$/.exec("/api/produkte/2");
console.log(treffer && Number(treffer[1]));
```

Frameworks wie **Express** machen genau das bequemer (`app.get("/api/produkte/:id", …)`). Darunter steckt aber dasselbe `node:http`, das du gerade lernst.

## Den Port von außen festlegen

Auf echten Servern bestimmt die Umgebung den Port:

```js
const port = Number(process.env.PORT ?? 3000);
console.log(port);
```
