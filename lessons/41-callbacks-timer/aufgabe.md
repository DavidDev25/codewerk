## Aufgabe: Rechnen und Erinnern

Zuerst baust du einen Rechner, dem du die Rechenart als Callback mitgibst. Danach baust du eine kleine Eieruhr mit `setTimeout`.

### Schritt 1: Rechnen mit Callback

`rechne(a, b, operation)` ruft den Callback `operation` mit `a` und `b` auf und gibt dessen Ergebnis zurück:

```js
rechne(10, 2, (x, y) => x - y); // 8
```

Schreibe `function rechne(a, b, operation)`. Darin steht nur eine Zeile: `return operation(a, b);`.

### Schritt 2: Plus und mal

```js
summe;   // 7
produkt; // 12
```

So gehst du vor:

1. Lege `const summe = rechne(3, 4, (x, y) => x + y);` an.
2. Lege `const produkt` genauso an, aber mit einem Callback, der die beiden Zahlen malnimmt.

### Schritt 3: Die Erinnerung

`erinnern(text, ms)` gibt den Text aus, aber erst nach `ms` Millisekunden:

```js
erinnern("Pizza ist da!", 400);
// nach 0,4 Sekunden erscheint: Pizza ist da!
```

Schreibe `function erinnern(text, ms)`. Rufe darin `setTimeout` auf. Der Callback gibt `text` mit `console.log` aus, und als Wartezeit nimmst du `ms`.

Wichtig: Das `console.log` gehört **in** den Callback. Steht es direkt in `erinnern`, erscheint der Text sofort.

### Schritt 4: Auf die Reihenfolge achten

Schreibe ganz unten zwei Zeilen:

1. `erinnern("Tee ist fertig!", 300);`
2. `console.log("Wasser kocht …");`

Im Reiter **Ausgabe** steht danach zuerst „Wasser kocht …“ und erst dann „Tee ist fertig!“. Genau wie bei der Eieruhr in der Erklärung wartet das Programm nicht auf den Timer.
