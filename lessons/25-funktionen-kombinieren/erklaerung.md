## Funktionen als Bausteine

Du weißt schon: Funktionen sind Werte (Lektion 8) und können sich mit Closures Dinge merken (Lektion 16). Daraus entstehen drei Techniken, die Profis ständig nutzen.

## Currying: ein Wert nach dem anderen

Eine **gecurryte** Funktion nimmt ihre Werte nicht auf einmal, sondern einzeln, und gibt dazwischen jeweils eine neue Funktion zurück:

```js
const multipliziere = (a) => (b) => a * b;

const verdoppeln = multipliziere(2);
const verdreifachen = multipliziere(3);
console.log(verdoppeln(5), verdreifachen(5), multipliziere(4)(10));
```

So baust du aus einer allgemeinen Funktion schnell spezielle Helfer. `verdoppeln` „merkt“ sich die 2 in einer Closure.

## Komposition: Funktionen hintereinanderschalten

:::alltag
Ein Fließband in der Bäckerei: Teig kneten → formen → backen → verpacken. Jede Station macht eine Sache und gibt das Ergebnis an die nächste weiter.
:::

`pipe` verbindet mehrere Funktionen zu einer. Das Ergebnis der einen wird zur Eingabe der nächsten:

```js
function pipe(...funktionen) {
  return (wert) => funktionen.reduce((bisher, fn) => fn(bisher), wert);
}

const aufraeumen = pipe(
  (text) => text.trim(),
  (text) => text.toLowerCase(),
  (text) => text.replaceAll(" ", "-"),
);

console.log(aufraeumen("  Hallo Schöne Welt "));
```

Jede Funktion bleibt klein und einzeln testbar. Neue Schritte steckst du einfach dazu.

## Memoization: einmal rechnen, dann merken

Manche Berechnungen sind teuer und werden mit denselben Werten immer wieder aufgerufen. **Memoization** merkt sich Ergebnisse in einer Map:

```js
function merken(fn) {
  const speicher = new Map();
  return (wert) => {
    if (speicher.has(wert)) {
      return speicher.get(wert);
    }
    const ergebnis = fn(wert);
    speicher.set(wert, ergebnis);
    return ergebnis;
  };
}

let aufrufe = 0;
const langsamQuadrat = (x) => { aufrufe++; return x * x; };
const schnell = merken(langsamQuadrat);
schnell(9);
schnell(9);
schnell(9);
console.log(aufrufe);
```

Besonders stark ist das bei Rekursion (Lektion 24). Die einfache Fibonacci-Funktion rechnet dieselben Werte millionenfach neu aus. Mit `merken` wird jede Zahl nur **einmal** berechnet.

Memoization lohnt sich nur bei **reinen** Funktionen: gleiche Eingabe, immer gleiches Ergebnis, keine Nebenwirkungen.
