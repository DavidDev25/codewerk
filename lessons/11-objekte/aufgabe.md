## Aufgabe: Das Auto

Du legst ein Objekt für ein Auto an, änderst es und schreibst eine Funktion, die ein Auto beschreibt.

### Schritt 1: Das Auto anlegen

Lege `const auto` an. Es bekommt drei Schlüssel:

- `marke` mit einem Text, zum Beispiel `"VW"`
- `baujahr` mit einer Zahl, zum Beispiel `2015`
- `farbe` mit einem Text, zum Beispiel `"blau"`

### Schritt 2: Umlackieren

Ändere die `farbe` deines Autos auf `"rot"`. Schreib dafür eine eigene Zeile **unter** das Objekt.

### Schritt 3: Türen dazu

Füge einen neuen Schlüssel `tueren` mit dem Wert `4` hinzu. Auch das geht mit einer eigenen Zeile.

### Schritt 4: Ein Auto beschreiben

Schreibe die Funktion `beschreibe(fahrzeug)`. Sie bekommt ein Auto-Objekt und baut daraus einen Satz:

```js
beschreibe({ marke: "Opel", baujahr: 1999, farbe: "grün" });
// "Opel, Baujahr 1999, grün"
```

Nimm Backticks und hol die Werte mit `fahrzeug.marke`, `fahrzeug.baujahr` und `fahrzeug.farbe`.

Wichtig: Schreib in der Funktion `fahrzeug`, nicht `auto`. Die Funktion soll mit jedem Auto funktionieren, das man ihr gibt.
