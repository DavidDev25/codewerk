## Fremden Code benutzen

Niemand schreibt alles selbst. Für Webserver, Datumsrechnung oder Tests gibt es fertige **Pakete**. **npm** lädt sie aus einem riesigen Verzeichnis. Der Name steht für „Node Package Manager“, und npm kommt zusammen mit Node auf deinen Rechner.

:::alltag
`package.json` ist wie die Zutatenliste eines Rezepts. Darin steht, welche Zutaten gebraucht werden und in welcher Sorte. Die Zutaten sind die Pakete, die Sorte ist die Version. `npm install` ist der Einkauf. Der Ordner `node_modules` ist der Vorratsschrank, in dem danach alles liegt.
:::

## package.json

Jedes Node-Projekt hat im Hauptordner eine Datei `package.json`. So sieht eine typische aus:

```json
{
  "name": "mein-laden",
  "version": "1.0.0",
  "description": "Ein kleiner Laden-Server",
  "type": "module",
  "main": "main.js",
  "scripts": {
    "start": "node main.js",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^4.21.2"
  },
  "devDependencies": {
    "eslint": "~9.17.0"
  }
}
```

| Feld | Bedeutung |
| --- | --- |
| `name`, `version` | Name und Version deines Projekts |
| `type` | `"module"` macht alle `.js`-Dateien zu ES-Modulen, ohne Angabe gilt CommonJS |
| `scripts` | Befehle, die du mit `npm run …` startest |
| `dependencies` | Pakete, die das Programm zum **Laufen** braucht |
| `devDependencies` | Pakete nur zum **Entwickeln**, etwa für Tests oder Prüfwerkzeuge |

Die Datei ist echtes JSON. Es gelten also die Regeln aus Lektion 21: doppelte Anführungszeichen, kein Komma nach dem letzten Eintrag und keine Kommentare.

## Die wichtigsten Befehle

Diese Befehle tippst du im Terminal. Hinter `#` steht jeweils, was sie tun:

```bash
npm init -y                 # neue package.json anlegen
npm install express         # Paket holen und in dependencies eintragen
npm install -D eslint       # nur für die Entwicklung (devDependencies)
npm install                 # alles aus package.json installieren
npm start                   # führt scripts.start aus
npm test                    # führt scripts.test aus
npm run lint                # jedes andere Skript braucht "run"
npx eslint .                # Werkzeug aus node_modules direkt starten
```

## node_modules und die Lock-Datei

- `node_modules/` enthält die heruntergeladenen Pakete und die Pakete, die diese wiederum brauchen. Das sind oft Tausende Dateien. Der Ordner gehört **nie** ins Git-Repository, deshalb steht er in `.gitignore`. Jeder erzeugt ihn mit `npm install` selbst.
- `package-lock.json` hält fest, welche **genaue** Version von jedem Paket installiert wurde. Diese Datei gehört **ins** Repository. So bekommen alle im Team und auch der Server genau dieselben Versionen. Auf Servern installiert man dafür mit `npm ci`.

## Versionsnummern lesen

Versionen bestehen aus drei Zahlen, zum Beispiel `4.21.2`. Diese Regel heißt **Semantic Versioning**, kurz SemVer. Jede der drei Zahlen hat eine feste Bedeutung:

| Teil | erhöht sich, wenn … | Beispiel |
| --- | --- | --- |
| MAJOR, hier 4 | sich etwas so ändert, dass alter Code kaputtgehen kann | 4 → 5 |
| MINOR, hier 21 | neue Funktionen dazukommen und alles weiter funktioniert | 4.21 → 4.22 |
| PATCH, hier 2 | nur Fehler behoben werden | 4.21.2 → 4.21.3 |

In `package.json` steht meistens keine feste Version, sondern ein **Bereich**. Das Zeichen davor sagt, welche neueren Versionen erlaubt sind:

| Bereich | erlaubt | Beispiel für `1.2.3` |
| --- | --- | --- |
| `1.2.3` | genau diese | nur 1.2.3 |
| `~1.2.3` | neue Patches | ab 1.2.3 und unter 1.3.0 |
| `^1.2.3` | neue Minor- und Patch-Versionen | ab 1.2.3 und unter 2.0.0 |
| `^0.2.3` | Sonderfall unter 1.0: nur Patches | ab 0.2.3 und unter 0.3.0 |
| `*` | jede | alles |

Zum Sonderfall: Vor Version 1.0 kann jede neue Minor-Version alten Code kaputtmachen. Deshalb ist `^` dort vorsichtiger und erlaubt nur Patches.

## Sicherheit

Jedes Paket ist fremder Code, der mit deinen Rechten läuft. Deshalb gilt:

- Nimm nur Pakete, die viele benutzen und die gepflegt werden. Achte auf Tippfehler im Namen. Hinter `expres` statt `express` kann ein Schadpaket stecken.
- `npm audit` zeigt bekannte Sicherheitslücken in deinen Paketen.
- Warte bei ganz frischen Versionen ein paar Tage ab. Wird ein Paket gekapert, fällt das meistens in den ersten Tagen auf.

In Codewerk kannst du keine Pakete installieren. Alles, was du hier lernst, funktioniert aber genauso auf deinem eigenen Rechner.
