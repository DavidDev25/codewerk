## Der Werkzeugkasten Math

Für Zahlen bringt JavaScript einen fertigen Werkzeugkasten mit. Er heißt `Math` und ist immer da, du musst ihn nicht anlegen.

:::alltag
`Math` ist wie der Taschenrechner in deiner Schublade. Er hat für jede Aufgabe eine eigene Taste.
:::

```js
console.log(Math.round(2.5));
console.log(Math.floor(2.9));
console.log(Math.ceil(2.1));
console.log(Math.max(4, 9, 2));
console.log(Math.min(4, 9, 2));
console.log(Math.abs(-7));
console.log(Math.sqrt(16));
```

Die Ausgabe ist 3, 2, 3, 9, 2, 7 und 4. Das machen die einzelnen Tasten:

| Taste | Was sie macht |
| --- | --- |
| `Math.round(x)` | rundet normal, ab ,5 nach oben |
| `Math.floor(x)` | rundet immer ab |
| `Math.ceil(x)` | rundet immer auf |
| `Math.max(…)`, `Math.min(…)` | größter oder kleinster Wert |
| `Math.abs(x)` | Betrag, also ohne Minus |
| `Math.sqrt(x)` | Wurzel |

## Auf zwei Nachkommastellen runden

`Math.round` rundet nur auf ganze Zahlen. Für zwei Nachkommastellen nimmst du einen kleinen Trick: Du verschiebst das Komma, rundest und schiebst es zurück.

```js
const pi = 3.14159;
console.log(Math.round(pi * 100) / 100);
```

Die Ausgabe ist 3.14. Zuerst wird aus 3.14159 durch `* 100` die Zahl 314.159. Gerundet ist das 314. Geteilt durch 100 ergibt das 3.14.

## Zufallszahlen

`Math.random()` liefert eine zufällige Kommazahl, die mindestens 0 und kleiner als 1 ist. Daraus baust du jeden Bereich, den du brauchst. So würfelst du eine Zahl von 1 bis 6:

```js
const wurf = Math.floor(Math.random() * 6) + 1;
console.log(wurf);
```

Drück ein paar Mal auf **Ausprobieren**. Die Zahl ändert sich jedes Mal. Schritt für Schritt:

1. `Math.random() * 6` liegt irgendwo zwischen 0 und 5,99.
2. `Math.floor` rundet ab. Heraus kommt 0, 1, 2, 3, 4 oder 5.
3. `+ 1` verschiebt das auf 1 bis 6.

## Zahlen schön anzeigen

`toFixed(stellen)` zeigt eine Zahl mit einer festen Anzahl Nachkommastellen:

```js
const preis = 4.5;
console.log(preis.toFixed(2));
console.log(preis.toFixed(2).replace(".", ",") + " €");
```

Die Ausgabe ist `4.50` und dann `4,50 €`. Wichtig: Das Ergebnis von `toFixed` ist ein **Text**, keine Zahl mehr. Deshalb kannst du danach mit `replace` den Punkt gegen ein Komma tauschen.

## Wenn etwas keine Zahl ist

Kann `Number(…)` einen Text nicht in eine Zahl umwandeln, kommt `NaN` heraus. Das steht für „Not a Number“, also „keine Zahl“. Ob das passiert ist, prüfst du mit `Number.isNaN(…)`:

```js
console.log(Number("42"));
console.log(Number("vier"));
console.log(Number.isNaN(Number("vier")));
```

Die Ausgabe ist 42, dann `NaN` und dann `true`.

:::alltag
Computer rechnen intern mit Zweierzahlen. Deshalb ergibt `0.1 + 0.2` nicht genau `0.3`, sondern `0.30000000000000004`. Bei Geld rechnen viele Programme darum in Cent, also nur mit ganzen Zahlen.
:::
