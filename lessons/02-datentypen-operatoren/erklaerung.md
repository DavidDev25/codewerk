## Jeder Wert hat einen Typ

:::alltag
In einer Küche gibt es Mehl, Eier und Milch. Alles sind Zutaten, aber du gehst mit jeder anders um: Mehl wiegst du, Eier zählst du, Milch misst du in Litern. In JavaScript ist das ähnlich. Jeder Wert hat einen **Typ**, und der Typ bestimmt, was du damit machen kannst.
:::

| Typ | Beispiel | Wofür |
| --- | --- | --- |
| `number` | `42`, `3.5`, `-7` | Zahlen, mit und ohne Komma |
| `string` | `"Hallo"`, `'Nürnberg'` | Texte |
| `boolean` | `true`, `false` | Ja oder Nein |
| `undefined` | `undefined` | „hat noch keinen Wert“ |
| `null` | `null` | „absichtlich leer“ |

Mit `typeof` fragst du nach dem Typ:

```js
console.log(typeof 42);
console.log(typeof "42");
console.log(typeof true);
let spaeter;
console.log(typeof spaeter);
```

## Rechnen

```js
console.log(7 + 3);
console.log(7 - 3);
console.log(7 * 3);
console.log(7 / 2);
console.log(7 % 3);
console.log(2 ** 3);
```

- `%` ist der **Rest** einer Division: `7 % 3` ist `1`, weil 7 = 2 · 3 + **1**. Damit prüfst du zum Beispiel, ob eine Zahl gerade ist: `zahl % 2 === 0`.
- `**` heißt „hoch“: `2 ** 3` ist 2 · 2 · 2.
- Das Komma schreibst du in JavaScript als **Punkt**: `3.5`.

## Vorsicht bei Text und Zahl

Das `+` hat zwei Bedeutungen: Bei Zahlen rechnet es, bei Texten klebt es zusammen. Ist **einer** der beiden Werte ein Text, wird geklebt:

```js
console.log(5 + 3);
console.log("5" + 3);
console.log(Number("5") + 3);
```

Werte aus Formularen kommen immer als Text an. Mit `Number(…)` wandelst du sie in eine Zahl um.

## Vergleichen

Vergleiche ergeben immer `true` oder `false`:

```js
console.log(5 > 3);
console.log(5 === 5);
console.log(5 !== 3);
console.log(5 === "5");
```

| Operator | Bedeutung |
| --- | --- |
| `===` | gleich (Wert **und** Typ) |
| `!==` | ungleich |
| `>`, `<`, `>=`, `<=` | größer, kleiner, größer gleich, kleiner gleich |

:::alltag
Es gibt auch `==` mit nur zwei Zeichen. Es wandelt Typen heimlich um, deshalb ist `5 == "5"` wahr. Das führt zu schwer findbaren Fehlern. Nimm immer `===`.
:::
