## Aufgabe: Der Rechner als Modul

Diesmal besteht dein Programm aus **drei Dateien**. Oben im Editor wechselst du mit den Reitern zwischen ihnen. `main.js` ist mit ▶ markiert: Dort beginnt das Programm.

**In `rechner.js`:**

1. Exportiere die Funktion `addiere`.
2. Schreibe `letzteRechnung()` und exportiere sie. Sie gibt den letzten Eintrag aus `verlauf` zurück, oder `null`, wenn noch nichts gerechnet wurde. `verlauf` selbst bleibt **privat**.

**In `main.js`:**

3. Importiere `addiere` und `letzteRechnung` aus `./rechner.js`.
4. Importiere den Standard-Export von `./format.js` unter dem Namen `schoen`.
5. Rechne `addiere(2, 3)` und danach `addiere(10, 4)`. Gib dann `schoen(letzteRechnung())` mit `console.log` aus.

Erwartete Ausgabe:

```
Ergebnis: 10 + 4 = 14
```

`format.js` musst du nicht ändern.
