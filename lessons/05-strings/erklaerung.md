## Ein Text ist eine Perlenkette

:::alltag
Stell dir einen Text als Perlenkette vor: Jede Perle ist ein Zeichen, und jede Perle hat eine Hausnummer. Die erste Perle hat die Nummer **0**, nicht 1.
:::

```js
const wort = "Codewerk";
console.log(wort.length);
console.log(wort[0]);
console.log(wort[wort.length - 1]);
console.log(wort.at(-1));
```

- `length` ist die Anzahl der Zeichen.
- `wort[0]` ist das erste Zeichen. `at(-1)` zählt von hinten.

## Werkzeuge für Texte

Ein Text bringt viele **Methoden** mit. Du rufst sie mit einem Punkt auf:

```js
const eingabe = "  Hallo Welt  ";
console.log(eingabe.trim());
console.log(eingabe.toUpperCase());
console.log("Hallo Welt".toLowerCase());
console.log("Hallo Welt".includes("Welt"));
console.log("foto.PNG".endsWith(".PNG"));
console.log("Nürnberg".slice(0, 3));
console.log("1-2-3".replaceAll("-", "+"));
console.log("7".padStart(3, "0"));
```

| Methode | Ergebnis |
| --- | --- |
| `trim()` | ohne Leerzeichen am Anfang und Ende |
| `toUpperCase()`, `toLowerCase()` | alles groß oder klein |
| `includes(x)` | `true`, wenn `x` irgendwo vorkommt |
| `startsWith(x)`, `endsWith(x)` | `true`, wenn der Text so anfängt oder endet |
| `slice(von, bis)` | ein Stück; `bis` gehört nicht mehr dazu |
| `replaceAll(alt, neu)` | jedes `alt` wird zu `neu` |
| `padStart(länge, zeichen)` | vorne auffüllen, z. B. für `007` |

## Texte ändern sich nie

Keine dieser Methoden verändert den ursprünglichen Text. Sie liefern immer einen **neuen** Text. Den musst du speichern oder zurückgeben:

```js
let name = "  mara ";
name.trim();
console.log(`[${name}]`);
name = name.trim();
console.log(`[${name}]`);
```

Methoden lassen sich auch verketten: `text.trim().toLowerCase()` entfernt erst die Leerzeichen und macht dann alles klein.
