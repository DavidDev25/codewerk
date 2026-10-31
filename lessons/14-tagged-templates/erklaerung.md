## Template-Strings können noch mehr

Seit Lektion 1 setzt du Werte mit Backticks und `${…}` in Texte ein. Template-Strings können auch über mehrere Zeilen gehen:

```js
const name = "Mara";
const brief = `Hallo ${name},

schön, dass du da bist.`;
console.log(brief);
```

## Eine Funktion vor dem Template

Schreibst du einen Funktionsnamen **direkt vor** die Backticks, ruft JavaScript diese Funktion auf, statt den Text einfach zusammenzusetzen. So eine Funktion heißt **Tag**:

```js
function zeigen(teile, ...werte) {
  console.log(teile);
  console.log(werte);
}

const name = "Mara";
const punkte = 3;
zeigen`Hallo ${name}, du hast ${punkte} Punkte.`;
```

- `teile` ist ein Array mit den **festen Textstücken**: `["Hallo ", ", du hast ", " Punkte."]`.
- `werte` sind die eingesetzten Werte (Rest-Parameter aus Lektion 13).
- Es gibt immer **ein Textstück mehr** als Werte.

:::alltag
Wie ein Serienbrief: Die Vorlage hat Lücken, und du bekommst die Vorlagenteile und die Einsetzwerte getrennt. So kannst du entscheiden, **wie** jeder Wert eingesetzt wird: fett gedruckt, geprüft oder umgerechnet.
:::

Das Ergebnis baust du selbst zusammen. Was die Tag-Funktion zurückgibt, ist das Ergebnis des ganzen Ausdrucks:

```js
function laut(teile, ...werte) {
  let text = teile[0];
  for (let i = 0; i < werte.length; i++) {
    text += String(werte[i]).toUpperCase() + teile[i + 1];
  }
  return text;
}

const tier = "Katze";
console.log(laut`Da ist eine ${tier}!`);
```

## Wofür das gut ist

Tagged Templates siehst du in echten Projekten oft, zum Beispiel:
- zum **sicheren Einsetzen** von Nutzereingaben in HTML oder Datenbankabfragen, weil der Tag jeden Wert prüfen kann, bevor er im Text landet,
- in Bibliotheken für CSS (`styled-components`) oder GraphQL.

## String.raw

Ein eingebauter Tag: `String.raw` lässt Backslashes einfach stehen, statt sie als Sonderzeichen wie `\n` zu lesen. Praktisch für Windows-Pfade:

```js
console.log(`C:\neu`);
console.log(String.raw`C:\neu`);
```
