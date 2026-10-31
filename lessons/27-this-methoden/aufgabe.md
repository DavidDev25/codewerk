## Aufgabe: Die Spielfigur

Ergänze das Objekt `figur` um drei Methoden. Benutze darin immer `this`, nie den Namen `figur`.

1. `treffer(schaden)` zieht `schaden` von `leben` ab. `leben` fällt dabei nie unter `0`.
2. `heilen(menge)` erhöht `leben` um `menge`, aber höchstens bis `100`.
3. `status()` gibt `"<name>: <leben> Leben"` zurück, also zum Beispiel `"Ritter: 80 Leben"`.

Danach:

4. `const melden` ist `figur.status`, fest an `figur` gebunden, sodass `melden()` auch ohne `figur.` davor funktioniert.
