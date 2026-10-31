## Ein Text ist eine Perlenkette

Texte heißen in JavaScript **Strings**. Ein String besteht aus einzelnen Zeichen, die hintereinander stehen. Jedes Zeichen hat eine Nummer, mit der du es erreichen kannst.

:::alltag
Stell dir einen Text als Perlenkette vor. Jede Perle ist ein Zeichen, und jede Perle hat eine Hausnummer. Die erste Perle hat die Nummer 0, nicht 1.
:::

```js
const wort = "Codewerk";
console.log(wort.length);
console.log(wort[0]);
console.log(wort[wort.length - 1]);
console.log(wort.at(-1));
```

Die Ausgabe ist 8, dann `C`, dann zweimal `k`.

- `length` ist die Anzahl der Zeichen. „Codewerk“ hat 8.
- `wort[0]` ist das erste Zeichen, weil das Zählen bei 0 beginnt.
- Das letzte Zeichen hat deshalb die Nummer `length - 1`, also 7.
- Einfacher geht es mit `at(-1)`. Negative Zahlen zählen von hinten.

## Werkzeuge für Texte

Ein String bringt viele eingebaute Werkzeuge mit. Man nennt sie **Methoden**. Du rufst sie mit einem Punkt hinter dem Text auf:

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

Probier das Beispiel aus und vergleiche die Ausgabe mit dieser Tabelle:

| Methode | Was sie macht |
| --- | --- |
| `trim()` | entfernt Leerzeichen am Anfang und am Ende |
| `toUpperCase()`, `toLowerCase()` | macht alles groß oder alles klein |
| `includes(x)` | `true`, wenn `x` irgendwo im Text vorkommt |
| `startsWith(x)`, `endsWith(x)` | `true`, wenn der Text so anfängt oder endet |
| `slice(von, bis)` | schneidet ein Stück heraus; das Zeichen bei `bis` gehört nicht mehr dazu |
| `replaceAll(alt, neu)` | ersetzt jedes `alt` durch `neu` |
| `padStart(länge, zeichen)` | füllt vorne auf, zum Beispiel aus `7` wird `007` |

`"Nürnberg".slice(0, 3)` ergibt `Nür`: die Zeichen 0, 1 und 2. Das Zeichen Nummer 3 ist nicht mehr dabei.

## Texte ändern sich nie

Keine dieser Methoden verändert den ursprünglichen Text. Sie liefern immer einen **neuen** Text. Den musst du speichern oder zurückgeben:

```js
let name = "  mara ";
name.trim();
console.log(`[${name}]`);
name = name.trim();
console.log(`[${name}]`);
```

Die erste Ausgabe ist `[  mara ]`, die Leerzeichen sind noch da. Die Zeile `name.trim();` hat zwar einen sauberen Text erzeugt, ihn aber nirgends gespeichert. Erst `name = name.trim();` speichert das Ergebnis. Die zweite Ausgabe ist deshalb `[mara]`.

Du kannst Methoden auch hintereinander hängen: `text.trim().toLowerCase()` entfernt erst die Leerzeichen und macht dann alles klein.
