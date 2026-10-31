## Fremden Code benutzen

Niemand schreibt alles selbst. Für Webserver, Datumsrechnung oder Tests gibt es fertige **Pakete**. **npm** (Node Package Manager) lädt sie aus einem riesigen Verzeichnis und kommt mit Node mit.

:::alltag
`package.json` ist die Zutatenliste eines Rezepts: welche Zutaten (Pakete) in welcher Sorte (Version) gebraucht werden. `npm install` ist der Einkauf. `node_modules` ist der Vorratsschrank, in dem dann alles liegt.
:::

## package.json

Jedes Node-Projekt hat im Hauptordner eine `package.json`:

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
| `devDependencies` | Pakete nur zum **Entwickeln**: Tests, Linter, Build-Werkzeuge |

Es ist echtes JSON: doppelte Anführungszeichen, kein Komma nach dem letzten Eintrag, keine Kommentare.

## Die wichtigsten Befehle

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

- `node_modules/` enthält die heruntergeladenen Pakete und deren Pakete. Das sind oft Tausende Dateien. Der Ordner gehört **nie** ins Git-Repository (`.gitignore`). Jeder erzeugt ihn mit `npm install` neu.
- `package-lock.json` hält fest, welche **genaue** Version von jedem Paket installiert wurde. Sie gehört **ins** Repository. So bekommen alle im Team und der Server exakt dieselben Versionen. Auf Servern nimmt man dafür `npm ci`.

## Versionen: MAJOR.MINOR.PATCH

Versionen folgen dem **Semantic Versioning** (SemVer), z. B. `4.21.2`:

| Teil | erhöht sich, wenn … | Beispiel |
| --- | --- | --- |
| MAJOR (4) | sich etwas inkompatibel ändert, alter Code kann brechen | 4 → 5 |
| MINOR (21) | neue Funktionen dazukommen, alles bleibt kompatibel | 4.21 → 4.22 |
| PATCH (2) | nur Fehler behoben werden | 4.21.2 → 4.21.3 |

In `package.json` steht meist ein **Bereich**, keine feste Version:

| Bereich | erlaubt | Beispiel für `1.2.3` |
| --- | --- | --- |
| `1.2.3` | genau diese | nur 1.2.3 |
| `~1.2.3` | neue Patches | ≥ 1.2.3 und < 1.3.0 |
| `^1.2.3` | neue Minor- und Patch-Versionen | ≥ 1.2.3 und < 2.0.0 |
| `^0.2.3` | Sonderfall unter 1.0: nur Patches | ≥ 0.2.3 und < 0.3.0 |
| `*` | jede | alles |

Der Sonderfall: Vor Version 1.0 gilt jede Minor-Version als möglicherweise inkompatibel. Deshalb ist `^` dort vorsichtiger.

## Sicherheit

Jedes Paket ist fremder Code, der mit deinen Rechten läuft. Deshalb:

- Nur Pakete nehmen, die viele nutzen und die gepflegt werden. Auf Tippfehler im Namen achten (`expres` statt `express` kann ein Schadpaket sein).
- `npm audit` zeigt bekannte Sicherheitslücken in deinen Paketen.
- Ganz frische Versionen kurz abwarten: Wird ein Paket gekapert, fällt das meist in den ersten Tagen auf.

In Codewerk kannst du keine Pakete installieren. Alles, was du hier lernst, funktioniert aber genau so auf deinem eigenen Rechner.
