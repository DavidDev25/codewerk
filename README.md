# Codewerk – deine persönliche JavaScript-Lernplattform

Codewerk bringt dir JavaScript bei, von den Grundlagen über die objektorientierte Programmierung (OOP) bis zu asynchronem Code, JavaScript im Browser und Node.js. Es gibt eine Einstiegslektion (Lektion 0 „So funktioniert Codewerk“) und 74 kurze Lektionen in sieben Kapiteln. Profiwissen steht jeweils dort, wo es fachlich hingehört:

| Kapitel | Lektionen | Inhalt |
| --- | --- | --- |
| Teil 1 · Grundlagen | 1–26 | Variablen, Datentypen, Funktionen, Bedingungen, Strings, Zahlen, Genauigkeit & BigInt, Arrow-Funktionen, Arrays, Schleifen, Objekte, Referenzen, Destructuring, Tagged Templates, `?.`/`??`, Closures, Array-Methoden, Unveränderlichkeit, Objekte durchlaufen, JSON, Map & Set, Gruppieren & Mengen, Rekursion, Currying/Komposition/Memoization, Abschlussprojekt |
| Teil 2 · Objektorientierung | 27–38 | `this`, Klassen, `#private`, Getter/Setter, Vererbung, `super`, Polymorphie, Komposition, Prototypen, Entwurfsmuster (Observer, Factory), Abschlussprojekt |
| Teil 3 · Fehler & Asynchron | 39–47 | Fehlerbehandlung, eigene Fehlerklassen & `cause`, Callbacks & Timer, Promises, Event Loop, async/await, `fetch`, `allSettled`/`race`/`any` & `AbortController`, Abschlussprojekt |
| Teil 4 · Fortgeschritten | 48–55 | Module, Iteratoren & Generatoren, Async-Iteratoren & Iterator-Helfer, reguläre Ausdrücke, Datum & `Intl`, Symbol/Proxy/Reflect, WeakMap & Speicherlecks, Abschlussprojekt |
| Teil 5 · Qualität | 56–58 | Debugging, eigene Tests (mit Mutationstests geprüft), JSDoc & TypeScript-Einstieg |
| Teil 6 · Browser | 59–67 | DOM, Elemente erzeugen (und XSS vermeiden), Events, Event-Phasen/Tastatur/Barrierefreiheit, debounce & throttle, Formulare, `localStorage`, URLs & Routing, To-do-App |
| Teil 7 · Node.js | 68–74 | `process` (argv, env, Exit-Code, nextTick), `require`/`module.exports` und ES-Module in Node, `fs` & `path`, `EventEmitter`, HTTP-Server mit `node:http`, npm/`package.json`/SemVer, Abschlussprojekt REST-API |

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
| `CLOUDFLARE_ACCOUNT_ID` | deine Cloudflare-Account-ID (für den KI-Tutor, optional) |
| `CLOUDFLARE_API_TOKEN` | API-Token mit der Berechtigung „Workers AI“ |
| `TUTOR_MODELS` | normalerweise leer lassen (Standardmodelle) |
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

## 2. KI-Tutor mit Cloudflare Workers AI verbinden

Der Tutor nutzt [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) über die OpenAI-kompatible Schnittstelle (`/ai/v1/chat/completions`, mit Streaming). Das kostenlose Kontingent (10.000 „Neurons“ pro Tag, Reset um 00:00 UTC) reicht je nach Länge für einige hundert Antworten täglich. Ist es aufgebraucht, sagt der Tutor freundlich, dass er bis morgen Pause macht. Cloudflare nutzt die Inhalte laut eigener Aussage nicht zum Training und speichert sie nicht. Der API-Token bleibt auf dem Server und gelangt nie in den Browser.

**Einrichten:**

