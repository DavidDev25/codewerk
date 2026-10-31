## Wo gilt eine Variable?

:::alltag
In einer Wohnung hat jedes Zimmer eigene Dinge. Aus der Küche siehst du den Flur, aber nicht in das abgeschlossene Bad. Variablen funktionieren genauso: Jeder Block `{ … }` ist ein Zimmer. Von innen siehst du nach außen, von außen nicht nach innen.
:::

```js
const haus = "außen";

function zimmer() {
  const moebel = "innen";
  console.log(haus, moebel);
}

zimmer();
console.log(typeof moebel);
```

- Eine Variable gilt in dem Block, in dem sie mit `let` oder `const` angelegt wurde, und in allen Blöcken darin. Diesen Bereich nennt man **Scope**.
- `moebel` gibt es außerhalb von `zimmer` nicht.

Das gilt für jeden Block, auch für `if` und Schleifen:

```js
if (true) {
  const geheim = 42;
}
console.log(typeof geheim);
```

## Funktionen merken sich ihre Umgebung

Jetzt wird es spannend. Eine Funktion kann eine **andere Funktion zurückgeben**. Die innere Funktion nimmt die Variablen ihrer Umgebung mit:

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

`zaehlerErstellen` ist längst fertig, trotzdem kennt die zurückgegebene Funktion `stand` noch und zählt weiter. Eine Funktion samt der Variablen, die sie sich gemerkt hat, heißt **Closure**.

:::alltag
Wie ein Rucksack: Die innere Funktion packt beim Entstehen die Variablen ein, die sie braucht, und trägt sie überallhin mit.
:::

## Jeder Aufruf bekommt einen eigenen Rucksack

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

## Wozu das gut ist

Von außen kommt niemand an `stand` heran. Nur die Funktionen, die du zurückgibst, können ihn ändern. So schützt du Daten vor versehentlichen Änderungen. Später lernst du mit `#private` in Klassen eine zweite Art kennen, dasselbe zu erreichen.
