## Die Kurzschreibweise mit =>

:::alltag
Eine normale Funktion ist wie ein ausführliches Rezept mit Überschrift. Eine **Arrow-Funktion** ist wie ein Notizzettel am Kühlschrank: „Brot → toasten“. Gleiche Arbeit, weniger Worte.
:::

Diese drei Funktionen machen genau dasselbe:

```js
function verdoppeln1(zahl) {
  return zahl * 2;
}

const verdoppeln2 = (zahl) => {
  return zahl * 2;
};

const verdoppeln3 = (zahl) => zahl * 2;

console.log(verdoppeln1(4), verdoppeln2(4), verdoppeln3(4));
```

- Eine Arrow-Funktion speicherst du in einer Variable, meist mit `const`.
- Besteht sie nur aus **einem Ausdruck**, kannst du die geschweiften Klammern und `return` weglassen. Das Ergebnis wird automatisch zurückgegeben.
- Mit geschweiften Klammern brauchst du `return` wieder.

## Standardwerte

Ein Parameter kann einen **Standardwert** bekommen. Er gilt, wenn beim Aufruf nichts übergeben wird:

```js
const gruss = (name = "Gast") => `Hallo ${name}!`;
console.log(gruss("Mara"));
console.log(gruss());
```

Das geht genauso bei normalen Funktionen: `function gruss(name = "Gast") { … }`

## Funktionen sind Werte

Eine Funktion ist ein Wert wie eine Zahl oder ein Text. Du kannst sie in Variablen speichern und **an andere Funktionen übergeben**:

```js
const laut = (text) => text.toUpperCase() + "!";
const leise = (text) => text.toLowerCase() + "…";

function sagen(text, stil) {
  return stil(text);
}

console.log(sagen("Hallo", laut));
console.log(sagen("Hallo", leise));
```

`sagen` weiß nicht, **wie** der Text verändert wird. Das entscheidet die Funktion, die du mitgibst. Eine übergebene Funktion heißt **Callback**. Dieses Muster brauchst du später ständig, zum Beispiel bei den Array-Methoden.

Achte auf den Unterschied: `laut` ist die Funktion selbst, `laut("x")` ist ihr **Ergebnis**. Übergeben wird die Funktion, also ohne Klammern.
