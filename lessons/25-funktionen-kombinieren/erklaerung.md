## Funktionen als Bausteine

Zwei Dinge weißt du schon über Funktionen. Aus Lektion 8 weißt du, dass man sie wie Werte speichern und weitergeben kann. Aus Lektion 16 weißt du, dass sie sich Werte merken können. Aus diesen beiden Dingen entstehen drei Techniken, die erfahrene Entwickler ständig benutzen.

## Werte einzeln übergeben

Eine Funktion kann ihre Werte auch einzeln nehmen statt alle auf einmal. Nach jedem Wert gibt sie eine neue Funktion zurück, die auf den nächsten wartet. Das nennt man **Currying**.

```js
const multipliziere = (a) => (b) => a * b;

const verdoppeln = multipliziere(2);
const verdreifachen = multipliziere(3);
console.log(verdoppeln(5), verdreifachen(5), multipliziere(4)(10));
```

`multipliziere(2)` rechnet noch nichts. Es liefert eine neue Funktion, die sich die 2 merkt. Diese Funktion speicherst du als `verdoppeln`. Ausgegeben werden 10, 15 und 40. Bei `multipliziere(4)(10)` passiert beides direkt hintereinander: erst kommt die 4, dann die 10.

So baust du aus einer allgemeinen Funktion schnell kleine Helfer für einen bestimmten Zweck.

## Funktionen hintereinanderschalten

:::alltag
Denk an ein Fließband in der Bäckerei. Erst wird der Teig geknetet, dann geformt, dann gebacken und zum Schluss verpackt. Jede Station macht eine Sache und gibt das Ergebnis an die nächste weiter.
:::

Die Funktion `pipe` baut so ein Fließband. Sie bekommt mehrere Funktionen und verbindet sie zu einer einzigen. Was die erste Funktion zurückgibt, bekommt die zweite, und so weiter. Diese Technik heißt **Komposition**.

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

Heraus kommt „hallo-schöne-welt“. Zuerst schneidet `trim` die Leerzeichen am Rand ab. Dann macht `toLowerCase` alles klein. Zum Schluss ersetzt `replaceAll` die Leerzeichen durch Bindestriche.

Innen benutzt `pipe` die Methode `reduce`. Der Startwert ist der Text. Jede Funktion bekommt das bisherige Ergebnis und liefert das nächste.

Jede Station bleibt klein und lässt sich einzeln testen. Brauchst du einen weiteren Schritt, schreibst du einfach eine Funktion dazu.

## Einmal rechnen, dann merken

Manche Berechnungen dauern lange und werden trotzdem immer wieder mit denselben Werten aufgerufen. Dann lohnt es sich, jedes Ergebnis in einer Map zu speichern. Beim nächsten Mal holst du es von dort, statt neu zu rechnen. Das nennt man **Memoization**.

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

Ausgegeben wird 1. `schnell` wurde dreimal mit 9 aufgerufen, aber `langsamQuadrat` hat nur einmal gerechnet. Beim zweiten und dritten Mal stand das Ergebnis schon in `speicher`, und `merken` hat es von dort geholt.

Besonders viel bringt das bei Funktionen, die sich selbst aufrufen, wie in Lektion 24. Eine einfache Fibonacci-Funktion rechnet dieselben Zahlen millionenfach neu aus. Mit `merken` wird jede Zahl nur **einmal** berechnet.

Wichtig: Merken klappt nur bei Funktionen, die bei gleicher Eingabe immer dasselbe Ergebnis liefern und sonst nichts verändern. Solche Funktionen nennt man **rein**.
