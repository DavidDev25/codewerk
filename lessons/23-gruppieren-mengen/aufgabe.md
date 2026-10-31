## Aufgabe: Wochenmarkt und Sportverein

Diese Aufgabe hat zwei Teile. Zuerst teilst du die Produkte vom Wochenmarkt in Gruppen auf. Danach vergleichst du, welche Kinder im Sportverein Fußball spielen und welche schwimmen. Im Editor stehen schon `produkte`, `fussball` und `schwimmen`.

### Schritt 1: Nach Kategorie

```js
Object.keys(nachKategorie); // ["Obst", "Backwaren", "Getränke"]
nachKategorie.Obst;         // [{ name: "Apfel", … }, { name: "Birne", … }]
```

Nimm `Object.groupBy`. Die Funktion gibt für jedes Produkt seine `kategorie` zurück.

### Schritt 2: Günstig oder teuer

`nachPreis` ist eine **Map** mit zwei Gruppen. Alles unter 2 € ist `"günstig"`, alles ab 2 € ist `"teuer"`:

```js
nachPreis.get("günstig"); // Apfel, Birne und Milch
nachPreis.get("teuer");   // Brot und Kuchen
```

Nimm `Map.groupBy`. Die Funktion gibt `"günstig"` zurück, wenn `p.preis < 2` ist, sonst `"teuer"`. Dafür passt der Fragezeichen-Operator aus Lektion 4: `bedingung ? "günstig" : "teuer"`.

Wichtig: Der Kuchen kostet genau 2 € und gehört zu `"teuer"`. Nimm deshalb `<` und nicht `<=`.

### Schritt 3: In beiden Sportarten

```js
beides; // Set mit "Tom" und "Ali"
```

Nimm `intersection`.

### Schritt 4: Alle Kinder

```js
alle; // Set mit "Lea", "Tom", "Ben", "Ali" und "Mia"
```

Nimm `union`. Kinder, die beides machen, stehen trotzdem nur einmal drin.

### Schritt 5: Nur Fußball

```js
nurFussball; // Set mit "Lea" und "Ben"
```

Nimm `difference`. Achte auf die Reihenfolge: `fussball` steht vorne, weil du von den Fußballkindern ausgehst.

### Schritt 6: Teil einer Gruppe?

`istTeilVon(a, b)` gibt `true` zurück, wenn jedes Kind aus `a` auch in `b` ist:

```js
istTeilVon(new Set(["Tom", "Ali"]), fussball); // true
istTeilVon(new Set(["Mia"]), fussball);        // false
```

Die passende Methode heißt `isSubsetOf`. Gib in der Funktion einfach `a.isSubsetOf(b)` zurück.
