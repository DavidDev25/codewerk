# Codewerk – deine persönliche JavaScript-Lernplattform

Codewerk bringt dir JavaScript bei, von den Grundlagen über die objektorientierte Programmierung (OOP) bis zu asynchronem Code. Es gibt eine Einstiegslektion (Lektion 0 „So funktioniert Codewerk“) und 38 kurze Lektionen in drei Kapiteln, jedes mit einem Abschlussprojekt:

| Kapitel | Lektionen | Inhalt |
| --- | --- | --- |
| Teil 1 · Grundlagen | 1–21 | Variablen, Datentypen, Funktionen, Bedingungen, Strings, Zahlen, Arrow-Funktionen, Arrays, Schleifen, Objekte, Referenzen, Destructuring, `?.`/`??`, Closures, Array-Methoden, JSON, Map & Set, Rekursion |
| Teil 2 · Objektorientierung | 22–32 | `this`, Klassen, `#private`, Getter/Setter, Vererbung, `super`, Polymorphie, Komposition, Prototypen |
| Teil 3 · Fehler & Asynchron | 33–38 | Fehlerbehandlung, Callbacks & Timer, Promises, async/await, `fetch` mit eingebauter Übungs-API |

Jede Lektion hat eine kleine Erklärung, eine Aufgabe, automatische Tests, ein Diagramm deines Codes und einen KI-Tutor.

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

In den Logs steht `22 Lektionen geladen.`

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

**OmniRoute als Container auf demselben Server (so läuft die Live-Version)**

Statt OmniRoute auf dem Server selbst zu installieren, läuft es als eigener Container im Netz von Codewerk. Dann muss es nicht auf `0.0.0.0` lauschen und ist von außen gar nicht erreichbar:

```bash
docker run -d --name omniroute --restart unless-stopped \
  --network codewerk_default -p 127.0.0.1:20128:20128 \
  -v omniroute-data:/app/data --env-file /opt/omniroute/.env --memory=1200m \
  diegosouzapw/omniroute:latest
```

In der `.env` von Codewerk steht dann `OMNIROUTE_BASE_URL=http://omniroute:20128/v1`. Das Dashboard öffnest du über einen SSH-Tunnel (`ssh -L 20128:127.0.0.1:20128 …`, dann `http://localhost:20128`). Beim ersten Aufruf über den Tunnel fragt der Einrichtungsassistent nach einem einmaligen Bootstrap-Token; der steht in `docker logs omniroute`.

**Ausweichmodell über eine Combo:** Lege in OmniRoute unter „Kombinationen“ eine Combo an (Strategie „Priorität“, z. B. erst ein Flash-Modell, dann ein Flash-Lite-Modell) und trage ihren **exakten Namen** als `OMNIROUTE_MODEL` ein. Ist das erste Modell am Limit, springt OmniRoute aufs nächste. Ein Präfix wie `combo/name` funktioniert nicht (OmniRoute liest „combo“ dann als Anbieter). Fällt ein Modell bei Google weg, änderst du nur die Combo, nicht Codewerk.

**Schutz vor Missbrauch (wenn Codewerk öffentlich erreichbar ist)**

Jede Frage an den Tutor kostet über deinen API-Key Geld bzw. Kontingent. Damit niemand das ausnutzt, gibt es zwei Grenzen pro IP-Adresse:

| Einstellung in `.env` | Standard | Was passiert, wenn sie erreicht ist |
| --- | --- | --- |
| `TUTOR_LIMIT_PER_MINUTE` | 15 | Der Server antwortet mit „Du stellst gerade sehr viele Fragen …“ (HTTP 429). Nach einer Minute geht es weiter. |
| `TUTOR_LIMIT_PER_DAY` | 50 | Der Tutor antwortet freundlich „Du hast dein tägliches Limit … erreicht. Morgen geht's weiter!“ |

Die Tageszähler liegen nur im Arbeitsspeicher. Nach einem Neustart beginnen sie wieder bei 0.

**Wichtig bei einem Reverse-Proxy:** Läuft vor Codewerk ein Proxy (nginx, Caddy, Traefik), kommt jede Anfrage scheinbar von der Adresse des Proxys. Dann würden sich **alle** Besucher dieselben Grenzen teilen. Trage deshalb in der `.env` `TRUST_PROXY=1` ein (1 = ein Proxy davor). Ohne Proxy bleibt `TRUST_PROXY` leer – sonst könnte jeder seine IP im Header `X-Forwarded-For` fälschen und die Grenzen umgehen.

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

