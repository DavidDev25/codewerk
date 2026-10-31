## Wo eine Variable sichtbar ist

Jede Variable hat einen Bereich, in dem du sie benutzen kannst. Dieser Bereich heißt **Scope**. Bei `let` und `const` ist das der Block aus geschweiften Klammern, in dem die Variable steht, und alles, was darin noch verschachtelt ist.

:::alltag
Denk an eine Wohnung. Wer in der Küche steht, sieht auch, was im Flur liegt. Wer im Flur steht, kann aber nicht in die geschlossene Küche schauen. Bei Variablen ist es genauso: Von innen siehst du nach außen, von außen nicht nach innen.
:::

Im folgenden Beispiel liegt `haus` außen und `moebel` innerhalb der Funktion:

```js
const haus = "außen";

function zimmer() {
  const moebel = "innen";
  console.log(haus, moebel);
}

zimmer();
console.log(typeof moebel);
```

Die Funktion kann beide Variablen ausgeben, weil sie `haus` von außen sieht. Die letzte Zeile steht dagegen außerhalb der Funktion und kennt `moebel` nicht. Deshalb meldet `typeof` dort `"undefined"`.

Das gilt nicht nur für Funktionen, sondern für jeden Block, also auch für `if` und Schleifen:

```js
if (true) {
  const geheim = 42;
}
console.log(typeof geheim);
```

Auch hier ist `geheim` nach der schließenden Klammer verschwunden.

## Eine Funktion merkt sich ihre Umgebung

Eine Funktion kann selbst eine neue Funktion zurückgeben. Das Besondere daran: Die neue Funktion behält Zugriff auf die Variablen, die beim Erstellen um sie herum lagen, auch dann, wenn die äußere Funktion längst fertig ist.

```js
function zaehlerErstellen() {
  let stand = 0;
  return () => {
    stand = stand + 1;
    return stand;
  };
}

const klicks = zaehlerErstellen();
console.log(klicks());
console.log(klicks());
console.log(klicks());
```

Die Ausgabe ist 1, 2 und 3. `zaehlerErstellen` ist nach dem ersten Aufruf beendet, trotzdem zählt `klicks` mit derselben Variable `stand` weiter. Eine Funktion zusammen mit den Variablen, die sie sich so gemerkt hat, nennt man **Closure**.

:::alltag
Stell dir einen Rucksack vor. Wenn die innere Funktion entsteht, packt sie die Variablen ein, die sie braucht, und nimmt sie überallhin mit.
:::

## Jeder Aufruf packt einen eigenen Rucksack

Rufst du `zaehlerErstellen` zweimal auf, entstehen zwei getrennte Zähler mit je einem eigenen `stand`:

```js
function zaehlerErstellen() {
  let stand = 0;
  return () => ++stand;
}

const a = zaehlerErstellen();
const b = zaehlerErstellen();
a();
a();
console.log(a(), b());
```

`a` steht danach bei 3, `b` erst bei 1. Die beiden Zähler wissen nichts voneinander.

## Wozu man das braucht

An `stand` kommt von außen niemand heran. Ändern können ihn nur die Funktionen, die du zurückgibst. So schützt du Daten davor, versehentlich überschrieben zu werden. In Teil 2 lernst du mit `#private` in Klassen einen zweiten Weg kennen, der dasselbe erreicht.
