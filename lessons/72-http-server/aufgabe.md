## Aufgabe: Eine Produkt-API

Die Produkte stehen schon in `main.js`. Baue den Handler in `http.createServer(…)`:

1. `GET /` antwortet mit Status `200`, Content-Type `text/plain; charset=utf-8` und dem Text `Willkommen im Laden-Server`.
2. `GET /api/produkte` antwortet mit `200` und **allen** Produkten als JSON (Content-Type `application/json; charset=utf-8`).
3. `GET /api/produkte?max=5` liefert nur Produkte mit `preis <= 5`. Ohne `max` kommen alle.
4. `GET /api/produkte/2` liefert das Produkt mit der `id` 2 als JSON. Gibt es die ID nicht: Status `404` und `{ "fehler": "Produkt nicht gefunden" }`.
5. Jede andere Anfrage: Status `404` und `{ "fehler": "Seite nicht gefunden" }`.
6. Starte den Server auf dem Port aus `process.env.PORT` (sonst `3000`) und gib im `listen`-Callback aus: `Server läuft auf Port 3000`.

Die Tests schicken echte Anfragen an deinen Server. Du kannst ihn im `listen`-Callback auch selbst mit `fetch` ausprobieren.
