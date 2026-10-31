## Die Kurzschreibweise mit =>

Funktionen kannst du auch kürzer schreiben, mit einem Pfeil `=>`. Man nennt sie **Arrow-Funktionen**. Sie tun dasselbe wie normale Funktionen, nur mit weniger Worten.

:::alltag
Eine normale Funktion ist wie ein ausführliches Rezept mit Überschrift. Eine Arrow-Funktion ist wie ein Notizzettel am Kühlschrank: „Brot → toasten“. Gleiche Arbeit, weniger Worte.
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

Die Ausgabe ist dreimal 8. Was sich bei den Arrow-Funktionen ändert:

- Du speicherst die Funktion in einer Variable, meist mit `const`.
- Die Eingaben stehen in runden Klammern, danach kommt der Pfeil `=>`.
- Steht hinter dem Pfeil nur eine einzige Rechnung, darfst du die geschweiften Klammern und `return` weglassen. Das Ergebnis wird dann automatisch zurückgegeben. So ist es bei `verdoppeln3`.
- Mit geschweiften Klammern brauchst du `return` wieder, wie bei `verdoppeln2`.

## Standardwerte

Eine Eingabe kann einen **Standardwert** bekommen. Er gilt, wenn beim Aufruf nichts übergeben wird:

```js
const gruss = (name = "Gast") => `Hallo ${name}!`;
console.log(gruss("Mara"));
console.log(gruss());
```

Die Ausgabe ist `Hallo Mara!` und dann `Hallo Gast!`. Beim zweiten Aufruf fehlt der Name, deshalb springt der Standardwert ein. Das geht bei normalen Funktionen genauso: `function gruss(name = "Gast") { … }`.

## Funktionen kann man weitergeben

Eine Funktion ist ein Wert, genau wie eine Zahl oder ein Text. Du kannst sie in einer Variable speichern und sogar einer anderen Funktion übergeben:

```js
const laut = (text) => text.toUpperCase() + "!";
const leise = (text) => text.toLowerCase() + "…";

function sagen(text, stil) {
  return stil(text);
}

console.log(sagen("Hallo", laut));
console.log(sagen("Hallo", leise));
```

Die Ausgabe ist `HALLO!` und dann `hallo…`. Die Funktion `sagen` weiß selbst nicht, wie der Text verändert wird. Das entscheidet die Funktion, die du ihr mitgibst. Eine Funktion, die du so übergibst, heißt **Callback**. Dieses Muster brauchst du später ständig, zum Beispiel bei Listen.

Achte dabei auf die Klammern: `laut` ist die Funktion selbst, `laut("x")` ist schon ihr Ergebnis. Übergeben willst du die Funktion, also schreibst du `laut` ohne Klammern.
