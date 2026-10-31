## Aufgabe: Formen

Im Editor steht die Klasse `Form`. Ihre Methode `flaeche()` gibt 0 zurück. Ihre Methode `beschreibe()` benutzt `this.flaeche()`. Du schreibst zwei Formen, die `flaeche()` jeweils auf ihre Art ausrechnen. `beschreibe()` funktioniert dann von selbst für beide.

### Schritt 1: Der Kreis

```js
new Kreis(2).flaeche();   // 12.566…
new Kreis(1).beschreibe(); // "Kreis mit Fläche 3.14"
```

So gehst du vor:

1. Schreibe `class Kreis extends Form`.
2. Schreibe einen `constructor(radius)`. Rufe darin zuerst `super();` auf und speichere dann `this.radius`.
3. Schreibe die Methode `flaeche()`. Sie gibt `Math.PI * this.radius * this.radius` zurück.

### Schritt 2: Das Rechteck

```js
new Rechteck(2, 3).flaeche();    // 6
new Rechteck(2, 3).beschreibe(); // "Rechteck mit Fläche 6.00"
```

Schreibe `class Rechteck extends Form` wie den Kreis. Der `constructor(breite, hoehe)` speichert beide Werte, und `flaeche()` gibt `this.breite * this.hoehe` zurück.

### Schritt 3: Alle Flächen zusammen

`gesamtFlaeche(formen)` bekommt eine Liste von Formen und addiert ihre Flächen:

```js
gesamtFlaeche([new Rechteck(2, 3), new Rechteck(1, 1), new Kreis(1)]); // 10.14…
gesamtFlaeche([]); // 0
```

So gehst du vor:

1. Lege `let summe = 0` an.
2. Gehe mit `for…of` durch die `formen` und addiere bei jeder `form.flaeche()`.
3. Gib `summe` zurück.

Wichtig: Prüfe nicht, ob eine Form ein Kreis oder ein Rechteck ist. Benutze also weder `instanceof` noch `typeof`. Jede Form weiß selbst, wie sie ihre Fläche ausrechnet. Genau das ist die Idee aus der Erklärung.
