## Objekte werden nicht kopiert, sondern geteilt

:::alltag
Ein Google-Dokument: Du schickst deiner Freundin den **Link**, nicht eine Kopie. Ändert sie etwas, siehst du es auch. Es gibt nur ein Dokument, aber zwei Wege dorthin.
:::

Zahlen und Texte werden **kopiert**:

```js
let a = 5;
let b = a;
b = 99;
console.log(a, b);
```

Objekte und Arrays werden **geteilt** (Referenz):

```js
const x = { punkte: 1 };
const y = x;
y.punkte = 99;
console.log(x.punkte);
```

Schau ins **Diagramm**: `x` und `y` zeigen mit zwei Pfeilen auf **dieselbe** Box.

Eine echte Kopie gibt es mit dem Spread-Operator `...`:

```js
const original = { punkte: 1 };
const kopie = { ...original };
kopie.punkte = 99;
console.log(original.punkte);
```

Bei Arrays geht das genauso: `const kopie = [...liste];`

Auch bei Funktionen gilt das: Wer ein Objekt übergibt, gibt den **Link** weiter.
