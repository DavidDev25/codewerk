## Aufgabe: Ordentlich mit Speicher umgehen

1. `const besuche` ist eine `WeakMap`. `besuchZaehlen(nutzer)` erhöht die Anzahl der Besuche für genau dieses Nutzer-Objekt um 1 und gibt den neuen Stand zurück.
2. `const gesperrt` ist ein `WeakSet`. `sperren(nutzer)` fügt den Nutzer hinzu, `istGesperrt(nutzer)` gibt `true` oder `false` zurück.
3. `objektCache(fn)` gibt eine Funktion zurück, die für jedes **Objekt** nur einmal `fn(objekt)` berechnet und das Ergebnis in einer `WeakMap` merkt.
4. Die Klasse `Uhr` gibt es schon, sie hat aber ein Speicherleck: `stop()` fehlt. Ergänze `stop()`, sodass der Takt aufhört. Merke dir dafür in `start()` die ID von `setInterval`.
