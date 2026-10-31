## Fragen an die ganze Liste

Manchmal willst du eine Liste nicht umwandeln, sondern nur eine Frage über sie beantworten.

:::alltag
Ein Lehrer schaut auf die Klassenliste und fragt: „Hat **irgendwer** eine Eins?“ Dafür gibt es `some`. Oder er fragt: „Haben **alle** bestanden?“ Dafür gibt es `every`. Beide Fragen beantwortest du mit Ja oder Nein.
:::

Im Beispiel fragst du zuerst, ob irgendwo eine 1 steht, und dann, ob alle Noten höchstens 4 sind:

```js
const noten = [2, 1, 3, 5];
console.log(noten.some((n) => n === 1));
console.log(noten.every((n) => n <= 4));
```

Die erste Zeile gibt `true` aus, weil eine 1 in der Liste steht. Die zweite gibt `false` aus, weil die 5 schlechter als 4 ist. Bei `every` reicht also ein einziges Element, das nicht passt.

## Herausfinden, wo etwas steht

Die Position eines Elements heißt **Index**. Gezählt wird ab 0. Zwei Methoden suchen nach dem Index:

```js
const noten = [2, 1, 3, 5];
console.log(noten.indexOf(3));
console.log(noten.findIndex((n) => n > 2));
console.log(noten.indexOf(6));
```

`indexOf(3)` sucht genau den Wert 3 und findet ihn an Position 2. `findIndex` sucht mit einer Bedingung. Die erste Note über 2 ist ebenfalls die 3, also kommt wieder 2 heraus. Eine 6 gibt es nicht. Wenn nichts gefunden wird, liefern beide Methoden `-1`.

## Richtig sortieren

Bei `sort` gibt es zwei Fallen. Das Beispiel sortiert dieselben Zahlen dreimal:

```js
const zahlen = [10, 2, 33, 4];
console.log([...zahlen].sort());
console.log([...zahlen].sort((a, b) => a - b));
console.log([...zahlen].sort((a, b) => b - a));
```

Die erste Zeile sieht falsch aus: `[10, 2, 33, 4]`. Ohne Hilfe sortiert `sort` alles **wie Text**. Als Text beginnt „10“ mit einer 1 und steht deshalb vor „2“. Damit nach Zahlenwert sortiert wird, gibst du eine Vergleichsfunktion mit:

- `(a, b) => a - b` sortiert aufsteigend. Heraus kommt `[2, 4, 10, 33]`.
- `(a, b) => b - a` sortiert absteigend. Heraus kommt `[33, 10, 4, 2]`.

Die zweite Falle: `sort` verändert das **Original**. Deshalb steht im Beispiel `[...zahlen]`. So sortierst du eine Kopie, und `zahlen` bleibt, wie es war.

Für Texte gibt es `localeCompare`. Damit landen auch Umlaute an der richtigen Stelle: `namen.sort((a, b) => a.localeCompare(b))`.

## Für jedes Element etwas tun

`forEach` ruft eine Funktion für jedes Element auf. Anders als `map` baut es keine neue Liste und gibt nichts zurück. Du nimmst es, wenn du mit jedem Element nur etwas tun willst, zum Beispiel etwas ausgeben:

```js
["Lea", "Tom"].forEach((name, i) => console.log(`${i + 1}. ${name}`));
```

Die Funktion bekommt als zweiten Wert den Index `i`. Weil er bei 0 beginnt, steht im Text `i + 1`. Ausgegeben werden „1. Lea“ und „2. Tom“.

## Zwischen Text und Liste wechseln

`split` zerlegt einen Text in eine Liste. Du sagst ihm, an welcher Stelle geschnitten wird. `join` macht es umgekehrt und klebt eine Liste zu einem Text zusammen:

```js
const zeile = "Äpfel, Birnen, Kirschen";
const obst = zeile.split(", ");
console.log(obst);
console.log(obst.join(" & "));
```

`split(", ")` schneidet an jedem Komma mit Leerzeichen. Heraus kommt `["Äpfel", "Birnen", "Kirschen"]`. `join(" & ")` setzt zwischen die Teile ein „&“, also „Äpfel & Birnen & Kirschen“.

## Ein Stück herausnehmen

`slice(von, bis)` kennst du schon von Texten. Bei Listen funktioniert es genauso: Es liefert eine Kopie eines Stücks, und die Position `bis` gehört nicht mehr dazu.

```js
const woche = ["Mo", "Di", "Mi", "Do", "Fr"];
console.log(woche.slice(1, 3));
console.log(woche.slice(-2));
console.log(woche);
```

`slice(1, 3)` nimmt die Positionen 1 und 2, also `["Di", "Mi"]`. Eine negative Zahl zählt von hinten. Deshalb nimmt `slice(-2)` die letzten zwei Tage. Die letzte Zeile zeigt, dass `woche` noch alle fünf Tage enthält.
