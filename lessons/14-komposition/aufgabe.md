## Aufgabe: Auto mit Motor

Die Klasse `Motor` ist vorgegeben (mit `starten()`, `stoppen()` und dem Getter `laeuft`).

Schreibe die Klasse `Auto`:

1. Der `constructor(marke)` speichert `this.marke` und erzeugt `this.motor = new Motor()`.
2. `fahren()` startet den Motor, falls er noch nicht läuft, und gibt `"<marke> fährt"` zurück.
3. `anhalten()` stoppt den Motor und gibt `"<marke> steht"` zurück.
4. `status()` gibt `"<marke>: Motor an"` oder `"<marke>: Motor aus"` zurück.

Erzeuge zum Schluss `const golf = new Auto("Golf")`.
