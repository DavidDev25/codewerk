## Arbeiten mit ganzen Listen

Statt jede Liste mit einer `for`-Schleife zu durchlaufen, haben Arrays eingebaute Werkzeuge. Jedes Werkzeug bekommt eine kleine Funktion, die für **jedes Element** aufgerufen wird.

:::alltag
Stell dir ein Fließband vor, auf dem Äpfel liegen. **map**: Jeder Apfel wird geschält – heraus kommen gleich viele geschälte Äpfel. **filter**: Nur die roten Äpfel bleiben auf dem Band. **reduce**: Alle Äpfel kommen auf eine Waage – heraus kommt **eine** Zahl. **find**: Du nimmst den ersten Apfel, der dir gefällt.
:::

```js
const zahlen = [1, 2, 3, 4];

const doppelt = zahlen.map((z) => z * 2);
const gerade = zahlen.filter((z) => z % 2 === 0);
const summe = zahlen.reduce((bisher, z) => bisher + z, 0);
const ersteGrosse = zahlen.find((z) => z > 2);

console.log(doppelt, gerade, summe, ersteGrosse);
```

| Methode | Ergebnis |
| --- | --- |
| `map` | neues Array, gleich lang, jedes Element umgewandelt |
| `filter` | neues Array mit den Elementen, für die die Funktion `true` ergibt |
| `reduce` | **ein** Wert; `bisher` startet beim Startwert (hier `0`) |
| `find` | das **erste** passende Element – oder `undefined` |

Das ursprüngliche Array bleibt unverändert.

## Methoden verketten

Weil `filter` ein neues Array liefert, kannst du direkt weitermachen:

```js
const tiere = [
  { name: "Bello", art: "Hund" },
  { name: "Mimi", art: "Katze" },
  { name: "Rex", art: "Hund" },
];

const hundeNamen = tiere.filter((t) => t.art === "Hund").map((t) => t.name);
console.log(hundeNamen);
```
