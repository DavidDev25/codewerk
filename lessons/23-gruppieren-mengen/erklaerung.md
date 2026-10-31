## Listen in Gruppen sortieren

Eine sehr häufige Aufgabe: Einträge nach einer Eigenschaft gruppieren, etwa Produkte nach Kategorie. Früher brauchte man dafür `reduce`. Seit 2024 gibt es eine eigene Funktion:

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

:::alltag
Wie beim Wäschesortieren: Du gehst den Korb einmal durch und legst jedes Teil auf den passenden Stapel. Die Funktion, die du mitgibst, sagt für jedes Teil, auf welchen Stapel es gehört.
:::

- Die Funktion bekommt jeden Eintrag und gibt den **Schlüssel** der Gruppe zurück.
- Ergebnis: ein Objekt mit einem Array pro Schlüssel.
- `Map.groupBy` macht dasselbe, liefert aber eine **Map**. Das ist praktisch, wenn die Schlüssel keine Texte sind, zum Beispiel `true`/`false`:

```js
const zahlen = [1, 2, 3, 4, 5];
const geradeUngerade = Map.groupBy(zahlen, (z) => z % 2 === 0);
console.log(geradeUngerade.get(true), geradeUngerade.get(false));
```

## Mengen verknüpfen

Sets (Lektion 22) haben seit 2024 die Mengen-Operationen aus der Mathematik:

```js
const kursA = new Set(["Lea", "Tom", "Ben"]);
const kursB = new Set(["Tom", "Mia"]);

console.log([...kursA.union(kursB)]);
console.log([...kursA.intersection(kursB)]);
console.log([...kursA.difference(kursB)]);
console.log([...kursA.symmetricDifference(kursB)]);
console.log(new Set(["Tom"]).isSubsetOf(kursA));
```

| Methode | Ergebnis |
| --- | --- |
| `a.union(b)` | alle aus a **oder** b (Vereinigung) |
| `a.intersection(b)` | nur die in a **und** b (Schnittmenge) |
| `a.difference(b)` | die aus a, die **nicht** in b sind |
| `a.symmetricDifference(b)` | die in genau einer der beiden |
| `a.isSubsetOf(b)` | `true`, wenn alles aus a auch in b ist |

Alle Methoden liefern ein **neues** Set. Die Originale bleiben unverändert.
