## Aufgabe: Eine Kasse, die Bescheid sagt

1. `Kasse` erbt von `EventEmitter`. Im `constructor(tagesziel)` rufst du `super()` auf und merkst dir `this.summe = 0` und `this.tagesziel = tagesziel`.
2. `bezahlen(betrag)`:
   - Ist `betrag` keine Zahl größer als 0, löse `"error"` mit `new Error("Ungültiger Betrag")` aus und brich ab.
   - Sonst erhöhe `this.summe` und löse `"bezahlt"` mit einem Objekt `{ betrag, summe }` aus.
   - Erreicht oder überschreitet `this.summe` das Tagesziel, löse zusätzlich `"ziel"` aus.
3. Im Hauptprogramm (eine Kasse mit Tagesziel `50`):
   - Bei `"bezahlt"`: gib `+20 € (gesamt 20 €)` aus (mit den jeweiligen Zahlen).
   - Bei `"ziel"`, aber **nur beim ersten Mal**: gib `Tagesziel erreicht!` aus.
   - Bei `"error"`: gib `Fehler: Ungültiger Betrag` aus.
   - Bezahle nacheinander `20`, `-5`, `40` und `10`.

Erwartete Ausgabe:

```
+20 € (gesamt 20 €)
Fehler: Ungültiger Betrag
+40 € (gesamt 60 €)
Tagesziel erreicht!
+10 € (gesamt 70 €)
```
