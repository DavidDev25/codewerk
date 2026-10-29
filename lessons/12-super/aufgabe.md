## Aufgabe: Hund mit Rasse

`Tier` ist schon da. Vervollständige `Hund`:

1. Der `constructor(name, rasse)` ruft `super(name)` auf und speichert danach `this.rasse`.
2. Die Methode `beschreibung()` überschreibt die von `Tier`. Sie nutzt `super.beschreibung()` und hängt ` Rasse: <rasse>` an.

Beispiel: `new Hund("Bello", "Dackel").beschreibung()` gibt `"Bello ist ein Tier. Rasse: Dackel"` zurück.

Erzeuge zum Schluss `const bello = new Hund("Bello", "Dackel")`.
