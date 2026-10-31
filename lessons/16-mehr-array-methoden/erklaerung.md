## Fragen an die ganze Liste

:::alltag
Ein Lehrer schaut auf die Klassenliste: „Hat **irgendwer** eine Eins?“ ist `some`. „Haben **alle** bestanden?“ ist `every`. Beide Fragen beantwortest du mit Ja oder Nein.
:::

```js
const noten = [2, 1, 3, 5];
console.log(noten.some((n) => n === 1));
console.log(noten.every((n) => n <= 4));
```

## Wo steht etwas?

```js
const noten = [2, 1, 3, 5];
console.log(noten.indexOf(3));
console.log(noten.findIndex((n) => n > 2));
console.log(noten.indexOf(6));
```

- `indexOf(wert)` sucht einen bestimmten Wert. `findIndex(fn)` sucht mit einer Bedingung.
- Wird nichts gefunden, kommt `-1` heraus.

## Sortieren, aber richtig

`sort` hat zwei Fallen:

```js
const zahlen = [10, 2, 33, 4];
console.log([...zahlen].sort());
console.log([...zahlen].sort((a, b) => a - b));
console.log([...zahlen].sort((a, b) => b - a));
```

1. Ohne Vergleichsfunktion sortiert `sort` alles **wie Text**. Dann steht `10` vor `2`, weil „1“ vor „2“ kommt. Mit `(a, b) => a - b` wird aufsteigend nach Zahlenwert sortiert.
2. `sort` verändert das **Original**. Mit `[...zahlen]` sortierst du eine Kopie.

Für Texte gibt es `localeCompare`, das auch Umlaute richtig einordnet: `namen.sort((a, b) => a.localeCompare(b))`.

## Für jedes Element etwas tun

`forEach` führt eine Funktion für jedes Element aus. Anders als `map` liefert es nichts zurück:

```js
["Lea", "Tom"].forEach((name, i) => console.log(`${i + 1}. ${name}`));
```

## Zwischen Text und Array wechseln

```js
const zeile = "Äpfel, Birnen, Kirschen";
const obst = zeile.split(", ");
console.log(obst);
console.log(obst.join(" & "));
```

- `split(trenner)` zerlegt einen Text in ein Array.
- `join(verbinder)` klebt ein Array zu einem Text zusammen.

## Ein Stück herausnehmen

`slice(von, bis)` kennst du von Texten. Bei Arrays liefert es ebenfalls eine Kopie des Stücks, das Original bleibt gleich:

```js
const woche = ["Mo", "Di", "Mi", "Do", "Fr"];
console.log(woche.slice(1, 3));
console.log(woche.slice(-2));
console.log(woche);
```
