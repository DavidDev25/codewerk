## Was ein Server macht

In Teil 3 hast du mit `fetch` Anfragen **gestellt**. Jetzt baust du die andere Seite: einen Server, der Anfragen **beantwortet**. Jede Webseite und jede App funktioniert so, auch Codewerk.

:::alltag
Ein Server ist wie die Theke einer Bäckerei. Die Kundschaft sagt, was sie will. Dazu gehört die **Methode**, zum Beispiel GET für „ich möchte haben“, und die **Adresse**, zum Beispiel `/brot`. Die Verkäuferin schaut nach und antwortet. Entweder gibt sie die Ware mit einem Etikett heraus, auf dem steht, was drin ist. Das ist der **Content-Type**. Oder sie sagt „haben wir nicht“. Das ist der **Status 404**.
:::

## Der kleinste Server

Im Beispiel antwortet ein Server auf jede Anfrage mit demselben Text:

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

Ausgegeben wird „Server läuft auf http://localhost:3000“. Der Server wartet jetzt auf Anfragen. Jede bekommt die Antwort „Hallo vom Server!“.

- `createServer` bekommt eine Funktion, den **Handler**. Er läuft bei **jeder** Anfrage.
- `req` ist die Anfrage, auf Englisch „request“. Darin stehen `req.method`, `req.url` und `req.headers`.
- `res` ist die Antwort, auf Englisch „response“. Du setzt Statuscode und Header und schickst sie dann mit `res.end(…)` ab.
- `listen(3000)` öffnet den Port 3000. Der Server ist ein `EventEmitter`, und jede Anfrage ist ein `"request"`-Event.

**Jeder Weg durch den Handler muss `res.end(…)` aufrufen.** Sonst wartet der Browser ewig. Außerdem nimmt `res.end` nur Text. Objekte musst du vorher mit `JSON.stringify` umwandeln.

## Wichtige Statuscodes

| Code | Bedeutung |
| --- | --- |
| `200` | OK |
| `201` | Created: etwas wurde angelegt |
| `204` | No Content: hat geklappt, aber es gibt nichts zurückzugeben |
| `400` | Bad Request: die Anfrage ist falsch |
| `404` | Not Found: gibt es nicht |
| `405` | Method Not Allowed: die Adresse stimmt, die Methode nicht |
| `500` | Internal Server Error: der Server hat einen Fehler |

## Anfragen verteilen

Ein Server hat viele Adressen. Welche Antwort passt, entscheidest du anhand von Methode und Pfad. Das nennt man **Routing**. `req.url` enthält auch die Suchangaben, zum Beispiel `/suche?q=tee`. Deshalb zerlegst du sie mit `URL` aus Lektion 66:

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

Ausgegeben wird „200 Gesucht: tee“. Der Server schickt sich im `listen`-Callback selbst eine Anfrage an `/suche?q=tee`. Der Handler landet im zweiten Zweig und liest `q` aus. `new URL` braucht dabei eine Basisadresse wie `"http://localhost"`, weil `req.url` nur den Pfad enthält.

In Codewerk kannst du deinen Server genau so mit `fetch("http://localhost:3000/…")` ausprobieren.

## JSON ausliefern

Server für Apps antworten meistens mit JSON. Ein Server, der so Daten anbietet, ist eine **API**. Der Header `Content-Type: application/json` sagt dem Gegenüber, dass JSON kommt. Eine kleine Hilfsfunktion spart viel Wiederholung:

```js
function json(res, status, daten) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(daten));
}
```

Mit `json(res, 200, produkte)` schickst du dann eine ganze Liste mit einer Zeile ab.

## Teile der Adresse auslesen

Für Adressen wie `/api/produkte/2` nimmst du einen regulären Ausdruck mit Gruppe:

```js
const treffer = /^\/api\/produkte\/(\d+)$/.exec("/api/produkte/2");
console.log(treffer && Number(treffer[1]));
```

Ausgegeben wird 2. Die Gruppe `(\d+)` fängt die Zahl am Ende ein. Passt die Adresse nicht, ist `treffer` gleich `null`, und `treffer && …` gibt `null` zurück, statt abzustürzen.

Frameworks wie **Express** machen genau das bequemer, zum Beispiel mit `app.get("/api/produkte/:id", …)`. Darunter steckt aber dasselbe `node:http`, das du gerade lernst.

## Den Port von außen festlegen

Auf echten Servern bestimmt die Umgebung, auf welchem Port das Programm läuft:

```js
const port = Number(process.env.PORT ?? 3000);
console.log(port);
```

Ausgegeben wird 3000, weil `PORT` hier nicht gesetzt ist. Auf einem Server, auf dem `PORT=8080` gesetzt ist, liefe das Programm stattdessen auf 8080.
