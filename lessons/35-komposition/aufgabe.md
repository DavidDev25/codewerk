## Aufgabe: Auto mit Motor

Im Editor steht die Klasse `Motor`. Man kann ihn mit `starten()` und `stoppen()` steuern, und der Getter `laeuft` verrät, ob er gerade an ist. Du baust ein Auto, das einen solchen Motor **hat**, so wie der Schreibtisch in der Erklärung eine Lampe hat.

Wichtig: Schreibe `class Auto` **ohne** `extends`. Ein Auto ist kein Motor.

### Schritt 1: Das Auto bekommt einen Motor

```js
const a = new Auto("Golf");
a.marke;        // "Golf"
a.motor.laeuft; // false
```

Speichere im `constructor(marke)` die Marke in `this.marke` und baue mit `this.motor = new Motor();` einen Motor.

### Schritt 2: Fahren

```js
a.fahren();     // "Golf fährt"
a.motor.laeuft; // true
```

So gehst du vor:

1. Prüfe mit `this.motor.laeuft`, ob der Motor schon läuft. Wenn nicht, rufe `this.motor.starten()` auf.
2. Gib den Text mit der Marke zurück.

### Schritt 3: Anhalten

```js
a.anhalten();   // "Golf steht"
a.motor.laeuft; // false
```

Rufe `this.motor.stoppen()` auf und gib den Text zurück.

### Schritt 4: Der Status

```js
const polo = new Auto("Polo");
polo.status(); // "Polo: Motor aus"
polo.fahren();
polo.status(); // "Polo: Motor an"
```

Frage `this.motor.laeuft` ab und gib je nach Ergebnis einen der beiden Texte zurück.

Wichtig: `laeuft` ist ein Getter. Schreibe es deshalb **ohne** Klammern: `this.motor.laeuft`, nicht `this.motor.laeuft()`.

### Schritt 5: Der Golf

Baue unter der Klasse das Auto `const golf = new Auto("Golf");`.
