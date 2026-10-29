## Ein Array ist eine nummerierte Liste

:::alltag
Eine Einkaufsliste auf Papier: Jede Zeile hat eine Position. Du kannst vorne nachlesen, hinten etwas anfügen oder fragen: „Steht Brot drauf?“
:::

```js
const farben = ["rot", "grün", "blau"];

console.log(farben[0]);
console.log(farben.length);
```

- Die Zählung beginnt bei **0**.
- `farben.length` ist die Anzahl der Einträge.

Nützliche Werkzeuge:

```js
const zahlen = [1, 2, 3];
zahlen.push(4);
console.log(zahlen);
console.log(zahlen.includes(3));
console.log(zahlen[zahlen.length - 1]);
```

`push` hängt hinten etwas an. `includes` fragt: „Ist das drin?“

Im **Diagramm** siehst du ein Array als Box mit nummerierten Zeilen.
