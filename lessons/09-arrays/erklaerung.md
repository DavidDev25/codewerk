## Ein Array ist eine nummerierte Liste

Oft hast du nicht nur einen Wert, sondern viele: mehrere Namen, Preise oder Einkäufe. Statt für jeden eine eigene Variable anzulegen, packst du sie in eine Liste. Diese Liste heißt **Array**.

:::alltag
Denk an eine Einkaufsliste auf Papier. Jede Zeile hat eine Position. Du kannst oben nachlesen, unten etwas dazuschreiben oder fragen: „Steht Brot drauf?“
:::

## Ein Array anlegen und lesen

Ein Array schreibst du in eckigen Klammern. Die Einträge trennst du mit Kommas:

```js
const farben = ["rot", "grün", "blau"];

console.log(farben[0]);
console.log(farben[2]);
console.log(farben.length);
```

Die Ausgabe ist `rot`, `blau` und 3.

- Mit `farben[0]` holst du den ersten Eintrag. Wie bei Texten beginnt die Zählung bei 0.
- `farben[2]` ist deshalb schon der dritte Eintrag.
- `length` ist die Anzahl der Einträge.

Weil die Zählung bei 0 beginnt, hat der letzte Eintrag immer die Nummer `length - 1`.

## Einträge hinzufügen und suchen

Zwei Werkzeuge brauchst du besonders oft:

```js
const zahlen = [1, 2, 3];
zahlen.push(4);
console.log(zahlen);
console.log(zahlen.includes(3));
console.log(zahlen.includes(9));
console.log(zahlen[zahlen.length - 1]);
```

Die Ausgabe ist `[1, 2, 3, 4]`, dann `true`, dann `false` und dann 4.

- `push(…)` hängt hinten einen neuen Eintrag an.
- `includes(…)` fragt: „Ist das in der Liste?“ und antwortet mit `true` oder `false`.
- `zahlen[zahlen.length - 1]` holt den letzten Eintrag, egal wie lang die Liste gerade ist.

Vielleicht wunderst du dich, dass `push` bei einer `const`-Variable funktioniert. `const` verbietet nur, der Variable ein ganz neues Array zu geben. Den Inhalt des Arrays darfst du trotzdem ändern.

Schau nach dem Ausführen ins **Diagramm**. Dort siehst du ein Array als Box mit nummerierten Zeilen.