Neue Besucher starten in **Lektion 0**, die den Ablauf an einer Mini-Aufgabe zeigt. Beim ersten Besuch erklärt außerdem eine **geführte Tour** in 9 Schritten die Oberfläche (auch in der Handy-Ansicht). Über den Knopf **Tour** oben rechts startet sie jederzeit neu; ob sie schon gesehen wurde, merkt sich der Browser.

Dein Code läuft sicher in einem Web Worker, getrennt von der Seite. Nach 5 Sekunden wird er angehalten (Endlosschleife). Dein Code läuft im „strict mode“: Tippfehler wie nicht deklarierte Variablen werden so zu klaren Fehlern.

---

## 4. Eigene Lektionen hinzufügen

Jede Lektion ist ein Ordner in `lessons/`. Die Reihenfolge ergibt sich aus dem Ordnernamen, deshalb stehen vorne Zahlen (`16-…`, `17-…`). Die Zahl ist auch die angezeigte Lektionsnummer: `00-so-funktioniert-codewerk` wird „Lektion 0“. Ordner ohne Zahl werden hinten weitergezählt, Ordner mit `_` am Anfang (wie `_vorlage`) ignoriert.

**Schritt 1: Vorlage kopieren**

```bash
cp -r lessons/_vorlage lessons/39-mein-thema
```

In `lektion.json` legt `kapitel` fest, unter welcher Überschrift die Lektion in der Liste erscheint. Lektionen eines Kapitels müssen direkt hintereinander stehen, und die Nummern müssen lückenlos sein (beides prüft `npm test`).

**Lektionen umnummerieren:** Die Lektions-ID ist der Ordnername, und daran hängt der gespeicherte Fortschritt. Wer einen Ordner umbenennt, trägt alt → neu in `server/umzug.js` ein. Dann wird Fortschritt unter der alten ID beim nächsten Laden automatisch übernommen, im Konto wie im Gast-Speicher des Browsers.

**Schritt 2: Die sechs Dateien ausfüllen**

| Datei | Inhalt |
| --- | --- |
| `lektion.json` | `titel`, `kapitel`, `minuten`, `kurz` (ein Satz), `tipp` |
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

Für Änderungen an der Plattform selbst gibt es zusätzlich `npm test` (Ordner `test/`, Node-Test-Runner, keine Zusatzpakete). Die Tests starten den echten Server gegen ein nachgebautes OmniRoute und prüfen u. a. Sicherheits-Header, Lektionsnummern, dass die Musterlösung nie an den Browser geht und dass der Tutor-Stream unkomprimiert Wort für Wort ankommt.

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

| Spalte | Spalte |
| --- | --- |
| Tabellen | gehen auch |

```js
console.log("Dieser Block bekommt einen Knopf 'Ausprobieren'");
```
````

Jeder `js`-Block läuft beim „Ausprobieren“ **für sich allein**. Was ein Beispiel braucht (z. B. eine Funktion), muss also im selben Block stehen.

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
| `capture(() => …)` | fängt die `console.log`-Ausgaben eines Aufrufs ab; mit einer `async`-Funktion: `await capture(async () => …)` |
| `wait(ms)` | in `async`-Tests eine Weile warten: `await wait(100)` |

**Übungs-API für `fetch`:** Echte Netzwerkzugriffe sind im Worker gesperrt. Stattdessen beantwortet die Engine (`public/js/core.js`) Anfragen an `/uebung/…` selbst, nach 40 ms und mit echten Response-Objekten (`ok`, `status`, `json()`, `text()`). Jeder Lauf startet mit frischen Daten. Andere Adressen werden wie ein Netzwerkfehler abgelehnt.

| Anfrage | Antwort |
| --- | --- |
| `GET /uebung/nutzer` | alle Nutzer (`id`, `name`, `stadt`) |
| `GET /uebung/nutzer/<id>` | ein Nutzer, sonst 404 |
| `GET /uebung/wetter?stadt=<name>` | `stadt`, `grad`, `himmel` für Nürnberg, Erlangen, Fürth, sonst 404 |
| `GET /uebung/notizen` | alle Notizen dieses Laufs |
| `POST /uebung/notizen` mit JSON `{ "text": … }` | 201 und die Notiz mit `id`; ohne Text 400 |

