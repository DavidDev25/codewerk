## Objekte werden nicht kopiert, sondern geteilt

Hier wartet eine der wichtigsten Überraschungen in JavaScript. Zahlen und Texte verhalten sich anders als Objekte und Arrays, wenn du sie einer zweiten Variable gibst.

:::alltag
Denk an ein geteiltes Online-Dokument. Du schickst deiner Freundin den Link, keine Kopie. Ändert sie etwas, siehst du es auch. Es gibt nur ein Dokument, aber zwei Wege dorthin.
:::

## Zahlen und Texte werden kopiert

```js
let a = 5;
let b = a;
b = 99;
console.log(a, b);
```

Die Ausgabe ist `5 99`. `b` hat eine eigene Kopie der 5 bekommen. Ändert sich `b`, bleibt `a` davon unberührt.

## Objekte und Arrays werden geteilt

Bei Objekten ist das anders:

```js
const x = { punkte: 1 };
const y = x;
y.punkte = 99;
console.log(x.punkte);
```

Die Ausgabe ist 99, obwohl nur `y` geändert wurde. Der Grund: `const y = x;` macht keine Kopie. `y` ist nur ein zweiter Name für dasselbe Objekt. Man sagt auch: `x` und `y` sind **Referenzen** auf dasselbe Objekt.

Schau nach dem Ausführen ins **Diagramm**. Dort zeigen `x` und `y` mit zwei Pfeilen auf dieselbe Box.

## Eine echte Kopie machen

Eine echte Kopie bekommst du mit drei Punkten `...`. Sie packen alle Werte aus dem alten Objekt in ein neues:

```js
const original = { punkte: 1 };
const kopie = { ...original };
kopie.punkte = 99;
console.log(original.punkte);
```

Die Ausgabe ist 1. Jetzt sind es zwei getrennte Objekte, und das Original bleibt unverändert.

Bei Arrays geht das genauso: `const kopie = [...liste];`

## Auch Funktionen bekommen nur den Link

Gibst du ein Objekt an eine Funktion, bekommt die Funktion keine Kopie, sondern den Link. Ändert die Funktion das Objekt, ist es danach auch draußen verändert:

```js
function umbenennen(person) {
  person.name = "Neu";
}

const mara = { name: "Mara" };
umbenennen(mara);
console.log(mara.name);
```

Die Ausgabe ist `Neu`. Manchmal ist das genau gewollt. Oft ist es aber eine Fehlerquelle. Dann machst du in der Funktion zuerst eine Kopie und änderst nur die.
