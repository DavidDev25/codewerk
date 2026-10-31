## Aufgabe: Unter der Motorhaube

Im Editor stehen die Klasse `Katze` und die Katzen `minka` und `felix` aus der Erklärung. Zuerst untersuchst du, wo ihre Daten und Methoden liegen. Danach baust du selbst eine Konstruktorfunktion, ganz ohne `class`.

### Schritt 1: Teilen sich die Katzen die Methode?

```js
geteilt; // true
```

Vergleiche `minka.miau` und `felix.miau` mit `===`.

### Schritt 2: Was gehört minka selbst?

```js
eigene; // ["name"]
```

Nimm `Object.keys(minka)`. `miau` taucht dort nicht auf, weil die Methode auf dem Prototyp liegt.

### Schritt 3: Wer ist der Prototyp?

```js
istPrototyp; // true
```

Vergleiche `Object.getPrototypeOf(minka)` mit `Katze.prototype`.

### Schritt 4: Ein Punkt ohne class

Schreibe eine Konstruktorfunktion `Punkt`, die zwei Zahlen speichert:

```js
const p = new Punkt(3, 4);
p.x; // 3
p.y; // 4
```

Schreibe `function Punkt(x, y) { ... }` und speichere darin beide Werte mit `this`, genau wie beim `Kreis` in der Erklärung.

### Schritt 5: Der Abstand zum Nullpunkt

```js
new Punkt(3, 4).abstand(); // 5
new Punkt(6, 8).abstand(); // 10
```

Der Abstand ist die Wurzel aus x · x + y · y. So gehst du vor:

1. Schreibe unter die Funktion `Punkt.prototype.abstand = function () { ... };`.
2. Gib darin `Math.sqrt(this.x ** 2 + this.y ** 2)` zurück.

Wichtig: Lege `abstand` auf den Prototyp, nicht in die Funktion `Punkt`. Sonst bekäme jeder Punkt eine eigene Kopie der Methode. Außerdem muss es eine normale `function` sein, keine Arrow-Funktion. Eine Arrow-Funktion hat kein eigenes `this`.
