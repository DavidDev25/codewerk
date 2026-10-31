## Aufgabe: Die Bankabteilung

In einer Bank muss jede Rechnung auf den Cent stimmen. Du schreibst fünf kleine Helfer, die genau dafür sorgen.

### Schritt 1: Fast gleich

Schreibe `fastGleich(a, b)`. Sie gibt `true` zurück, wenn sich die beiden Zahlen um weniger als `Number.EPSILON` unterscheiden:

```js
fastGleich(0.1 + 0.2, 0.3); // true
fastGleich(0.3, 0.31);      // false
```

Rechne den Abstand mit `Math.abs(a - b)` aus und vergleiche ihn mit `Number.EPSILON`.

### Schritt 2: Euro in Cent

Schreibe `inCent(euro)`. Sie macht aus einem Euro-Betrag ganze Cent:

```js
inCent(19.99); // 1999
inCent(4.35);  // 435
```

Wichtig: `19.99 * 100` ergibt `1998.9999…`. Runde das Ergebnis deshalb mit `Math.round`.

### Schritt 3: Im sicheren Bereich?

Schreibe `istSicher(zahl)`. Sie gibt `true` zurück, wenn die Zahl eine ganze Zahl im sicheren Bereich ist:

```js
istSicher(42);                          // true
istSicher(Number.MAX_SAFE_INTEGER + 1); // false
istSicher(1.5);                         // false
```

Dafür gibt es eine fertige Funktion aus der Erklärung.

### Schritt 4: Riesige Zahlen malnehmen

Schreibe `malGross(a, b)`. Sie bekommt zwei ganze Zahlen **als Text**, nimmt sie exakt mal und gibt das Ergebnis wieder **als Text** zurück:

```js
malGross("9007199254740993", "3"); // "27021597764222979"
```

So gehst du vor:

1. Mach aus beiden Texten mit `BigInt(…)` einen BigInt.
2. Nimm sie mal.
3. Mach aus dem Ergebnis mit `.toString()` wieder einen Text.

### Schritt 5: Gerade bei BigInt

Schreibe `istGeradeGross(zahl)`. Sie bekommt einen BigInt und gibt `true` zurück, wenn er gerade ist:

```js
istGeradeGross(10n); // true
istGeradeGross(7n);  // false
```

Wichtig: Auch beim Rest rechnest du mit BigInt. Schreib also `2n` und `0n` statt `2` und `0`.
