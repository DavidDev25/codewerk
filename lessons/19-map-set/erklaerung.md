## Set: jede Sache nur einmal

:::alltag
Eine Stempelkarte im Museum: Jeder Raum bekommt genau **einen** Stempel. Gehst du zweimal in denselben Raum, gibt es keinen zweiten. Ein **Set** ist so eine Sammlung ohne Doppelte.
:::

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

| Methode | Bedeutung |
| --- | --- |
| `add(wert)` | hinzufügen (Doppelte werden ignoriert) |
| `has(wert)` | `true`, wenn der Wert drin ist |
| `delete(wert)` | entfernen |
| `size` | Anzahl der Einträge |

Der häufigste Trick: Doppelte aus einem Array entfernen.

```js
const tags = ["js", "css", "js", "html", "css"];
const einzeln = [...new Set(tags)];
console.log(einzeln);
```

## Map: Zuordnungen

Eine **Map** ordnet einem Schlüssel einen Wert zu, wie ein Objekt. Sie hat aber Vorteile, wenn sich die Einträge oft ändern:

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

- Schlüssel können **alles** sein, auch Zahlen oder Objekte. Bei Objekten werden Schlüssel immer zu Text.
- `size` sagt sofort, wie viele Einträge es gibt.
- Die Reihenfolge, in der du einfügst, bleibt erhalten.

## Zählen mit Map

Ein klassischer Einsatz: zählen, wie oft etwas vorkommt.

```js
const stimmen = ["Pizza", "Pasta", "Pizza", "Salat", "Pizza"];
const ergebnis = new Map();
for (const essen of stimmen) {
  ergebnis.set(essen, (ergebnis.get(essen) ?? 0) + 1);
}
console.log(ergebnis);
```

`ergebnis.get(essen)` ist beim ersten Mal `undefined`. Mit `?? 0` startest du dann bei null.

| Wann was? | |
| --- | --- |
| feste Eigenschaften (`name`, `alter`) | Objekt |
| wechselnde Einträge, Zählen, beliebige Schlüssel | Map |
| eindeutige Werte ohne Zuordnung | Set |
