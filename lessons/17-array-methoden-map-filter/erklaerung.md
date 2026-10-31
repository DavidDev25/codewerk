## Ganze Listen auf einmal bearbeiten

Bisher hast du Listen mit einer `for`-Schleife durchlaufen. Arrays bringen dafür auch eigene Werkzeuge mit. Jedes Werkzeug bekommt eine kleine Funktion. Diese Funktion wird für **jedes Element** einmal aufgerufen.

:::alltag
Stell dir ein Fließband mit Äpfeln vor. Bei **map** wird jeder Apfel geschält. Am Ende liegen genauso viele Äpfel auf dem Band, nur eben geschält. Bei **filter** bleiben nur die roten Äpfel liegen. Bei **reduce** kommen alle Äpfel auf eine Waage, und heraus kommt **eine** Zahl. Bei **find** nimmst du den ersten Apfel, der dir gefällt.
:::

Das folgende Beispiel benutzt alle vier Werkzeuge mit derselben Liste:

```js
const zahlen = [1, 2, 3, 4];

const doppelt = zahlen.map((z) => z * 2);
const gerade = zahlen.filter((z) => z % 2 === 0);
const summe = zahlen.reduce((bisher, z) => bisher + z, 0);
const ersteGrosse = zahlen.find((z) => z > 2);

console.log(doppelt, gerade, summe, ersteGrosse);
```

Ausgegeben werden `[2, 4, 6, 8]`, `[2, 4]`, `10` und `3`:

- `map` hat jede Zahl verdoppelt. Die neue Liste ist genauso lang wie die alte.
- `filter` hat nur die geraden Zahlen behalten, weil nur bei ihnen `z % 2 === 0` stimmt.
- `reduce` hat alle Zahlen zusammengezählt. `bisher` beginnt beim Startwert `0` und wächst mit jedem Element: 0 + 1 + 2 + 3 + 4 ergibt 10.
- `find` hat die `3` gefunden, weil sie die erste Zahl größer als 2 ist. Die `4` schaut sich `find` danach gar nicht mehr an.

| Methode | Ergebnis |
| --- | --- |
| `map` | neue Liste, gleich lang, jedes Element umgewandelt |
| `filter` | neue Liste mit den Elementen, für die die Funktion `true` ergibt |
| `reduce` | **ein** einzelner Wert, der beim Startwert beginnt |
| `find` | das **erste** passende Element oder `undefined`, wenn keins passt |

Die Liste `zahlen` selbst bleibt dabei unverändert. Jedes Werkzeug liefert ein neues Ergebnis.

## Mehrere Werkzeuge hintereinander

Weil `filter` wieder eine Liste liefert, kannst du direkt das nächste Werkzeug anhängen. Hier suchst du zuerst alle Hunde heraus und nimmst dann nur ihre Namen:

```js
const tiere = [
  { name: "Bello", art: "Hund" },
  { name: "Mimi", art: "Katze" },
  { name: "Rex", art: "Hund" },
];

const hundeNamen = tiere.filter((t) => t.art === "Hund").map((t) => t.name);
console.log(hundeNamen);
```

Heraus kommt `["Bello", "Rex"]`. `filter` lässt die beiden Hunde übrig, und `map` macht aus jedem Tier seinen Namen. Du liest so eine Kette von links nach rechts, wie eine Anleitung.
