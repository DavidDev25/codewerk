# Codewerk – deine persönliche JavaScript-Lernplattform

Codewerk bringt dir JavaScript bei, von den Grundlagen bis zur objektorientierten Programmierung (OOP). Es gibt 15 kurze Lektionen. Jede hat eine kleine Erklärung, eine Aufgabe, automatische Tests, ein Diagramm deines Codes und einen KI-Tutor.

Dein Code und dein Fortschritt werden automatisch auf deinem Server gespeichert. Beim nächsten Öffnen geht es genau dort weiter, wo du aufgehört hast.

---

## 1. Starten auf deinem Server

Du brauchst auf dem Server **Docker** mit dem Befehl `docker compose`. Beim ersten Bauen braucht der Server Internet, um die Pakete zu laden.

**Schritt 1: ZIP entpacken und in den Ordner wechseln**

```bash
unzip codewerk.zip
cd codewerk
```

**Schritt 2: Konfigurationsdatei anlegen**

```bash
cp .env.example .env
nano .env
```

Trage dort ein:

| Eintrag | Bedeutung |
| --- | --- |
| `OMNIROUTE_API_KEY` | dein API-Key aus OmniRoute |
| `OMNIROUTE_MODEL` | Name des Modells oder der Combo, wie in OmniRoute |
| `OMNIROUTE_BASE_URL` | normalerweise unverändert lassen |
| `BASIC_AUTH_PASSWORD` | ein Passwort, wenn der Server aus dem Netz erreichbar ist |
| `PORT` | Port im Browser, Standard `3000` |

**Schritt 3: Bauen und starten**

```bash
docker compose up -d --build
```

**Schritt 4: Im Browser öffnen**

`http://DEIN-SERVER:3000` (oder der Port aus der `.env`).

Hast du ein Passwort gesetzt, fragt der Browser nach Benutzername (Standard: `lernen`) und Passwort.

**Prüfen, ob alles läuft**

```bash
docker compose ps
docker compose logs --tail 20
```

In den Logs steht `15 Lektionen geladen.`

> **Wichtig:** Basic Auth schickt das Passwort bei normalem `http` unverschlüsselt. Wenn du Codewerk über das Internet erreichbar machst, setze einen Reverse Proxy mit HTTPS davor (z. B. Caddy, Nginx Proxy Manager oder Traefik).

---

## 2. KI-Tutor mit OmniRoute verbinden

Der Tutor läuft über dein selbst gehostetes OmniRoute (`/v1/chat/completions`, mit Streaming). Der API-Key bleibt auf dem Server und gelangt nie in den Browser.

Der Tutor kennt die Lektion, deinen aktuellen Code, die letzte Ausgabe, die Testergebnisse und die geheime Musterlösung. Er soll die Lösung nicht verraten, sondern Hinweise geben und Rückfragen stellen. Das ist eine Anweisung an das Modell. Ein Modell hält sich fast immer daran, aber nicht mit absoluter Sicherheit.

**Schnellknöpfe im Tutor-Tab:**

- **Gib mir einen Tipp**: ein kleiner Hinweis für den nächsten Schritt
- **Erklär mir den Fehler**: erklärt die Fehlermeldung in einfachen Worten
- **Code-Review**: Lob und höchstens zwei Verbesserungen
- **Wo war ich?**: fasst in zwei Sätzen zusammen, was du zuletzt gemacht hast

**Wenn der Tutor nicht antwortet**

| Meldung | Lösung |
| --- | --- |
| „Der Tutor ist noch nicht eingerichtet“ | `OMNIROUTE_API_KEY` und `OMNIROUTE_MODEL` in `.env` eintragen, dann `docker compose up -d` |
| „OmniRoute ist … nicht erreichbar“ | Läuft OmniRoute? Stimmt der Port in `OMNIROUTE_BASE_URL`? |
| „API-Key abgelehnt“ | Key in der `.env` prüfen |
| „kennt dieses Modell nicht (404)“ | `OMNIROUTE_MODEL` prüfen |

Läuft OmniRoute direkt auf dem Server, muss es auf `0.0.0.0` lauschen (nicht nur auf `127.0.0.1`). Sonst kommt der Container nicht heran. Eine Firewall darf den Docker-Verkehr zum OmniRoute-Port nicht blockieren.

Nach einer Änderung an der `.env` brauchst du: `docker compose up -d`

---

## 3. So arbeitest du mit Codewerk

