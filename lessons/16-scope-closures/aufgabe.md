## Aufgabe: Funktionsfabriken

1. `zaehlerErstellen()` gibt eine Funktion zurück. Jeder Aufruf dieser Funktion zählt um 1 hoch und gibt den neuen Stand zurück (1, 2, 3, …). Zwei Zähler zählen unabhängig voneinander.
2. `begruesser(gruss)` gibt eine Funktion zurück, die einen Namen nimmt und `"<gruss>, <name>!"` zurückgibt. `begruesser("Moin")("Lea")` ergibt `"Moin, Lea!"`.
3. `kontoErstellen(start)` gibt ein **Objekt** mit zwei Funktionen zurück:
   - `einzahlen(betrag)` erhöht den Kontostand.
   - `stand()` gibt den aktuellen Kontostand zurück.

   Der Kontostand selbst darf **keine** Eigenschaft des Objekts sein, sondern lebt nur in der Closure.
