## Eine Variable ist ein beschrifteter Karton

:::alltag
Stell dir einen Umzugskarton vor. Auf dem Etikett steht „Küche“, im Karton liegen Teller. Das **Etikett** ist der Name der Variable. Der **Inhalt** ist ihr Wert.
:::

So legst du Variablen an:

```js
const stadt = "Nürnberg";
let alter = 30;
console.log(stadt, alter);
```

- `const` heißt: Der Inhalt bleibt gleich.
- `let` heißt: Der Inhalt darf sich später ändern.
- Texte stehen in Anführungszeichen. Zahlen nicht.

Einen `let`-Wert änderst du einfach neu:

```js
let punkte = 0;
punkte = punkte + 5;
punkte += 5;
console.log(punkte);
```

Mit Backticks und `${…}` setzt du Werte in einen Text ein:

```js
const name = "Mara";
console.log(`Hallo ${name}!`);
```

Schau nach dem Ausführen ins **Diagramm**: Jede Variable ist eine Box mit ihrem Wert.
