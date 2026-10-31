## Aufgabe: Inventur im Hofladen

Im Hofladen ist Inventur. Im Editor steht das Objekt `lager`. Darin steht für jede Obstsorte, wie viele Kisten noch da sind. Du verwandelst das Objekt mit `Object.keys`, `Object.values` und `Object.entries` in Listen und arbeitest mit Array-Methoden weiter.

### Schritt 1: Alle Sorten

```js
sorten; // ["aepfel", "birnen", "kirschen", "pflaumen"]
```

Die Sorten sind die Schlüssel von `lager`. Nimm `Object.keys`.

### Schritt 2: Alle Kisten zusammen

```js
gesamt; // 19
```

So gehst du vor:

1. Hole mit `Object.values(lager)` die Mengen als Liste.
2. Zähle sie mit `reduce` zusammen. Vergiss den Startwert `0` nicht.

### Schritt 3: Was ist ausverkauft?

```js
ausverkauft; // ["birnen", "pflaumen"]
```

So gehst du vor:

1. Hole mit `Object.entries(lager)` die Paare aus Sorte und Menge.
2. Behalte mit `filter` nur die Paare, deren Menge `0` ist.
3. Mache mit `map` aus jedem Paar die Sorte.

Genau so hast du es in der Erklärung beim Zucker gesehen.

### Schritt 4: Alles verdoppeln

Eine Lieferung ist da, und von jeder Sorte gibt es jetzt doppelt so viel. `verdoppeln(obj)` gibt ein **neues** Objekt zurück, in dem jeder Wert doppelt so groß ist:

```js
verdoppeln(lager);            // { aepfel: 24, birnen: 0, kirschen: 14, pflaumen: 0 }
verdoppeln({ a: 1, b: 2.5 }); // { a: 2, b: 5 }
```

So gehst du vor:

1. Zerlege `obj` mit `Object.entries` in Paare.
2. Mache mit `map` aus jedem Paar `[schluessel, wert]` ein neues Paar `[schluessel, wert * 2]`.
3. Baue mit `Object.fromEntries` wieder ein Objekt daraus und gib es zurück.

Wichtig: Benutze in der Funktion `obj`, nicht `lager`. Sonst klappt sie nur mit dem Hofladen. Schreibe die neuen Werte außerdem nicht in `obj` hinein, denn `lager` muss gleich bleiben.
