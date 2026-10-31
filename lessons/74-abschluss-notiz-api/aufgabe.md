## Aufgabe: Die Notiz-API

**In `speicher.js`** (die Klasse `Speicher` ist fast fertig):

1. `laden(datei)` liest die JSON-Datei und gibt das Array zurück. Gibt es die Datei nicht (`ENOENT`), gibt sie `[]` zurück. Andere Fehler wirft sie weiter.
2. `#sichern()` legt den Ordner der Datei an (falls nötig), schreibt alle Notizen mit `JSON.stringify(…, null, 2)` hinein und löst das Event `"gespeichert"` mit der Anzahl der Notizen aus.

**In `main.js`:**

3. `bodyLesen(req)` liest den Body als Text.
4. Baue die Routen. Alle Antworten sind JSON (nutze `json(res, status, daten)`):
   - `GET /notizen` → `200` mit allen Notizen. Mit `?suche=tee` nur Notizen, deren Text das Wort enthält (Groß- und Kleinschreibung egal).
   - `POST /notizen` mit `{ "text": "…" }` → `201` mit der neuen Notiz. Ist der Body kein JSON oder `text` kein Text mit Inhalt: `400` mit `{ "fehler": "Text fehlt" }`.
   - `PATCH /notizen/:id` mit z. B. `{ "erledigt": true }` → `200` mit der geänderten Notiz, sonst `404`.
   - `DELETE /notizen/:id` → `204` ohne Inhalt, sonst `404`.
   - Alles andere → `404` mit `{ "fehler": "Nicht gefunden" }`.
   - Für unbekannte IDs: `404` mit `{ "fehler": "Notiz nicht gefunden" }`.
5. Bei jedem `"gespeichert"` gib aus: `Gespeichert: 3 Notizen` (mit der jeweiligen Anzahl).
6. Starte den Server auf `process.env.PORT` und gib aus: `Notiz-API läuft auf Port 3000`.

Tipp: Bau Schritt für Schritt und probiere jede Route im `listen`-Callback mit `fetch` aus.