Jede Lektion hat drei Bereiche links und den Editor rechts. Immer nur ein Bereich ist sichtbar.

1. **Verstehen**: Kurze Erklärung mit Alltagsbeispiel. Codebeispiele kannst du mit „Ausprobieren“ direkt laufen lassen.
2. **Aufgabe**: Die Aufgabe in kleinen Schritten, dazu ein Tipp zum Aufklappen.
3. **Tutor**: Chat und Schnellknöpfe.

Rechts schreibst du Code und drückst **Ausführen** (oder `Strg + Enter`). Darunter steht immer ein **„Nächster Schritt“**. Das Ergebnis hat drei Reiter:

- **Prüfung**: die Tests mit verständlichen Fehlermeldungen und Tipps
- **Ausgabe**: `console.log`-Ausgaben und Fehler mit Zeilennummer (mit Knopf „Zu Zeile … springen“)
- **Diagramm**: alle Variablen und Objekte als Boxen. Pfeile zeigen Verweise (Referenzen). Gestrichelt heißt „ist ein“, dick heißt „erbt von“, ein Schloss steht für `#private`. Mit „Ergebnis vergrößern“ bekommt das Diagramm mehr Platz.

Unter **Ansicht** (oben rechts) stellst du Hell/Dunkel und die Textgröße ein.

Dein Code läuft sicher in einem Web Worker, getrennt von der Seite. Nach 5 Sekunden wird er angehalten (Endlosschleife). Dein Code läuft im „strict mode“: Tippfehler wie nicht deklarierte Variablen werden so zu klaren Fehlern.

---

## 4. Eigene Lektionen hinzufügen

Jede Lektion ist ein Ordner in `lessons/`. Die Reihenfolge ergibt sich aus dem Ordnernamen, deshalb stehen vorne Zahlen (`16-…`, `17-…`).

**Schritt 1: Vorlage kopieren**

```bash
cp -r lessons/_vorlage lessons/16-mein-thema
```

**Schritt 2: Die sechs Dateien ausfüllen**

| Datei | Inhalt |
| --- | --- |
| `lektion.json` | `titel`, `minuten`, `kurz` (ein Satz), `tipp` |
| `erklaerung.md` | Erklärung mit Alltagsbeispiel |
| `aufgabe.md` | die Aufgabe in kleinen Schritten |
| `start.js` | Startcode im Editor. Er sollte ohne Fehler laufen, aber noch nicht alle Tests bestehen |
| `tests.js` | die automatischen Tests |
| `loesung.js` | Musterlösung. Sie bleibt auf dem Server, nur der KI-Tutor kennt sie |

**Schritt 3: Prüfen**

```bash
docker compose exec codewerk npm run pruefen
```

Das Skript lässt für **jede** Lektion die Musterlösung gegen ihre Tests laufen. Es meldet auch, wenn der Startcode schon alles besteht oder abstürzt. Ohne Docker: `npm run pruefen`.

**Schritt 4: Seite im Browser neu laden.** Die Lektion ist da. Es ist kein Neustart nötig, denn der Ordner `lessons` ist in den Container eingebunden und wird bei jeder Anfrage neu gelesen.

### Markdown in `erklaerung.md` und `aufgabe.md`

````markdown
## Überschrift
Ein Absatz mit **fett** und `code`.

- Stichpunkt
1. nummerierter Schritt

:::alltag
Ein Alltagsbeispiel in einer farbigen Box.
:::

```js
console.log("Dieser Block bekommt einen Knopf 'Ausprobieren'");
```
````

### Tests schreiben (`tests.js`)

Alles, was im Editor definiert wird (Variablen, Funktionen, Klassen), ist in den Tests direkt sichtbar. Beispiel:

```js
test('quadrat(5) gibt 25 zurück', () => {
  expect(quadrat(5), 'Schreibe return zahl * zahl;').toBe(25);
});
```

Der zweite Wert in `expect(wert, tipp)` ist optional. Er erscheint unter der Fehlermeldung als Tipp.

