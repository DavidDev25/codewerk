## Aufgabe: Werkzeuge mit =>

Du schreibst vier kleine Werkzeuge, diesmal alle in der Kurzform mit Pfeil. Jedes legst du mit `const` an, zum Beispiel so: `const name = (eingabe) => …`.

### Schritt 1: Das Quadrat

`quadrat` nimmt eine Zahl mal sich selbst:

```js
quadrat(5); // 25
```

### Schritt 2: Volljährig?

`istVolljaehrig` bekommt ein Alter und sagt, ob es mindestens 18 ist:

```js
istVolljaehrig(18); // true
istVolljaehrig(17); // false
```

### Schritt 3: Begrüßen mit Standardwert

`begruessen` bekommt einen Namen und baut einen Gruß. Ohne Namen grüßt sie den Gast:

```js
begruessen("Mara"); // "Hallo Mara!"
begruessen();       // "Hallo Gast!"
```

Gib der Eingabe dafür den Standardwert `"Gast"`.

### Schritt 4: Zweimal anwenden

`zweimal` bekommt eine Funktion `fn` und einen `wert`. Sie wendet `fn` zweimal an: zuerst auf `wert`, dann noch einmal auf das Ergebnis.

```js
zweimal(quadrat, 3);           // 81, denn 3 → 9 → 81
zweimal((x) => x + 10, 1);     // 21, denn 1 → 11 → 21
```

Wichtig: Benutze in `zweimal` die übergebene Funktion `fn`, nicht fest `quadrat`. Sonst klappt das zweite Beispiel nicht.
