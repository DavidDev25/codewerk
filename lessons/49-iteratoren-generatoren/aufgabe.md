## Aufgabe: Der Zahlenautomat

Du baust zwei Generatoren, eine Funktion, die sich nur ein paar Werte nimmt, und ein Objekt, das man mit `for…of` durchlaufen kann.

### Schritt 1: Bis n zählen

```js
[...zaehleBis(4)]; // [1, 2, 3, 4]
```

So gehst du vor:

1. Schreibe `function* zaehleBis(n)` mit Stern.
2. Zähle darin mit einer `for`-Schleife von 1 bis `n` und gib jede Zahl mit `yield` heraus.

### Schritt 2: Fibonacci ohne Ende

In der Fibonacci-Folge ist jede Zahl die Summe der beiden davor: 0, 1, 1, 2, 3, 5, 8 und so weiter.

```js
const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
```

So gehst du vor:

1. Schreibe `function* fibonacci()` und lege darin `let a = 0` und `let b = 1` an.
2. Schreibe eine Schleife `while (true)`. Darin gibst du `a` mit `yield` heraus.
3. Rücke danach beide Zahlen weiter: `[a, b] = [b, a + b];`.

### Schritt 3: Nur die ersten n Werte

`erste(gen, n)` holt die ersten `n` Werte aus einem Generator:

```js
erste(fibonacci(), 6);  // [0, 1, 1, 2, 3, 5]
erste(zaehleBis(2), 5); // [1, 2]
```

So gehst du vor:

1. Lege eine leere Liste `ergebnis` an.
2. Gehe mit `for…of` durch `gen` und lege jeden Wert in die Liste.
3. Hat die Liste `n` Werte, hörst du mit `break` auf.
4. Gib die Liste zurück.

Wichtig: Nimm nicht `[...gen]`. Bei `fibonacci()` würde das nie fertig.

### Schritt 4: Der Countdown

`countdown` ist ein Objekt mit `start: 3`. Mit `for…of` soll es von `start` herunterzählen:

```js
[...countdown]; // [3, 2, 1]
```

Schreibe in das Objekt die Methode `*[Symbol.iterator]() { ... }`, genau wie bei der Playlist in der Erklärung. Zähle darin mit einer Schleife von `this.start` bis 1 herunter und gib jede Zahl mit `yield` heraus.

Wichtig: Nimm `this.start` und keine feste 3. Die Tests ändern den Startwert.
