## Aufgabe: Ein sicherer Taschenrechner

Die Funktion `teilen(a, b)` gibt es schon. Sie teilt aber auch durch 0.

1. Ändere `teilen`: Wenn `b` gleich `0` ist, wirf einen Fehler mit dem Text `"Durch 0 kann man nicht teilen."`. Sonst gib `a / b` zurück.
2. Schreibe `function sicherTeilen(a, b)`. Sie ruft `teilen(a, b)` in einem `try`-Block auf und gibt das Ergebnis zurück.
3. Im `catch`-Block gibt `sicherTeilen` den Text `"Fehler: "` plus die Fehlermeldung zurück, also `"Fehler: Durch 0 kann man nicht teilen."`.
4. Lege `const ergebnis = sicherTeilen(10, 0);` an und gib `ergebnis` mit `console.log` aus.
