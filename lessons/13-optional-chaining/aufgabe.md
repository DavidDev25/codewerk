## Aufgabe: Der Lieferdienst

Bestellungen kommen mal vollständig, mal lückenhaft an. Die Beispiele `komplett` und `lueckenhaft` gibt es schon. Schreibe drei Funktionen, die mit beiden klarkommen, ohne abzustürzen.

1. `stadtVon(bestellung)` gibt die Stadt aus `kunde.adresse.stadt` zurück. Fehlt etwas auf dem Weg, `"unbekannt"`.
2. `rabattVon(bestellung)` gibt den `rabatt` zurück. Fehlt er, `10`. Ein Rabatt von `0` ist ein echter Wert und muss `0` bleiben.
3. `anzahlArtikel(bestellung)` gibt zurück, wie viele Einträge `artikel` hat. Gibt es keine `artikel`, `0`.
