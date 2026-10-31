## Suchen mit Mustern

Mit `includes` findest du einen festen Text. Oft suchst du aber nach einer **Art** von Text: fünf Ziffern, irgendeine E-Mail-Adresse oder ein Datum. Dafür gibt es **reguläre Ausdrücke**, kurz RegEx.

:::alltag
Stell dir eine Schablone mit fünf Löchern vor, in die genau eine Ziffer passt. Du hältst sie an einen Text, und sie sagt dir, ob er hineinpasst. Ein regulärer Ausdruck ist so eine Schablone für Text.
:::

Ein regulärer Ausdruck steht zwischen zwei Schrägstrichen. Im Beispiel prüfst du, ob ein Text eine Postleitzahl ist:

```js
const plz = /^\d{5}$/;
console.log(plz.test("90459"));
console.log(plz.test("9045"));
console.log(plz.test("90459a"));
```

Nur die erste Zeile gibt `true` aus. „9045“ hat nur vier Ziffern. Bei „90459a“ folgt nach den fünf Ziffern noch ein Buchstabe. Das Muster liest sich so: `^` steht für den Anfang, `\d{5}` für genau fünf Ziffern und `$` für das Ende. Dazwischen darf nichts anderes stehen.

## Die Bausteine

| Zeichen | passt auf |
| --- | --- |
| `\d` | eine Ziffer von 0 bis 9 |
| `\w` | einen Buchstaben ohne Umlaute, eine Ziffer oder `_` |
| `\s` | Leerzeichen, Tab oder Zeilenumbruch |
| `.` | irgendein Zeichen |
| `[abc]` | eines der Zeichen a, b oder c |
| `[^abc]` | jedes Zeichen **außer** a, b und c |
| `^` und `$` | Anfang und Ende des Textes |

Wie oft etwas vorkommen soll, steht direkt dahinter:

| Zeichen | bedeutet |
| --- | --- |
| `+` | einmal oder öfter |
| `*` | keinmal oder öfter |
| `?` | keinmal oder einmal |
| `{5}` | genau fünfmal |
| `{2,4}` | zwei- bis viermal |

Hinter dem zweiten Schrägstrich können noch **Flags** stehen. `i` ignoriert Groß- und Kleinschreibung. `g` findet **alle** Treffer statt nur den ersten.

## Finden

Mit `match` holst du die Treffer aus einem Text. Im Beispiel suchst du Zahlen:

```js
const text = "3 Äpfel, 12 Birnen und 7 Kiwis";
console.log(text.match(/\d+/));
console.log(text.match(/\d+/g));
console.log("keine Zahl".match(/\d+/g));
```

Ohne Flag findet `match` nur den ersten Treffer, also `["3"]`. Mit `g` findet es alle: `["3", "12", "7"]`. Die Treffer sind Texte, keine Zahlen. Im letzten Text gibt es keine Zahl, deshalb kommt `null` heraus. Mit `?? []` machst du daraus ein leeres Array.

## Gruppen und Ersetzen

Runde Klammern bilden **Gruppen**. Beim Ersetzen holst du sie mit `$1`, `$2` und so weiter zurück. Im Beispiel drehst du ein Datum um und räumst doppelte Leerzeichen auf:

```js
const iso = "2026-10-31";
console.log(iso.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1"));

console.log("Hallo   Welt".replace(/\s+/g, " "));
```

Die erste Zeile gibt „31.10.2026“ aus. Gruppe 1 ist das Jahr, Gruppe 2 der Monat und Gruppe 3 der Tag. `"$3.$2.$1"` setzt sie in umgekehrter Reihenfolge mit Punkten zusammen. Die zweite Zeile ersetzt jede Folge von Leerzeichen durch ein einzelnes. Heraus kommt „Hallo Welt“.

Gruppen kannst du auch auslesen:

```js
const treffer = "Bestellung #4711 von Mara".match(/#(\d+) von (\w+)/);
console.log(treffer[1], treffer[2]);
```

Ausgegeben wird „4711 Mara“. In `treffer[1]` steht die erste Gruppe, in `treffer[2]` die zweite.

:::tipp
Reguläre Ausdrücke sind mächtig, aber schwer zu lesen. Halte sie kurz und teste sie mit mehreren Beispielen, auch mit falschen. Für sehr komplizierte Formate wie jede gültige E-Mail-Adresse der Welt gibt es keinen perfekten Ausdruck. Eine grobe Prüfung reicht meistens.
:::
