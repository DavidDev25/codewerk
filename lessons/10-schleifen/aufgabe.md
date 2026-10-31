## Aufgabe: Fünf Schleifen-Funktionen

Du schreibst fünf Funktionen, die alle mit Schleifen arbeiten. Jede gibt ihr Ergebnis mit `return` zurück.

### Schritt 1: Alles zusammenzählen

`summe(zahlen)` zählt alle Zahlen eines Arrays zusammen:

```js
summe([1, 2, 3]); // 6
summe([]);        // 0
```

Leg vor der Schleife `let ergebnis = 0;` an und zähl in der Schleife jede Zahl dazu.

### Schritt 2: Nur die großen Zahlen

`nurGrosse(zahlen)` gibt ein neues Array zurück, in dem nur die Zahlen über 10 stehen:

```js
nurGrosse([5, 12, 8, 30]); // [12, 30]
```

So gehst du vor:

1. Leg vor der Schleife ein leeres Array an.
2. Prüfe in der Schleife mit `if`, ob die Zahl größer als 10 ist.
3. Wenn ja, hänge sie mit `push` an.

### Schritt 3: Von 1 bis n

`einsBis(n)` gibt ein Array mit den Zahlen von 1 bis `n` zurück:

```js
einsBis(4); // [1, 2, 3, 4]
einsBis(0); // []
```

Nimm dafür eine Schleife mit Zähler, die bei 1 beginnt.

### Schritt 4: Die erste negative Zahl

`ersteNegative(zahlen)` gibt die erste negative Zahl zurück. Gibt es keine, kommt `null` heraus:

```js
ersteNegative([3, 8, -2, 5, -9]); // -2
ersteNegative([1, 2, 3]);         // null
```

Sobald du eine negative Zahl findest, gibst du sie sofort mit `return` zurück. Das `return null;` steht ganz am Ende, **nach** der Schleife.

### Schritt 5: Verdoppeln bis zur Grenze

`verdoppelnBis(start, grenze)` verdoppelt `start` so lange, bis der Wert mindestens `grenze` ist. Zurück gibt sie, wie oft verdoppelt wurde:

```js
verdoppelnBis(1, 100); // 7, denn 1 → 2 → 4 → 8 → 16 → 32 → 64 → 128
verdoppelnBis(5, 40);  // 3
verdoppelnBis(50, 50); // 0
```

Nimm hier eine `while`-Schleife. Du brauchst zwei Variablen: den aktuellen Wert und einen Zähler für die Runden.

Wichtig: Beim letzten Beispiel ist 50 schon mindestens 50. Dann wird gar nicht verdoppelt.