| Werkzeug | Bedeutung |
| --- | --- |
| `.toBe(x)` | genau gleich (Zahlen, Texte, derselbe Objekt-Verweis) |
| `.toEqual(x)` | gleicher Inhalt (Arrays und Objekte, tief verglichen) |
| `.toBeTruthy()`, `.toBeFalsy()` | „wahr“ oder „falsch“ |
| `.toBeUndefined()`, `.toBeDefined()`, `.toBeNull()` | Sonderwerte |
| `.toBeGreaterThan(x)`, `.toBeLessThan(x)`, `.toBeCloseTo(x, stellen)` | Zahlen vergleichen |
| `.toBeInstanceOf(Klasse)` | Objekt einer Klasse |
| `.toContain(x)`, `.toHaveLength(n)`, `.toHaveProperty('name')` | Inhalt prüfen |
| `.toMatch(/regex/)` | Text passt auf einen Ausdruck |
| `.toThrow()` | die übergebene Funktion löst einen Fehler aus |
| `.not.…` | jedes Prüfwerkzeug umdrehen, z. B. `.not.toBe(5)` |
| `output()` | Array der `console.log`-Ausgaben des Nutzercodes |
| `source()` | der Quelltext des Nutzercodes (z. B. `toMatch(/#saldo/)`) |
| `capture(() => …)` | fängt die `console.log`-Ausgaben eines Aufrufs ab |

Gute Tests haben ein **verständliches deutsches `test('…')`**, einen **kleinen Tipp** und prüfen jeweils **eine** Sache.

---

## 5. Deine Daten

- Fortschritt, Code und Chat liegen in der Datei `progress.json` im Docker-Volume `codewerk-daten`. Sie bleiben bei Updates erhalten.
- **Sichern:**

  ```bash
  docker compose cp codewerk:/app/data/progress.json ./progress-sicherung.json
  ```

- **Update nach Code-Änderungen:** `docker compose up -d --build`
- **Stoppen:** `docker compose down` (löscht keine Daten). Nur `docker compose down -v` löscht auch das Volume.

---

## 6. Ohne Docker starten (zum Ausprobieren)

Du brauchst Node.js 22 oder neuer.

```bash
cp .env.example .env     # und ausfüllen; bei OMNIROUTE_BASE_URL die echte Adresse eintragen, z. B. http://localhost:20128/v1
npm ci
npm start
```

Dann `http://localhost:3000` öffnen. Der Fortschritt liegt im Ordner `data/`.

---

## 7. Aufbau des Projekts

```
codewerk/
├─ server/                 Backend (Node.js + Express)
│  ├─ index.js             Routen, Sicherheits-Header, statische Dateien
│  ├─ auth.js              optionaler Passwortschutz
│  ├─ lessons.js           liest die Ordner in lessons/ (ohne Musterlösung an den Browser)
│  ├─ storage.js           Fortschritt als JSON, atomar gespeichert
│  └─ tutor.js             Prompt bauen, OmniRoute anfragen, Antwort streamen
├─ public/                 Frontend (reines JavaScript, kein Build-Schritt)
│  ├─ index.html, css/app.css
│  └─ js/
│     ├─ main.js           verbindet alles
│     ├─ core.js           Ausführen, Tests, Fehler auf Deutsch, Diagramm-Daten
│     ├─ worker.js         Web Worker, in dem der Code läuft
│     ├─ runner.js         startet den Worker, Timeout
│     ├─ diagram.js        zeichnet Boxen und Pfeile
│     ├─ tutor-chat.js     Chat mit Streaming
│     ├─ editor.js         Monaco (selbst gehostet)
│     └─ markdown.js, api.js, theme-init.js
├─ lessons/                die 15 Lektionen (+ _vorlage)
├─ scripts/verify-solutions.js   prüft alle Musterlösungen
├─ Dockerfile, docker-compose.yml, .env.example
└─ package.json            feste Paketversionen
```

Monaco, die Schriften und der Parser `acorn` kommen aus `node_modules` und werden vom eigenen Server ausgeliefert. Es gibt **kein CDN** und keine externen Anfragen.

---

## 8. Kleine Hilfe bei Problemen

| Problem | Lösung |
| --- | --- |
| Seite bleibt leer oder „Codewerk startet nicht“ | `docker compose logs --tail 50` anschauen |
| „Es wurden keine Lektionen gefunden“ | Ordner `lessons/` vorhanden? In jedem Lektionsordner müssen alle sechs Dateien liegen |
| Neue Lektion fehlt | Sind alle sechs Dateien da? Auf der Seite unter „Lektionen“ stehen unten Hinweise zu übersprungenen Ordnern |
| Rote Wellenlinie im Editor | Das ist ein Schreibfehler im Code. Die Meldung des Editors ist englisch, die Meldung unter „Ausgabe“ ist deutsch |
| „Nicht gespeichert – Server nicht erreichbar“ | Läuft der Container noch? Der Code bleibt im Editor und wird beim nächsten Mal gespeichert |
