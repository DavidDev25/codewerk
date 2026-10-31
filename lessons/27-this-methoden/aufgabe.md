## Aufgabe: Die Spielfigur

In einem Spiel hat jede Figur einen Namen und Lebenspunkte. Im Editor steht schon das Objekt `figur`. Du gibst ihm drei Methoden: Treffer einstecken, sich heilen und den Zustand melden.

Wichtig: Schreibe in den Methoden immer `this`, nie `figur`. Die Tests probieren deine Methoden auch mit anderen Figuren aus. Mit `figur.leben` würdest du dabei immer nur den Ritter ändern.

### Schritt 1: Treffer einstecken

`treffer(schaden)` zieht den Schaden von `leben` ab. Unter 0 fällt `leben` dabei nie:

```js
figur.treffer(30);
figur.leben; // 70
figur.treffer(100);
figur.leben; // 0
```

So gehst du vor:

1. Schreibe in `figur` die Methode `treffer(schaden) { ... },`.
2. Ziehe den Schaden von `this.leben` ab.
3. Sorge dafür, dass der Wert nicht unter 0 fällt. Das geht mit `Math.max(0, ...)` oder mit einem `if`.

### Schritt 2: Sich heilen

`heilen(menge)` erhöht `leben` um die Menge, aber höchstens bis 100:

```js
figur.leben = 40;
figur.heilen(25);
figur.leben; // 65
figur.heilen(50);
figur.leben; // 100
```

Das funktioniert genau wie Schritt 1, nur andersherum. Nimm `Math.min(100, ...)`.

### Schritt 3: Den Zustand melden

`status()` gibt einen Text mit Name und Lebenspunkten zurück:

```js
figur.status(); // "Ritter: 100 Leben"
figur.treffer(20);
figur.status(); // "Ritter: 80 Leben"
```

Baue den Text mit einem Template-String aus `this.name` und `this.leben`.

### Schritt 4: Melden ohne Objekt davor

`melden` soll auch ohne `figur.` davor funktionieren:

```js
melden(); // "Ritter: 100 Leben"
```

Schreibe unter das Objekt `const melden = figur.status.bind(figur);`. Ohne `bind` wäre `this` beim Aufruf leer, und es gäbe einen Fehler.
