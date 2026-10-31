## Aufgabe: Nutzer seitenweise und Zahlen auf Abruf

1. `alleNutzer()` ist ein **async-Generator**. Er fragt `/uebung/nutzer/1`, `/uebung/nutzer/2`, … der Reihe nach an und liefert jeden Nutzer mit `yield`. Antwortet der Server nicht mehr mit `ok`, hört er auf.
2. `namenSammeln()` geht mit `for await` durch `alleNutzer()` und gibt ein Array aller Namen zurück.
3. `anzahlNutzer()` gibt die Anzahl aller Nutzer zurück. Nutze `Array.fromAsync`.
4. `const geradeQuadrate` sind die ersten **drei** Quadratzahlen gerader Zahlen aus `zahlenAb(1)`: `[4, 16, 36]`. Nutze die Iterator-Helfer `filter`, `map`, `take` und `toArray`.
