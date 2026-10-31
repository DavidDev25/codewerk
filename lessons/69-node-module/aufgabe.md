## Aufgabe: Das Lager als Modul

**In `lager.js`:**

1. Der `bestand` ist eine private `Map` (schon da). Schreibe `einlagern(name, menge)`: Sie erhöht den Bestand des Artikels um `menge` (ein neuer Artikel startet bei 0) und gibt den neuen Bestand zurück.
2. Schreibe `bestand(name)`: Sie gibt den Bestand zurück, oder `0`, wenn es den Artikel nicht gibt.
3. Gib **nur** `einlagern` und `bestand` mit `module.exports` frei.

**In `main.js`:**

4. Lade `einlagern` und `bestand` mit `require` aus `./lager`.
5. Lade die Preise mit `require` aus `./preise.json`.
6. Lagere 10 `"Tee"` und 4 `"Kaffee"` ein und gib den Gesamtwert aus. Er ist die Summe aus Bestand mal Preis für beide Artikel.

Erwartete Ausgabe:

```
Lagerwert: 69 Euro
```
