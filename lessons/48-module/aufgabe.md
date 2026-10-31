## Aufgabe: Das Rechner-Modul

Baue ein Modul nach dem Muster aus der Erklärung.

1. `const rechner` ist das Ergebnis einer sofort aufgerufenen Arrow-Funktion `(() => { … })()`.
2. Darin liegt ein **privates** Array `verlauf`.
3. Die Funktion `addiere(a, b)` gibt `a + b` zurück und schreibt jede Rechnung als Text `"a + b = ergebnis"` in `verlauf`.
4. Die Funktion `letzteRechnung()` gibt den letzten Eintrag aus `verlauf` zurück, oder `null`, wenn noch nichts gerechnet wurde.
5. Das Modul gibt **nur** `addiere` und `letzteRechnung` nach außen.
6. Hole dir `addiere` per Destructuring aus `rechner` in eine eigene Konstante, so wie ein `import`.
