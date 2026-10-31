## Werte auf Abruf

Ein Array hält alle Werte gleichzeitig im Speicher. Ein **Generator** erzeugt seine Werte erst, wenn jemand danach fragt, einen nach dem anderen.

:::alltag
Denk an einen Kaugummiautomaten. Er wirft nicht alle Kaugummis auf einmal aus. Jedes Mal, wenn du drehst, kommt **genau einer** heraus. Dazwischen wartet der Automat. Ein Generator funktioniert genauso: Bei jedem `yield` gibt er einen Wert heraus und macht Pause.
:::

Im Beispiel liefert ein Generator die vier Farben einer Ampel:

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

Ausgegeben werden „rot“, „rot-gelb“, „grün“ und „gelb“. Die Schleife holt sich einen Wert nach dem anderen ab.

- `function*` mit Stern macht eine Funktion zum Generator.
- `yield wert` gibt einen Wert heraus und hält die Funktion an. Beim nächsten Abruf geht es direkt dahinter weiter.
- Mit `for…of` oder `[...gen]` holst du alle Werte ab.

## Von Hand drehen mit next()

Hinter den Kulissen ruft `for…of` immer wieder `next()` auf. Das kannst du auch selbst machen:

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

Die ersten drei Aufrufe liefern `{ value: 4, done: false }`, dann 1 und dann 6. Der vierte liefert `{ value: undefined, done: true }`. Der Generator ist leer.

Jedes `next()` liefert also ein Objekt mit `value` und `done`. Ist `done` gleich `true`, kommt nichts mehr. Ein Objekt mit so einer `next`-Methode heißt **Iterator**.

## Unendliche Folgen

Weil nur auf Abruf gerechnet wird, darf ein Generator sogar **endlos** laufen. Du nimmst dir einfach so viele Werte, wie du brauchst. Im Beispiel entstehen fortlaufende Nummern:

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

Ausgegeben werden „ID-1“ und „ID-2“. Die Schleife `while (true)` läuft nie zu Ende. Trotzdem hängt das Programm nicht, weil der Generator bei jedem `yield` anhält und erst beim nächsten `next()` weitermacht.

Mit `[...ids()]` würdest du allerdings für immer warten. Begrenze unendliche Generatoren deshalb immer mit `break` oder einzelnen `next()`-Aufrufen.

## Eigene Objekte durchlaufbar machen

`for…of` funktioniert mit allem, was eine Methode mit dem besonderen Namen `Symbol.iterator` hat. Arrays, Texte, Maps und Sets haben sie schon. Deinen eigenen Objekten gibst du sie mit einem Generator:

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

Die Schleife gibt „♪ Intro“, „♪ Sommer“ und „♪ Outro“ aus. Die letzte Zeile sammelt dieselben drei Werte in einer Liste. Der Stern vor `[Symbol.iterator]` macht die Methode zu einem Generator.
