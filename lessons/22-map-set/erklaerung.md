## Set: jede Sache nur einmal

:::alltag
Denk an eine Stempelkarte im Museum. Jeder Raum bekommt genau **einen** Stempel. Gehst du zweimal in denselben Raum, gibt es keinen zweiten. Ein **Set** ist so eine Sammlung, in der nichts doppelt vorkommt.
:::

Ein Set legst du mit `new Set()` an. Im Beispiel trägst du drei Räume ein, einen davon doppelt:

```js
const besucht = new Set();
besucht.add("Ägypten");
besucht.add("Dinos");
besucht.add("Ägypten");

console.log(besucht.size);
console.log(besucht.has("Dinos"));
besucht.delete("Dinos");
console.log([...besucht]);
```

`size` ist 2, nicht 3. Das zweite „Ägypten“ hat das Set einfach ignoriert. `has` meldet `true`, weil „Dinos“ drin ist. Nach `delete` bleibt nur „Ägypten“ übrig. Mit `[...besucht]` machst du aus dem Set eine Liste, damit du sie ausgeben kannst.

| Methode | Bedeutung |
| --- | --- |
| `add(wert)` | hinzufügen, Doppelte werden ignoriert |
| `has(wert)` | `true`, wenn der Wert drin ist |
| `delete(wert)` | entfernen |
| `size` | Anzahl der Einträge |

Der häufigste Trick mit Sets: Doppelte aus einer Liste entfernen. Du steckst die Liste in ein Set und machst das Set wieder zu einer Liste:

```js
const tags = ["js", "css", "js", "html", "css"];
const einzeln = [...new Set(tags)];
console.log(einzeln);
```

Heraus kommt `["js", "css", "html"]`. Jeder Eintrag bleibt einmal übrig, und zwar an der Stelle, an der er zuerst vorkam.

## Map: Zuordnungen

Eine **Map** ordnet jedem Schlüssel einen Wert zu, so wie ein Objekt. Statt mit einem Punkt arbeitest du aber mit Methoden: `set` speichert einen Wert, `get` liest ihn. Im Beispiel speicherst du zwei Preise:

```js
const preise = new Map();
preise.set("Brot", 3);
preise.set("Milch", 1.5);

console.log(preise.get("Brot"));
console.log(preise.has("Käse"));
console.log(preise.size);

for (const [ware, preis] of preise) {
  console.log(`${ware}: ${preis} €`);
}
```

`get("Brot")` liefert 3. `has("Käse")` ergibt `false`, weil kein Käse eingetragen ist. `size` zählt 2 Einträge. Mit `for…of` gehst du alle Paare durch, genau wie bei `Object.entries` in Lektion 20. Ausgegeben werden „Brot: 3 €“ und „Milch: 1.5 €“.

Eine Map hat drei Vorteile gegenüber einem Objekt:

- Schlüssel können **alles** sein, auch Zahlen oder Objekte. Bei einem Objekt werden Schlüssel immer zu Text.
- `size` sagt dir sofort, wie viele Einträge es gibt.
- Die Einträge bleiben in der Reihenfolge, in der du sie eingefügt hast.

## Zählen mit einer Map

Mit einer Map kannst du gut zählen, wie oft etwas vorkommt. Im Beispiel wird abgestimmt, was es zu essen gibt:

```js
const stimmen = ["Pizza", "Pasta", "Pizza", "Salat", "Pizza"];
const ergebnis = new Map();
for (const essen of stimmen) {
  ergebnis.set(essen, (ergebnis.get(essen) ?? 0) + 1);
}
console.log(ergebnis);
```

Heraus kommt eine Map mit Pizza 3, Pasta 1 und Salat 1. Der Trick steckt in `ergebnis.get(essen) ?? 0`. Kommt ein Essen zum ersten Mal vor, liefert `get` noch `undefined`. Mit `?? 0` startest du dann bei 0 und zählst eins dazu.

## Was du wann nimmst

| Du brauchst … | Nimm |
| --- | --- |
| feste Eigenschaften wie `name` und `alter` | Objekt |
| wechselnde Einträge, Zähler, beliebige Schlüssel | Map |
| eindeutige Werte ohne Zuordnung | Set |
