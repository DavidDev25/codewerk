## Texte über mehrere Zeilen

Seit Lektion 1 setzt du Werte mit Backticks und `${…}` in Texte ein. Solche Texte heißen **Template-Strings**. Sie können noch mehr, zum Beispiel über mehrere Zeilen gehen:

```js
const name = "Mara";
const brief = `Hallo ${name},

schön, dass du da bist.`;
console.log(brief);
```

Die Ausgabe hat drei Zeilen, genau wie im Code. Bei normalen Anführungszeichen ginge das nicht.

## Eine Funktion vor den Backticks

Schreibst du einen Funktionsnamen direkt vor die Backticks, setzt JavaScript den Text nicht einfach zusammen. Stattdessen ruft es die Funktion auf und gibt ihr die Einzelteile. So eine Funktion heißt **Tag**.

:::alltag
Denk an einen Serienbrief. Die Vorlage hat Lücken für Namen und Zahlen. Ein Tag bekommt die Vorlage und die Werte getrennt und entscheidet selbst, wie jeder Wert eingesetzt wird: fett, geprüft oder umgerechnet.
:::

So sieht man, was ein Tag bekommt:

```js
function zeigen(teile, ...werte) {
  console.log(teile);
  console.log(werte);
}

const name = "Mara";
const punkte = 3;
zeigen`Hallo ${name}, du hast ${punkte} Punkte.`;
```

Die Ausgabe ist `["Hallo ", ", du hast ", " Punkte."]` und dann `["Mara", 3]`.

- `teile` ist ein Array mit den festen Textstücken zwischen den Lücken.
- `werte` sammelt die eingesetzten Werte ein. Das ist der Rest-Parameter aus Lektion 13.
- Es gibt immer ein Textstück mehr als Werte. Das erste Stück steht vor dem ersten Wert, das letzte nach dem letzten.

## Den Text selbst zusammenbauen

Was der Tag zurückgibt, ist das Ergebnis des ganzen Ausdrucks. Hier macht ein Tag jeden Wert groß:

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

Die Ausgabe ist `Da ist eine KATZE!` Das Muster ist immer gleich: Du startest mit dem ersten Textstück. Dann hängst du für jeden Wert den veränderten Wert und das nächste Textstück an.

## Wofür man das braucht

In echten Projekten siehst du Tags vor allem für zwei Dinge:

- Nutzereingaben sicher in HTML oder Datenbankabfragen einsetzen. Der Tag kann jeden Wert prüfen und entschärfen, bevor er im Text landet.
- Bibliotheken für CSS oder Datenbanken, die ihre eigene kleine Sprache in Template-Strings schreiben.

## String.raw

Ein Tag ist schon eingebaut: `String.raw`. Normalerweise ist ein Backslash in einem Text ein Sonderzeichen. `\n` steht zum Beispiel für einen Zeilenumbruch. `String.raw` lässt Backslashes einfach stehen:

```js
console.log(`C:\neu`);
console.log(String.raw`C:\neu`);
```

Die erste Zeile gibt `C:` und darunter `eu` aus, weil `\n` als Zeilenumbruch gelesen wird. Die zweite gibt den Pfad richtig aus: `C:\neu`. Das ist praktisch für Pfade unter Windows.