1. Kostenloses Konto auf [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) anlegen.
2. Die **Account-ID** kopieren (Dashboard, rechts unter „Account details“).
3. Unter [API-Tokens](https://dash.cloudflare.com/profile/api-tokens) einen eigenen Token erstellen, mit genau einer Berechtigung: **Account → Workers AI → Read**.
4. Beides als `CLOUDFLARE_ACCOUNT_ID` und `CLOUDFLARE_API_TOKEN` in die `.env` eintragen und `docker compose up -d` ausführen.
5. In `docker compose logs` steht danach für jedes Modell eine Zeile `Tutor-Selbsttest: … → ok`.

Verwendet werden nur Modelle unter der Apache-2.0-Lizenz (Standard: Mistral Small 3.1, dann Qwen 2.5 Coder). Fällt das erste aus, nimmt der Tutor das nächste. Mit `TUTOR_MODELS` lässt sich die Liste ändern; `TUTOR_BASE_URL` erlaubt einen anderen OpenAI-kompatiblen Anbieter.

**Rechtliches:** Im Konten-Modus ist der Tutor ab 16 Jahren. Vor der ersten Nutzung bestätigt man das einmal, die Bestätigung steht im Konto. Unter dem Chat steht dauerhaft, dass eine KI antwortet (Transparenzpflicht nach Art. 50 KI-Verordnung). Die Datenschutzerklärung (`public/datenschutz.html`) nennt Cloudflare als Auftragsverarbeiter.

Der Tutor kennt die Lektion, deinen aktuellen Code, die letzte Ausgabe, die Testergebnisse und die geheime Musterlösung. Er soll die Lösung nicht verraten, sondern Hinweise geben und Rückfragen stellen. Das ist eine Anweisung an das Modell. Ein Modell hält sich fast immer daran, aber nicht mit absoluter Sicherheit.

**Schnellknöpfe im Tutor-Tab:**

- **Gib mir einen Tipp**: ein kleiner Hinweis für den nächsten Schritt
- **Erklär mir den Fehler**: erklärt die Fehlermeldung in einfachen Worten
- **Code-Review**: Lob und höchstens zwei Verbesserungen
- **Wo war ich?**: fasst in zwei Sätzen zusammen, was du zuletzt gemacht hast

**Wenn der Tutor nicht antwortet**

| Meldung | Lösung |
| --- | --- |
| „Der Tutor ist noch nicht eingerichtet“ | `CLOUDFLARE_ACCOUNT_ID` und `CLOUDFLARE_API_TOKEN` in `.env` eintragen, dann `docker compose up -d` |
| „Cloudflare hat den API-Token abgelehnt“ | Token prüfen: Berechtigung „Workers AI“ gesetzt? Account-ID richtig? |
| „kennt dieses Modell nicht“ | `TUTOR_MODELS` prüfen oder leer lassen |
| „Der Tutor macht für heute Pause“ | Das kostenlose Tageskontingent ist aufgebraucht. Um 00:00 UTC geht es weiter. |

Nach einer Änderung an der `.env` brauchst du: `docker compose up -d`. Ob alles klappt, zeigt der Selbsttest in `docker compose logs`.

**Schutz vor Missbrauch (wenn Codewerk öffentlich erreichbar ist)**

Jede Frage an den Tutor verbraucht Kontingent deines Cloudflare-Kontos. Damit niemand das ausnutzt, gibt es zwei Grenzen pro IP-Adresse:

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

**Design „Werkstatt“:** Petrol ist die Hauptfarbe, Messing steht nur für Fortschritt und Erfolg (Fortschrittsbalken, Haken geschaffter Lektionen, Logo-Cursor), Graphit für Flächen und Text; Überschriften und Code in JetBrains Mono, Fließtext in Atkinson Hyperlegible. Alle Farben stehen als Variablen oben in `public/css/app.css` (hell und dunkel, Kontraste nach WCAG AA geprüft). **Lektionen** öffnet eine Übersicht mit einer Karte pro Kapitel (Status, Fortschritt, aufklappbare Lektionen). Ist die letzte Lektion eines Kapitels bestanden, erscheint „Kapitel geschafft“ mit Messing-Abzeichen und dem Weg zum nächsten offenen Kapitel.

Dein Code läuft sicher in einem Web Worker, getrennt von der Seite. Nach 5 Sekunden wird er angehalten (Endlosschleife). Dein Code läuft im „strict mode“: Tippfehler wie nicht deklarierte Variablen werden so zu klaren Fehlern.

**Browser-Lektionen (Teil 5)** brauchen ein echtes DOM, das ein Worker nicht hat. Dort läuft der Code in einem abgeschotteten `iframe` (`sandbox="allow-scripts allow-forms"`, eigene „null“-Origin: kein Zugriff auf Cookies, Sitzung oder die Codewerk-Seite). Der neue Reiter **Vorschau** zeigt die Seite, die man danach auch anklicken kann; Ausgaben aus Klicks erscheinen live in **Ausgabe**. Dabei laufen zwei Durchgänge: einer sichtbar ohne Tests und einer unsichtbar mit Tests, damit Testklicks die Vorschau nicht verändern. Endlosschleifen bricht ein Schleifenschutz nach 3 Sekunden ab (in jede Schleife wird vor dem Ausführen eine Zeitprüfung eingesetzt). `localStorage` ist ein Übungsspeicher pro Lektion, der bis zum Neuladen von Codewerk erhalten bleibt; Netzwerkzugriffe sind wie im Worker gesperrt.

---

**Node.js-Lektionen (Teil 7)** laufen ebenfalls komplett im Browser-Worker, nie auf dem Server. `public/js/node-runtime.js` bildet Node nach: `require`/`module.exports` (CommonJS) und `import` mit Node-Regeln (Erkennung, `"type"` in `package.json`, `.mjs`/`.cjs`, `node:`-Präfix, JSON per `require`, `index.js`), `fs` und `fs/promises` als Dateisystem im Speicher (vorbelegt mit den Dateien der Lektion, Fehlercodes wie `ENOENT`), `path`, `events`, `http` (Anfragen werden simuliert, auch per `fetch("http://localhost:3000/…")`), `process` (argv, env, exitCode, exit, nextTick vor Promises, stdout.write), `util` und `timers/promises`. Unter **Ausgabe** zeigt Codewerk nach dem Lauf, welche Dateien das Programm angelegt, geändert oder gelöscht hat. npm-Pakete gibt es nicht; ein `require("express")` erklärt, warum.

## 4. Eigene Lektionen hinzufügen

Jede Lektion ist ein Ordner in `lessons/`. Die Reihenfolge ergibt sich aus dem Ordnernamen, deshalb stehen vorne Zahlen (`16-…`, `17-…`). Die Zahl ist auch die angezeigte Lektionsnummer: `00-so-funktioniert-codewerk` wird „Lektion 0“. Ordner ohne Zahl werden hinten weitergezählt, Ordner mit `_` am Anfang (wie `_vorlage`) ignoriert.

**Schritt 1: Vorlage kopieren**

```bash
cp -r lessons/_vorlage lessons/75-mein-thema
```

In `lektion.json` legt `kapitel` fest, unter welcher Überschrift die Lektion in der Liste erscheint. Lektionen eines Kapitels müssen direkt hintereinander stehen, und die Nummern müssen lückenlos sein (beides prüft `npm test`).

**Lektionen umnummerieren:** Die Lektions-ID ist der Ordnername, und daran hängt der gespeicherte Fortschritt. Wer einen Ordner umbenennt, trägt alt → neu in `server/umzug.js` ein. Dann wird Fortschritt unter der alten ID beim nächsten Laden automatisch übernommen, im Konto wie im Gast-Speicher des Browsers.

**Schritt 2: Die sechs Dateien ausfüllen**

| Datei | Inhalt |
| --- | --- |
| `lektion.json` | `titel`, `kapitel`, `minuten`, `kurz` (ein Satz), `tipp`; für Node-Lektionen zusätzlich `"laufzeit": "node"`, optional `"argumente"` (→ `process.argv`) und `"umgebung"` (→ `process.env`) |
| `erklaerung.md` | Erklärung mit Alltagsbeispiel |
| `aufgabe.md` | die Aufgabe in kleinen Schritten |
| `start.js` | Startcode im Editor. Er sollte ohne Fehler laufen, aber noch nicht alle Tests bestehen |
| `tests.js` | die automatischen Tests |
| `loesung.js` | Musterlösung. Sie bleibt auf dem Server, nur der KI-Tutor kennt sie |
| `seite.html` | *(optional)* HTML einer Seite. Damit wird die Lektion zur Browser-Lektion mit Vorschau, und die Tests können `document` benutzen. `npm run pruefen` prüft sie mit jsdom |
| `dateien/` + `loesung/` | *(optional, statt `start.js` und `loesung.js`)* mehrere Dateien als echte ES-Module, ein Reiter pro Datei im Editor. Einstieg ist `main.js` (anders: `"einstieg"` in `lektion.json`), die Reihenfolge der Reiter legt `"dateien": ["main.js", …]` fest. Unterordner sind erlaubt (`lib/werkzeug.js`) |

**Mehrere Dateien:** `public/js/core.js` parst jede Datei als Modul und schreibt `import`/`export` in ein internes Register um. Das läuft wie immer im Worker, ohne `blob:`-URLs, die CSP bleibt streng. Unterstützt werden benannte und Standard-Exporte, `import * as`, `export … from`, `export * from`, dynamisches `import()`, Top-Level-`await` und `import.meta.url`. Falsche Pfade und fehlende Exporte meldet Codewerk wie der Browser schon vor dem Start, Fehler zeigen auf Datei und Zeile. Der Fortschritt speichert dann `{"dateien": {…}}` als Text.

**Schritt 3: Prüfen**

```bash
docker compose exec codewerk npm run pruefen
```

Das Skript lässt für **jede** Lektion die Musterlösung gegen ihre Tests laufen. Es meldet auch, wenn der Startcode schon alles besteht oder abstürzt. Ohne Docker: `npm run pruefen`.

Für Änderungen an der Plattform selbst gibt es zusätzlich `npm test` (Ordner `test/`, Node-Test-Runner, keine Zusatzpakete). Die Tests starten den echten Server gegen einen nachgebauten KI-Dienst und prüfen u. a. Sicherheits-Header, Lektionsnummern, dass die Musterlösung nie an den Browser geht und dass der Tutor-Stream unkomprimiert Wort für Wort ankommt.

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
| `source()` | der Quelltext des Nutzercodes (z. B. `toMatch(/#saldo/)`); bei mehreren Dateien `source('rechner.js')`, ohne Namen die Startdatei |
| `node.anfrage('POST', '/notizen', { text: 'x' })` | *(nur Node-Lektionen)* schickt eine Anfrage an den laufenden Server, Objekte werden als JSON gesendet. Ergebnis: `{ status, headers, text, json() }` |
| `node.datei('pfad')`, `node.fs`, `node.process`, `node.require('node:events')`, `node.serverLaeuft()` | *(nur Node-Lektionen)* Dateiinhalt nach dem Lauf (oder `null`), das Dateisystem, `process`, eingebaute Module, läuft ein Server? |
| `modul('rechner.js')` | *(nur bei mehreren Dateien)* der Namensraum eines Moduls mit allen Exporten, z. B. `modul('rechner.js').addiere(1, 2)`. Top-Level-Variablen sind in Modulen nicht global, Tests holen sie sich so |
| `capture(() => …)` | fängt die `console.log`-Ausgaben eines Aufrufs ab; mit einer `async`-Funktion: `await capture(async () => …)` |
| `wait(ms)` | in `async`-Tests eine Weile warten: `await wait(100)` |

**Übungs-API für `fetch`:** Echte Netzwerkzugriffe sind im Worker gesperrt. Stattdessen beantwortet die Engine (`public/js/core.js`) Anfragen an `/uebung/…` selbst, nach 40 ms und mit echten Response-Objekten (`ok`, `status`, `json()`, `text()`). Jeder Lauf startet mit frischen Daten. Andere Adressen werden wie ein Netzwerkfehler abgelehnt. `fetch` beachtet `signal` (`AbortController`, `AbortSignal.timeout`), und `/uebung/langsam?ms=…` antwortet absichtlich verzögert (höchstens 1,5 s).

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
cp .env.example .env     # und ausfüllen (für den Tutor CLOUDFLARE_ACCOUNT_ID und CLOUDFLARE_API_TOKEN)
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
│  └─ tutor.js             Prompt bauen, Cloudflare Workers AI anfragen (mit Ausweichmodell), Antwort streamen, Tagesbudget, Selbsttest
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
| Tutor: „no longer available to new users“ (404) | Google hat das Modell abgeschaltet: in der Combo durch ein aktuelles Modell ersetzen |
