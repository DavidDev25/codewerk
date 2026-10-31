## Aufgabe: Die Notiz-API

Zum Abschluss baust du eine echte kleine REST-API für Notizen. `speicher.js` verwaltet die Notizen und die Datei. Die Klasse `Speicher` ist schon fast fertig. `main.js` beantwortet die Anfragen. Bau Schritt für Schritt und probiere jede Route im `listen`-Callback mit `fetch` aus.

### Schritt 1: Laden

Öffne `speicher.js`. `laden(datei)` liest die JSON-Datei und gibt das Array zurück:

```js
laden(".../daten/notizen.json");  // die gespeicherten Notizen
laden(".../gibt-es-nicht.json");  // []
```

So gehst du vor:

1. Gib im `try`-Block `JSON.parse(readFileSync(datei, "utf8"))` zurück.
2. Hat der Fehler im `catch` den Code `"ENOENT"`, gib `[]` zurück.
3. Jeden anderen Fehler wirfst du weiter, zum Beispiel kaputtes JSON.

### Schritt 2: Sichern

Die private Methode `#sichern()` wird nach jeder Änderung aufgerufen. So gehst du vor:

1. Lege den Ordner der Datei an: `mkdirSync(path.dirname(this.#datei), { recursive: true })`.
2. Schreibe mit `writeFileSync` alle Notizen als `JSON.stringify(this.#notizen, null, 2)` in die Datei.
3. Löse mit `this.emit("gespeichert", …)` das Event aus und gib die Anzahl der Notizen mit.

### Schritt 3: Den Body lesen

Wechsle zu `main.js`. Schreibe `bodyLesen(req)` genau wie in der Erklärung, mit `for await`.

### Schritt 4: Die Routen

Alle Antworten sind JSON. Benutze dafür die Hilfsfunktion `json(res, status, daten)`. In `bearbeiten` steht schon `einzeln`. Passt die Adresse auf `/notizen/3`, steht darin die Nummer, sonst ist es `null`.

```js
// GET    /notizen             → 200, alle Notizen
// GET    /notizen?suche=tee   → 200, nur Notizen mit „tee“ im Text
// POST   /notizen {"text":"Brot"}   → 201, die neue Notiz
// POST   /notizen {"text":""}       → 400, { fehler: "Text fehlt" }
// PATCH  /notizen/1 {"erledigt":true} → 200, die geänderte Notiz
// DELETE /notizen/1           → 204 ohne Inhalt
// PATCH oder DELETE mit unbekannter Nummer → 404, { fehler: "Notiz nicht gefunden" }
// alles andere → 404, { fehler: "Nicht gefunden" }
```

So gehst du vor:

1. **Lesen:** Bei `GET` auf `/notizen` holst du `speicher.alle()`. Gibt es `suche` in den Suchangaben, filterst du mit `toLowerCase()` und `includes`, sodass Groß- und Kleinschreibung egal ist.
2. **Anlegen:** Bei `POST` auf `/notizen` liest du den Body und machst mit `JSON.parse` ein Objekt daraus. Klappt das nicht, oder ist `text` kein Text mit Inhalt, antworte mit 400. Sonst antworte mit 201 und `speicher.hinzufuegen(daten.text)`.
3. **Ändern:** Bei `PATCH` mit `einzeln` rufst du `speicher.aendern(Number(einzeln[1]), daten)` auf. Kommt `null` zurück, antworte mit 404.
4. **Löschen:** Bei `DELETE` mit `einzeln` rufst du `speicher.loeschen(…)` auf. Bei `false` antworte mit 404. Sonst antworte mit 204 und `res.end()` ohne Inhalt.
5. Verlasse den Handler nach jeder Antwort mit `return`. Die letzte Zeile mit „Nicht gefunden“ fängt dann alles Übrige ab.

Wichtig: Eine `204`-Antwort hat keinen Inhalt. Benutze dafür nicht `json`, sondern `res.writeHead(204)` und `res.end()`.

### Schritt 5: Mitschreiben

Melde oben in `main.js` mit `speicher.on("gespeichert", …)` einen Listener an. Er gibt bei jedem Speichern die Anzahl aus:

```text
Gespeichert: 3 Notizen
```

### Schritt 6: Den Server starten

Starte den Server mit `server.listen` auf dem Port aus `process.env.PORT`, sonst auf 3000. Gib im Callback aus:

```text
Notiz-API läuft auf Port 3000
```
