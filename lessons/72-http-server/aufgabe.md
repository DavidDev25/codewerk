## Aufgabe: Eine Produkt-API

In `main.js` stehen schon drei Produkte, die Hilfsfunktion `json` und ein Server, der bisher auf alles mit 404 antwortet. Du baust den Handler so aus, dass er die Produkte ausliefert. Die Tests schicken echte Anfragen an deinen Server. Du kannst ihn im `listen`-Callback auch selbst mit `fetch` ausprobieren.

### Schritt 1: Die Startseite

```js
// GET /
// Status 200, Text: Willkommen im Laden-Server
```

Prüfe, ob `req.method` gleich `"GET"` und `url.pathname` gleich `"/"` ist. Antworte dann mit `res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })` und schicke den Text mit `res.end` ab.

Wichtig: Nach jeder Antwort musst du den Handler mit `return` verlassen. Sonst läuft er weiter bis zur 404-Zeile am Ende und versucht, ein zweites Mal zu antworten.

### Schritt 2: Alle Produkte

```js
// GET /api/produkte         → 200, alle drei Produkte
// GET /api/produkte?max=5   → 200, nur Tee und Kakao
```

So gehst du vor:

1. Prüfe auf `GET` und den Pfad `/api/produkte`.
2. Lies mit `url.searchParams.get("max")` die Höchstgrenze.
3. Gibt es sie, filtere die Produkte mit `p.preis <= Number(max)`. Sonst nimm alle.
4. Antworte mit `json(res, 200, liste)`.

### Schritt 3: Ein einzelnes Produkt

```js
// GET /api/produkte/2   → 200, { id: 2, name: "Kaffee", preis: 6 }
// GET /api/produkte/99  → 404, { fehler: "Produkt nicht gefunden" }
```

So gehst du vor:

1. Prüfe den Pfad mit dem regulären Ausdruck aus der Erklärung: `/^\/api\/produkte\/(\d+)$/.exec(url.pathname)`.
2. Gibt es einen Treffer, suche mit `find` das Produkt mit `id === Number(treffer[1])`.
3. Gibt es das Produkt, antworte mit 200 und dem Produkt. Sonst antworte mit 404 und `{ fehler: "Produkt nicht gefunden" }`.

### Schritt 4: Alles andere

Die letzte Zeile im Handler antwortet schon mit 404 und `{ fehler: "Seite nicht gefunden" }`. Sie bleibt stehen und fängt alle übrigen Anfragen ab.

### Schritt 5: Den Server starten

```text
Server läuft auf Port 3000
```

So gehst du vor:

1. Lege `const port = Number(process.env.PORT ?? 3000);` an.
2. Starte den Server mit `server.listen(port, () => { ... })`.
3. Gib im Callback den Satz oben mit dem Port aus.
