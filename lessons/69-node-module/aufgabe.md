## Aufgabe: Das Lager als Modul

Dein Programm besteht aus drei Dateien: `main.js` startet alles, `lager.js` verwaltet den Bestand, und `preise.json` enthält die Preise. Oben im Editor wechselst du mit den Reitern zwischen ihnen.

Am Ende soll im Reiter **Ausgabe** stehen:

```
Lagerwert: 69 Euro
```

### Schritt 1: lager.js

In `lager.js` steht schon die private Map `lager`. Du schreibst zwei Funktionen und gibst nur diese frei:

```js
einlagern("Tee", 3); // 3
einlagern("Tee", 2); // 5
bestand("Tee");      // 5
bestand("Kakao");    // 0
```

So gehst du vor:

1. Schreibe `einlagern(name, menge)`. Sie rechnet den neuen Bestand aus: `(lager.get(name) ?? 0) + menge`. Sie speichert ihn mit `lager.set` und gibt ihn zurück.
2. Schreibe `bestand(name)`. Sie gibt den Bestand zurück oder 0, wenn es den Artikel nicht gibt.
3. Schreibe ganz unten `module.exports = { einlagern, bestand };`.

Wichtig: Die Map selbst gehört nicht in `module.exports`. Sie bleibt privat.

### Schritt 2: main.js lädt alles

Wechsle zu `main.js`.

1. Lade die beiden Funktionen mit `const { einlagern, bestand } = require("./lager");`.
2. Lade die Preise mit `const preise = require("./preise.json");`.

### Schritt 3: Einlagern und rechnen

So gehst du vor:

1. Lagere 10 `"Tee"` und 4 `"Kaffee"` ein.
2. Rechne den Wert aus: Bestand mal Preis für Tee plus Bestand mal Preis für Kaffee. Die Preise holst du aus `preise`.
3. Gib den Text mit dem Wert aus.

Wichtig: Nimm die Preise aus `preise` und schreibe keine festen Zahlen wie 4.5 in den Code. Die Tests prüfen das.
