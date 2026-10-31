## Aufgabe: Teste die Rabatt-Funktion

So soll `preisMitRabatt(preis, prozent)` funktionieren:
- Sie gibt den Preis nach Abzug von `prozent` Prozent zurück: `preisMitRabatt(100, 10)` ist `90`.
- Erlaubt sind **0 bis einschließlich 100** Prozent.
- Bei weniger als 0 oder mehr als 100 Prozent wirft sie einen `RangeError`.

Schreibe die Funktion `meineTests(rabatt)`. Sie bekommt **irgendeine** Rabatt-Funktion und gibt ein Array von Prüfergebnissen (`true`/`false`) zurück. Benutze dafür die beiden Helfer aus dem Startcode:
- `pruefe(ist, soll)` ist `true`, wenn beide gleich sind.
- `wirft(fn)` ist `true`, wenn `fn()` einen Fehler wirft.

Deine Tests sollen bei einer **korrekten** Funktion alle `true` sein, aber bei **vier versteckten falschen Varianten** jeweils mindestens einmal `false` liefern. Denk an Normalfall, Grenzfälle und Fehlerfälle. Mindestens vier Prüfungen.
