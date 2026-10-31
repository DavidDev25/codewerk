## Eine Variable ist ein beschrifteter Karton

Programme müssen sich Dinge merken: einen Namen, einen Punktestand, eine Stadt. Dafür gibt es **Variablen**. Eine Variable ist ein Name, unter dem ein Wert gespeichert ist.

:::alltag
Stell dir einen Umzugskarton vor. Auf dem Etikett steht „Küche“, im Karton liegen Teller. Das Etikett ist der Name der Variable. Der Inhalt ist ihr Wert.
:::

## Variablen anlegen

Mit `const` und `let` legst du eine Variable an. Hinter das `=` schreibst du den Wert:

```js
const stadt = "Nürnberg";
let alter = 30;
console.log(stadt, alter);
```

Die Ausgabe ist `Nürnberg 30`. Der Unterschied zwischen den beiden Wörtern ist einfach:

- Eine `const`-Variable behält ihren Wert für immer.
- Eine `let`-Variable darf später einen neuen Wert bekommen.

Texte stehen immer in Anführungszeichen, Zahlen nicht. Nimm im Zweifel `const`. Nur wenn sich der Wert ändern soll, brauchst du `let`.

## Einen Wert ändern

Einer `let`-Variable gibst du mit `=` einen neuen Wert. Dabei darfst du den alten Wert benutzen:

```js
let punkte = 0;
punkte = punkte + 5;
punkte += 5;
console.log(punkte);
```

Die Ausgabe ist 10. Die zweite Zeile rechnet „alter Wert plus 5“ und speichert das Ergebnis wieder in `punkte`. Die dritte Zeile macht genau dasselbe, nur kürzer: `+= 5` heißt „5 dazuzählen“.

## Werte in einen Text einsetzen

Oft willst du einen Satz bauen, in dem eine Variable vorkommt. Dafür schreibst du den Text zwischen zwei Backticks (`` ` ``) statt Anführungszeichen. An der Stelle, wo der Wert hin soll, steht `${…}`:

```js
const name = "Mara";
console.log(`Hallo ${name}!`);
```

Die Ausgabe ist `Hallo Mara!`. JavaScript ersetzt `${name}` durch den Wert der Variable.

Schau nach dem Ausführen ins **Diagramm**. Dort ist jede Variable eine Box mit ihrem Wert.
