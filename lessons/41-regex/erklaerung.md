## Suchen mit Mustern

Mit `includes` findest du einen festen Text. Oft suchst du aber nach einer **Art** von Text: „fünf Ziffern“, „irgendeine E-Mail-Adresse“, „ein Datum“. Dafür gibt es **reguläre Ausdrücke**, kurz RegEx.

:::alltag
Ein Schlüsselbund mit Schablonen statt Schlüsseln: Eine Schablone hat fünf Löcher für Ziffern. Du hältst sie an einen Text, und sie sagt dir, ob er hineinpasst.
:::

Ein regulärer Ausdruck steht zwischen zwei Schrägstrichen:

```js
const plz = /^\d{5}$/;
console.log(plz.test("90459"));
console.log(plz.test("9045"));
console.log(plz.test("90459a"));
```

## Die Bausteine

| Zeichen | passt auf |
| --- | --- |
| `\d` | eine Ziffer 0–9 |
| `\w` | Buchstabe (ohne Umlaute), Ziffer oder `_` |
| `\s` | Leerzeichen, Tab, Zeilenumbruch |
| `.` | irgendein Zeichen |
| `[abc]` | eines der Zeichen a, b oder c |
| `[^abc]` | jedes Zeichen **außer** a, b, c |
| `^` / `$` | Anfang / Ende des Textes |

Wie oft etwas vorkommen soll, steht dahinter:

| Zeichen | bedeutet |
| --- | --- |
| `+` | einmal oder öfter |
| `*` | keinmal oder öfter |
| `?` | keinmal oder einmal |
| `{5}` | genau fünfmal |
| `{2,4}` | zwei- bis viermal |

Hinter dem zweiten Schrägstrich stehen **Flags**: `i` ignoriert Groß- und Kleinschreibung, `g` findet **alle** Treffer statt nur den ersten.

## Finden

```js
const text = "3 Äpfel, 12 Birnen und 7 Kiwis";
console.log(text.match(/\d+/));
console.log(text.match(/\d+/g));
console.log("keine Zahl".match(/\d+/g));
```

Ohne Treffer liefert `match` `null`. Mit `?? []` machst du daraus ein leeres Array.

## Gruppen und Ersetzen

Runde Klammern bilden **Gruppen**. Beim Ersetzen holst du sie mit `$1`, `$2`, … zurück:

```js
const iso = "2026-10-31";
console.log(iso.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1"));

console.log("Hallo   Welt".replace(/\s+/g, " "));
```

Gruppen kannst du auch auslesen:

```js
const treffer = "Bestellung #4711 von Mara".match(/#(\d+) von (\w+)/);
console.log(treffer[1], treffer[2]);
```

:::alltag
Reguläre Ausdrücke sind mächtig, aber schwer zu lesen. Halte sie kurz und teste sie mit mehreren Beispielen, auch mit falschen. Für sehr komplizierte Formate (zum Beispiel jede gültige E-Mail-Adresse der Welt) gibt es keine perfekte RegEx. Eine grobe Prüfung reicht meist.
:::
