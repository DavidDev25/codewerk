## Funktionen weitergeben

In JavaScript ist eine Funktion ein ganz normaler Wert. Du kannst sie in eine Variable stecken oder einer anderen Funktion **übergeben**. Eine übergebene Funktion nennt man **Callback** (Rückruf).

```js
function zweimal(aufgabe) {
  aufgabe();
  aufgabe();
}

zweimal(() => console.log("Hallo!"));
```

`zweimal` weiß nicht, **was** passieren soll – das bestimmt der Callback.

## Später ausführen mit setTimeout

:::alltag
Du stellst eine Eieruhr auf 3 Minuten und machst in der Zwischenzeit Toast. Wenn die Uhr klingelt, holst du die Eier heraus. Du wartest also **nicht** neben dem Topf – du sagst nur, was passieren soll, wenn es so weit ist.
:::

```js
console.log("Eieruhr gestellt");

setTimeout(() => {
  console.log("Klingeling – Eier sind fertig!");
}, 500);

console.log("Ich mache Toast");
```

Schau dir die **Reihenfolge** der Ausgabe an: Erst kommt alles, was sofort passiert. Der Callback von `setTimeout` läuft erst, wenn die Zeit (in Millisekunden, 500 = eine halbe Sekunde) um ist.

- `setTimeout(callback, ms)` – einmal ausführen, nach `ms` Millisekunden
- `setInterval(callback, ms)` – immer wieder ausführen; stoppen mit `clearInterval(id)`