**Asynchroner Code:** Codewerk wartet nach dem Ausführen, bis alle Timer und Promises erledigt sind (höchstens 2 Sekunden). Ausgaben aus `setTimeout` oder `await` erscheinen deshalb ganz normal. Tests dürfen `async` sein:

```js
test('holen() liefert 42', async () => {
  expect(await holen(), 'Gib das Ergebnis mit return zurück.').toBe(42);
});
```

Ein einzelner `async`-Test darf höchstens 1 Sekunde warten. Halte Wartezeiten in Lektionen deshalb kurz (z. B. 50–300 ms).

Gute Tests haben ein **verständliches deutsches `test('…')`**, einen **kleinen Tipp** und prüfen jeweils **eine** Sache. Wenn ein Test mit `source()` den Quelltext prüft, entferne vorher die Kommentare – sonst bestehen Platzhalter wie `// 1. async function …` im Startcode den Test schon.

---

## 5. Anmeldung mit GitHub (für den öffentlichen Betrieb)

Codewerk kennt zwei Betriebsarten:

| | Persönlicher Modus | Konten-Modus |
| --- | --- | --- |
| Wann | `GITHUB_CLIENT_ID` und `GITHUB_CLIENT_SECRET` sind leer | beide sind gesetzt |
| Für wen | eine lernende Person | viele, öffentlich |
| Fortschritt | `data/progress.json` | Gäste: nur im eigenen Browser · Konten: `data/codewerk.db` |
| KI-Tutor | ja | nur mit Anmeldung |

**So richtest du den GitHub-Login ein:**

1. Auf GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. *Homepage URL*: die Adresse von Codewerk, z. B. `https://lernen.example.de` (lokal: `http://localhost:3000`).
3. *Authorization callback URL*: dieselbe Adresse plus `/auth/github/callback`, z. B. `https://lernen.example.de/auth/github/callback`.
4. Nach dem Anlegen die **Client ID** kopieren und mit **Generate a new client secret** ein Secret erzeugen.
5. In der `.env` eintragen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` und `PUBLIC_URL` (genau die Adresse aus Schritt 2, ohne `/` am Ende). Dann neu starten.

**Was gespeichert wird:** nur GitHub-ID, Benutzername und Anzeigename. Codewerk fragt keine Berechtigungen an (kein „scope“) und verwirft das GitHub-Zugangstoken sofort nach der Anmeldung. Sitzungen liegen nur als Prüfsumme (Hash) in der Datenbank.

**Gäste** lernen ohne Anmeldung los. Ihr Fortschritt bleibt in ihrem Browser. Melden sie sich an, wird er ins Konto übernommen (vorhandener Fortschritt im Konto wird dabei nicht überschrieben).

**Dein bisheriger Fortschritt:** Das **allererste** Konto, das sich anmeldet, übernimmt die vorhandene `data/progress.json` aus dem persönlichen Modus. Melde dich also als Erste/r an. Die alte Datei wird umbenannt, nicht gelöscht.

**Datenschutz:** Angemeldete können im Konto-Menü (Initialen oben rechts) ihre Daten herunterladen und ihr Konto endgültig löschen. Impressum und Datenschutzerklärung liegen als `public/impressum.html` und `public/datenschutz.html` bei und sind in Lektionsliste, Ansicht-Dialog und Gast-Hinweis verlinkt. Passe sie an deinen Betrieb an (Anschrift, Hoster, KI-Anbieter, Log-Löschfrist).

### Hinter Apache mit HTTPS (so läuft die Live-Version)

Der Container lauscht nur lokal (`docker-compose.override.yml` mit `ports: !override` → `127.0.0.1:3000:3000`), Apache leitet die Domain weiter. Im HTTPS-Virtualhost:

```apache
ProxyPreserveHost On
RequestHeader set X-Forwarded-Proto "https"
ProxyPass        / http://127.0.0.1:3000/ flushpackets=on
ProxyPassReverse / http://127.0.0.1:3000/
SetEnvIf Request_URI "^/api/chat" no-gzip=1
```

`flushpackets=on` und `no-gzip` sorgen dafür, dass die Tutor-Antworten Wort für Wort ankommen statt am Stück. In der `.env`: `PUBLIC_URL=https://…` und `TRUST_PROXY=1`.

