## Aufgabe: Die Rechnung mit Typen

1. Beschreibe über der Funktion `rechnungsSumme` mit JSDoc:
   - einen Typ `Posten` mit `@typedef {Object} Posten` und den Eigenschaften `name` (string), `preis` (number) und `menge` (number),
   - den Parameter mit `@param {Posten[]} posten`,
   - die Rückgabe mit `@returns {number}`.
2. `mussZahlSein(wert, name)` wirft einen `TypeError` mit der Nachricht `"<name> muss eine Zahl sein"`, wenn `wert` keine endliche Zahl ist. Sonst passiert nichts.
3. `rechnungsSumme(posten)` prüft bei jedem Posten `preis` und `menge` mit `mussZahlSein` und gibt die Summe aller `preis * menge` zurück.
