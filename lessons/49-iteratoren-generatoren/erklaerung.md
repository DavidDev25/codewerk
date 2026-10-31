## Werte auf Abruf

Ein Array hält alle Werte gleichzeitig im Speicher. Ein **Generator** erzeugt seine Werte erst, wenn jemand danach fragt, einen nach dem anderen.

:::alltag
Ein Kaugummiautomat: Er druckt nicht alle Kaugummis auf einmal aus. Jedes Mal, wenn du drehst, kommt **genau einer** heraus. Dazwischen wartet der Automat. Ein Generator funktioniert genauso: Bei jedem `yield` gibt er einen Wert heraus und pausiert.
:::

```js
function* ampel() {
  yield "rot";
  yield "rot-gelb";
  yield "grün";
  yield "gelb";
}

for (const farbe of ampel()) {
  console.log(farbe);
}
```

- `function*` (mit Stern) macht eine Funktion zum Generator.
- `yield wert` gibt einen Wert heraus und hält die Funktion an. Beim nächsten Abruf geht es direkt dahinter weiter.
- Mit `for…of` oder `[...gen]` holst du alle Werte ab.

## Von Hand drehen mit next()

Unter der Haube ruft `for…of` immer wieder `next()` auf:

```js
function* dreiWuerfe() {
  yield 4;
  yield 1;
  yield 6;
}

const wuerfe = dreiWuerfe();
console.log(wuerfe.next());
console.log(wuerfe.next());
console.log(wuerfe.next());
console.log(wuerfe.next());
```

Jedes `next()` liefert `{ value, done }`. Ist `done` `true`, ist der Generator leer. Ein Objekt mit so einer `next`-Methode heißt **Iterator**.

## Unendliche Folgen

Weil nur auf Abruf gerechnet wird, darf ein Generator sogar **endlos** laufen. Du nimmst dir einfach so viele Werte, wie du brauchst:

```js
function* ids() {
  let id = 1;
  while (true) {
    yield `ID-${id}`;
    id++;
  }
}

const neueId = ids();
console.log(neueId.next().value);
console.log(neueId.next().value);
```

Mit `[...ids()]` würdest du allerdings für immer warten. Bei unendlichen Generatoren immer mit `break` oder `next()` begrenzen.

## Eigene Objekte durchlaufbar machen

`for…of` funktioniert mit allem, was eine Methode unter dem besonderen Namen `Symbol.iterator` hat. Arrays, Texte, Maps und Sets haben sie schon. Deinen eigenen Objekten gibst du sie mit einem Generator:

```js
const playlist = {
  titel: ["Intro", "Sommer", "Outro"],
  *[Symbol.iterator]() {
    for (const lied of this.titel) {
      yield `♪ ${lied}`;
    }
  },
};

for (const lied of playlist) {
  console.log(lied);
}
console.log([...playlist]);
```
