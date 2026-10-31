## Funktionen weitergeben

In JavaScript ist eine Funktion ein ganz normaler Wert. Du kannst sie in eine Variable stecken oder einer anderen Funktion **übergeben**. Eine Funktion, die du so übergibst, nennt man **Callback**, auf Deutsch „Rückruf“. Die andere Funktion ruft sie nämlich später zurück.

Im Beispiel bekommt `zweimal` eine Funktion und ruft sie zweimal auf:

```js
function zweimal(aufgabe) {
  aufgabe();
  aufgabe();
}

zweimal(() => console.log("Hallo!"));
```

Ausgegeben wird zweimal „Hallo!“. `zweimal` weiß selbst nicht, **was** passieren soll. Das bestimmt der Callback, den du mitgibst.

## Später ausführen mit setTimeout

:::alltag
Du stellst eine Eieruhr auf 3 Minuten und machst in der Zwischenzeit Toast. Wenn die Uhr klingelt, holst du die Eier heraus. Du wartest also **nicht** neben dem Topf. Du sagst nur, was passieren soll, wenn es so weit ist.
:::

`setTimeout` ist so eine Eieruhr. Du gibst ihr einen Callback und eine Wartezeit in Millisekunden. 500 Millisekunden sind eine halbe Sekunde:

```js
console.log("Eieruhr gestellt");

setTimeout(() => {
  console.log("Klingeling – Eier sind fertig!");
}, 500);

console.log("Ich mache Toast");
```

Schau dir die **Reihenfolge** der Ausgabe an: Erst kommen „Eieruhr gestellt“ und „Ich mache Toast“. Die Eier kommen zuletzt, obwohl sie im Code in der Mitte stehen. Das Programm wartet nicht auf den Timer, sondern läuft sofort weiter. Der Callback läuft erst, wenn die halbe Sekunde um ist.

- `setTimeout(callback, ms)` führt den Callback einmal aus, nach `ms` Millisekunden.
- `setInterval(callback, ms)` führt ihn immer wieder aus, alle `ms` Millisekunden. Du stoppst ihn mit `clearInterval(id)`. Die `id` bekommst du von `setInterval` zurück.
