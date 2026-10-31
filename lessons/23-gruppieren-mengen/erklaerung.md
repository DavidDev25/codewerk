## Listen in Gruppen aufteilen

Oft willst du eine Liste nach einer Eigenschaft aufteilen, zum Beispiel Produkte nach ihrer Kategorie. Früher brauchte man dafür `reduce`. Seit 2024 gibt es dafür eine eigene Funktion: `Object.groupBy`.

:::alltag
Es ist wie beim Wäschesortieren. Du gehst den Korb einmal durch und legst jedes Teil auf den passenden Stapel. Die Funktion, die du mitgibst, sagt für jedes Teil, auf welchen Stapel es gehört.
:::

Im Beispiel bekommt `Object.groupBy` die Liste und eine kleine Funktion. Die Funktion gibt für jedes Produkt seine Kategorie zurück:

```js
const produkte = [
  { name: "Apfel", kategorie: "Obst" },
  { name: "Brot", kategorie: "Backwaren" },
  { name: "Birne", kategorie: "Obst" },
];

const gruppen = Object.groupBy(produkte, (p) => p.kategorie);
console.log(gruppen.Obst.map((p) => p.name));
console.log(Object.keys(gruppen));
```

Heraus kommt ein Objekt mit einer Liste pro Gruppe. In `gruppen.Obst` liegen Apfel und Birne, deshalb gibt die erste Zeile `["Apfel", "Birne"]` aus. Die zweite Zeile zeigt die Namen der Gruppen: `["Obst", "Backwaren"]`. Was die Funktion zurückgibt, wird also zum **Schlüssel** der Gruppe.

`Map.groupBy` funktioniert genauso, liefert aber eine **Map**. Das ist praktisch, wenn die Schlüssel keine Texte sind. Hier teilst du Zahlen in gerade und ungerade. Die Schlüssel sind also `true` und `false`:

```js
const zahlen = [1, 2, 3, 4, 5];
const geradeUngerade = Map.groupBy(zahlen, (z) => z % 2 === 0);
console.log(geradeUngerade.get(true), geradeUngerade.get(false));
```

`get(true)` liefert die geraden Zahlen `[2, 4]`, `get(false)` die ungeraden `[1, 3, 5]`. In einem Objekt würden `true` und `false` zu den Texten `"true"` und `"false"`. Die Map behält sie als echte Wahrheitswerte.

## Mengen verknüpfen

Die Sets aus Lektion 22 können seit 2024 auch rechnen wie Mengen in der Mathematik. Im Beispiel gibt es zwei Kurse, und Tom ist in beiden:

```js
const kursA = new Set(["Lea", "Tom", "Ben"]);
const kursB = new Set(["Tom", "Mia"]);

console.log([...kursA.union(kursB)]);
console.log([...kursA.intersection(kursB)]);
console.log([...kursA.difference(kursB)]);
console.log([...kursA.symmetricDifference(kursB)]);
console.log(new Set(["Tom"]).isSubsetOf(kursA));
```

Die Ausgaben der Reihe nach:

- `union` legt beide zusammen: `["Lea", "Tom", "Ben", "Mia"]`. Tom steht nur einmal drin.
- `intersection` behält nur, wer in **beiden** Kursen ist: `["Tom"]`.
- `difference` behält, wer in Kurs A ist, aber **nicht** in Kurs B: `["Lea", "Ben"]`.
- `symmetricDifference` behält, wer in genau **einem** der beiden Kurse ist: `["Lea", "Ben", "Mia"]`.
- `isSubsetOf` prüft, ob alle aus dem ersten Set auch im zweiten stecken. Tom ist in Kurs A, also kommt `true` heraus.

In der Mathematik heißen die ersten drei Vereinigung, Schnittmenge und Differenz.

Alle Methoden liefern ein **neues** Set. `kursA` und `kursB` bleiben unverändert.
