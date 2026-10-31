## Jeder Wert hat einen Typ

In JavaScript ist nicht jeder Wert gleich. Eine Zahl ist etwas anderes als ein Text, und mit beiden kannst du unterschiedliche Dinge tun. Diese Art eines Werts heißt **Typ**.

:::alltag
In einer Küche gibt es Mehl, Eier und Milch. Alles sind Zutaten, aber du gehst mit jeder anders um: Mehl wiegst du, Eier zählst du, Milch misst du in Litern. Bei Werten in JavaScript ist das genauso.
:::

Diese fünf Typen begegnen dir am Anfang:

| Typ | Beispiel | Wofür |
| --- | --- | --- |
| `number` | `42`, `3.5`, `-7` | Zahlen, mit und ohne Komma |
| `string` | `"Hallo"`, `'Nürnberg'` | Texte |
| `boolean` | `true`, `false` | Ja oder Nein |
| `undefined` | `undefined` | hat noch keinen Wert |
| `null` | `null` | absichtlich leer |

Mit `typeof` fragst du nach dem Typ eines Werts:

```js
console.log(typeof 42);
console.log(typeof "42");
console.log(typeof true);
let spaeter;
console.log(typeof spaeter);
```

Die Ausgabe ist `number`, `string`, `boolean` und `undefined`. Achte auf die zweite Zeile: `"42"` sieht aus wie eine Zahl, steht aber in Anführungszeichen. Deshalb ist es ein Text.

## Rechnen

Für die Grundrechenarten gibt es diese Zeichen:

```js
console.log(7 + 3);
console.log(7 - 3);
console.log(7 * 3);
console.log(7 / 2);
console.log(7 % 3);
console.log(2 ** 3);
```

Die Ausgabe ist 10, 4, 21, 3.5, 1 und 8. Zwei Zeichen sind neu:

- `%` gibt den **Rest** einer Division. 7 geteilt durch 3 ist 2, Rest 1. Deshalb ist `7 % 3` gleich 1. Damit prüfst du zum Beispiel, ob eine Zahl gerade ist: Bei geraden Zahlen ist `zahl % 2` gleich 0.
- `**` heißt „hoch“. `2 ** 3` ist 2 · 2 · 2, also 8.

Das Komma schreibst du in JavaScript als Punkt: `3.5`, nicht `3,5`.

## Vorsicht bei Text und Zahl

Das `+` hat zwei Aufgaben. Bei zwei Zahlen rechnet es. Ist aber einer der beiden Werte ein Text, klebt es die Werte zusammen:

```js
console.log(5 + 3);
console.log("5" + 3);
console.log(Number("5") + 3);
```

Die Ausgabe ist 8, dann `53` und dann wieder 8. In der zweiten Zeile ist `"5"` ein Text, also wird geklebt. In der dritten Zeile macht `Number(…)` aus dem Text eine echte Zahl, und es wird wieder gerechnet.

Das ist wichtig, weil Eingaben aus Formularen immer als Text ankommen. Bevor du damit rechnest, wandelst du sie mit `Number(…)` um.

## Vergleichen

Ein Vergleich ergibt immer `true` (wahr) oder `false` (falsch):

```js
console.log(5 > 3);
console.log(5 === 5);
console.log(5 !== 3);
console.log(5 === "5");
```

Die Ausgabe ist dreimal `true` und dann `false`. Die letzte Zeile ist falsch, weil `===` auch den Typ vergleicht: Eine Zahl ist nie gleich einem Text.

| Zeichen | Bedeutung |
| --- | --- |
| `===` | gleich (Wert und Typ) |
| `!==` | ungleich |
| `>`, `<` | größer, kleiner |
| `>=`, `<=` | größer gleich, kleiner gleich |

:::alltag
Es gibt auch `==` mit nur zwei Zeichen. Es wandelt Typen heimlich um, deshalb ist `5 == "5"` wahr. Das führt zu Fehlern, die man schwer findet. Nimm deshalb immer `===`.
:::