**Update einspielen:** neue Dateien hochladen, dann `docker compose up -d --build`. Ohne `--build` läuft im Container der alte Code weiter (nur `lessons/` ist direkt eingebunden).

---

## 6. Deine Daten

- Persönlicher Modus: Fortschritt, Code und Chat liegen in `progress.json` im Docker-Volume `codewerk-daten`. Konten-Modus: in `codewerk.db` im selben Volume. Beides bleibt bei Updates erhalten.
- **Sichern:**

  ```bash
  docker compose cp codewerk:/app/data/progress.json ./progress-sicherung.json
  docker compose cp codewerk:/app/data/codewerk.db ./codewerk-sicherung.db
  ```

- **Update nach Code-Änderungen:** `docker compose up -d --build`
- **Stoppen:** `docker compose down` (löscht keine Daten). Nur `docker compose down -v` löscht auch das Volume.

---

## 7. Ohne Docker starten (zum Ausprobieren)

Du brauchst Node.js 22.13 oder neuer (empfohlen: 24).

```bash
cp .env.example .env     # und ausfüllen; bei OMNIROUTE_BASE_URL die echte Adresse eintragen, z. B. http://localhost:20128/v1
npm ci
npm start
```

Dann `http://localhost:3000` öffnen. Der Fortschritt liegt im Ordner `data/`.

---

## 8. Aufbau des Projekts

```
codewerk/
├─ server/                 Backend (Node.js + Express)
│  ├─ index.js             Routen, Sicherheits-Header, statische Dateien, Rate-Limits
│  ├─ accounts.js          GitHub-Login, Sitzungen, Konto (Export, Löschen), Gast-Import
│  ├─ db.js                SQLite: Konten, Sitzungen, Fortschritt pro Konto
│  ├─ progress.js          Regeln für den Fortschritt (Grenzen, Import)
│  ├─ auth.js              optionaler Passwortschutz
│  ├─ lessons.js           liest die Ordner in lessons/ (ohne Musterlösung an den Browser)
│  ├─ storage.js           Fortschritt als JSON im persönlichen Modus, atomar gespeichert
│  └─ tutor.js             Prompt bauen, OmniRoute anfragen, Antwort streamen, Tagesbudget
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
│     ├─ tour.js           geführte Tour beim ersten Besuch
│     └─ markdown.js, api.js, theme-init.js
│  └─ impressum.html, datenschutz.html
├─ lessons/                Lektion 0 bis 21 (+ _vorlage)
├─ scripts/verify-solutions.js   prüft alle Musterlösungen
├─ Dockerfile, docker-compose.yml, .env.example
└─ package.json            feste Paketversionen
```

Monaco, die Schriften und der Parser `acorn` kommen aus `node_modules` und werden vom eigenen Server ausgeliefert. Es gibt **kein CDN** und keine externen Anfragen.

---

## 9. Kleine Hilfe bei Problemen

| Problem | Lösung |
| --- | --- |
| Seite bleibt leer oder „Codewerk startet nicht“ | `docker compose logs --tail 50` anschauen |
| „Es wurden keine Lektionen gefunden“ | Ordner `lessons/` vorhanden? In jedem Lektionsordner müssen alle sechs Dateien liegen |
| Neue Lektion fehlt | Sind alle sechs Dateien da? Auf der Seite unter „Lektionen“ stehen unten Hinweise zu übersprungenen Ordnern |
| Rote Wellenlinie im Editor | Das ist ein Schreibfehler im Code. Die Meldung des Editors ist englisch, die Meldung unter „Ausgabe“ ist deutsch |
| „Nicht gespeichert – Server nicht erreichbar“ | Läuft der Container noch? Der Code bleibt im Editor und wird beim nächsten Mal gespeichert |
| Hochgeladene Änderung ist nicht zu sehen | `docker compose up -d --build` (mit `--build`), danach im Browser `Strg + F5` |
| Tutor: „Unable to determine provider for model …“ (400) | Den Namen gibt es in OmniRoute nicht: Combo gespeichert? Namen exakt so eintragen wie im Dashboard |
| Tutor: „no longer available to new users“ (404) | Google hat das Modell abgeschaltet: in der Combo durch ein aktuelles Modell ersetzen |
