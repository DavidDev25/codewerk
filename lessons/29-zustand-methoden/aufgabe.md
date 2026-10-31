## Aufgabe: Der Zähler

Du baust den Klicker-Zähler aus der Erklärung als Klasse. Im Editor steht schon ein Gerüst der Klasse `Zaehler`. Der Zählerstand steht immer in `this.wert`.

### Schritt 1: Der Startwert

```js
new Zaehler().wert;   // 0
new Zaehler(10).wert; // 10
```

Speichere im `constructor` den Startwert: `this.wert = start;`. Der Standardwert `0` steht schon in der Klammer.

### Schritt 2: Hoch und runter

```js
const z = new Zaehler(5);
z.erhoehen();
z.wert; // 6
z.verringern();
z.wert; // 5
```

So gehst du vor:

1. Erhöhe in `erhoehen()` den Wert um 1: `this.wert = this.wert + 1;`.
2. Schreibe darunter die Methode `verringern()`. Sie zieht 1 ab.

### Schritt 3: Zurücksetzen

```js
z.zuruecksetzen();
z.wert; // 0
```

Schreibe die Methode `zuruecksetzen()`. Sie setzt `this.wert` auf 0.

### Schritt 4: Der Zählerstand als Text

```js
new Zaehler(2).beschreibung(); // "Zählerstand: 2"
```

Schreibe die Methode `beschreibung()`. Sie gibt mit einem Template-String den Text zurück.

### Schritt 5: Dreimal klicken

Unter der Klasse steht schon `const klicker = new Zaehler();`. Rufe darunter dreimal `klicker.erhoehen();` auf. Danach gibt `console.log(klicker.wert)` die 3 aus.
