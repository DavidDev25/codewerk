## Aufgabe: Der Wocheneinkauf

Im Editor steht schon die Liste `produkte` mit fünf Einkäufen. Jedes Produkt hat einen Namen, einen Preis und eine Kategorie. Du beantwortest fünf Fragen zu dieser Liste, jede mit **einer Array-Methode**. Eine `for`-Schleife brauchst du nicht, und die Tests prüfen, dass keine dabei ist.

### Schritt 1: Alle Namen

`namen` enthält alle Produktnamen:

```js
namen; // ["Apfel", "Brot", "Banane", "Kuchen", "Milch"]
```

Nimm `map`. Die kleine Funktion bekommt ein Produkt `p` und gibt `p.name` zurück.

### Schritt 2: Nur Obst

`obst` enthält nur die Produkte mit der Kategorie `"Obst"`:

```js
obst; // [{ name: "Apfel", … }, { name: "Banane", … }]
```

Nimm `filter`. Die Funktion gibt `true` zurück, wenn `p.kategorie` gleich `"Obst"` ist.

Wichtig: In `obst` stehen die ganzen Produkte, nicht nur ihre Namen.

### Schritt 3: Der Gesamtpreis

`gesamt` ist die Summe aller Preise:

```js
gesamt; // 16
```

So gehst du vor:

1. Schreibe `produkte.reduce(...)`.
2. Die kleine Funktion bekommt zwei Werte: die bisherige Summe und das nächste Produkt. Sie gibt die Summe plus den Preis des Produkts zurück.
3. Gib als zweiten Wert den Startwert `0` mit.

Wichtig: Ohne den Startwert `0` beginnt `reduce` mit dem ersten Produkt statt mit einer Zahl. Dann kommt Unsinn heraus.

### Schritt 4: Der Kuchen

`kuchen` ist das Produkt mit dem Namen `"Kuchen"`:

```js
kuchen; // { name: "Kuchen", preis: 8, kategorie: "Backwaren" }
```

Nimm `find`. Die Funktion gibt `true` zurück, wenn `p.name` gleich `"Kuchen"` ist.

### Schritt 5: Was ist günstig?

`guenstig` enthält die **Namen** aller Produkte, die höchstens 2 € kosten:

```js
guenstig; // ["Apfel", "Banane", "Milch"]
```

So gehst du vor:

1. Behalte mit `filter` alle Produkte, bei denen `p.preis <= 2` stimmt.
2. Hänge direkt `.map(...)` an und mache aus jedem Produkt seinen Namen.

Genau so hast du es in der Erklärung bei den Hunden gesehen.
