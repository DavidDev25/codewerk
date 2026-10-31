## Der Werkzeugkasten Math

:::alltag
`Math` ist wie der Taschenrechner in deiner Schublade: Er ist immer da, du musst ihn nicht anlegen, und er hat für jede Aufgabe eine eigene Taste.
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

| Taste | Ergebnis |
| --- | --- |
| `Math.round(x)` | kaufmännisch runden |
| `Math.floor(x)` | immer abrunden |
| `Math.ceil(x)` | immer aufrunden |
| `Math.max(…)`, `Math.min(…)` | größter oder kleinster Wert |
| `Math.abs(x)` | Betrag (ohne Minus) |

## Auf Nachkommastellen runden

`Math.round` rundet nur auf ganze Zahlen. Für zwei Stellen nach dem Komma verschiebst du das Komma, rundest und schiebst es zurück:

```js
const pi = 3.14159;
console.log(Math.round(pi * 100) / 100);
```

## Zufallszahlen

`Math.random()` liefert eine Kommazahl von 0 bis knapp unter 1. Daraus baust du jeden Bereich:

```js
const wurf = Math.floor(Math.random() * 6) + 1;
console.log(wurf);
```

`Math.random() * 6` liegt zwischen 0 und 5,99… Abgerundet ergibt das 0 bis 5. Plus 1 ergibt 1 bis 6.

## Zahlen anzeigen

`toFixed(stellen)` gibt eine Zahl mit fester Anzahl Nachkommastellen aus. Achtung: Das Ergebnis ist ein **Text**.

```js
const preis = 4.5;
console.log(preis.toFixed(2));
console.log(preis.toFixed(2).replace(".", ",") + " €");
```

## Wenn etwas keine Zahl ist

Kann `Number(…)` einen Text nicht umwandeln, kommt `NaN` heraus („Not a Number“). Prüfen kannst du das mit `Number.isNaN(…)`:

```js
console.log(Number("42"));
console.log(Number("vier"));
console.log(Number.isNaN(Number("vier")));
```

:::alltag
Computer rechnen intern mit Zweierzahlen. Deshalb ergibt `0.1 + 0.2` nicht genau `0.3`, sondern `0.30000000000000004`. Bei Geld rechnen viele Programme darum in Cent, also mit ganzen Zahlen.
:::
