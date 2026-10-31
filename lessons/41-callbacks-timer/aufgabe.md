## Aufgabe: Rechnen und Erinnern

1. Schreibe `function rechne(a, b, operation)`. Sie ruft den Callback `operation` mit `a` und `b` auf und gibt dessen Ergebnis zurück.
2. Lege `const summe = rechne(3, 4, (x, y) => x + y);` an.
3. Lege `const produkt` an: Rufe `rechne(3, 4, …)` mit einem Callback auf, der die beiden Zahlen **malnimmt**.
4. Schreibe `function erinnern(text, ms)`. Sie gibt `text` mit `console.log` aus – aber erst nach `ms` Millisekunden (`setTimeout`).
5. Rufe `erinnern("Tee ist fertig!", 300);` auf und gib **danach** sofort `"Wasser kocht …"` aus. Achte im Reiter **Ausgabe** auf die Reihenfolge!
