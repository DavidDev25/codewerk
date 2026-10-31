## Warum das Original nicht ändern?

In Lektion 12 hast du gesehen: Zwei Variablen können auf **dasselbe** Objekt zeigen. Ändert eine Stelle das Objekt, ändert es sich überall. Viele schwer findbare Fehler entstehen genau so.

:::alltag
Ein Vertrag: Du schreibst nicht im Original herum, sondern machst eine Kopie und änderst die. Das Original bleibt als sichere Fassung liegen, und jeder kann sehen, was sich geändert hat.
:::

Moderne Programme (und später auch React) arbeiten deshalb gern **unveränderlich**: Statt Daten zu ändern, erzeugen sie eine geänderte Kopie.

## Arrays ändern, ohne sie anzufassen

In Lektion 18 musstest du vor `sort` eine Kopie anlegen. Seit 2023 gibt es Methoden, die das selbst erledigen:

```js
const zahlen = [3, 1, 2];

console.log(zahlen.toSorted((a, b) => a - b));
console.log(zahlen.toReversed());
console.log(zahlen.with(0, 10));
console.log(zahlen.toSpliced(1, 1));
console.log(zahlen);
```

| verändert das Original | liefert eine Kopie |
| --- | --- |
| `sort` | `toSorted` |
| `reverse` | `toReversed` |
| `splice` | `toSpliced` |
| `liste[0] = x` | `liste.with(0, x)` |

## Objekte unveränderlich machen

`Object.freeze` friert ein Objekt ein. Änderungen sind danach verboten:

```js
const einstellungen = Object.freeze({ thema: "hell" });
try {
  einstellungen.thema = "dunkel";
} catch (fehler) {
  console.log("Nicht erlaubt:", fehler.message);
}
console.log(einstellungen.thema, Object.isFrozen(einstellungen));
```

Achtung: `freeze` wirkt nur auf die **oberste Ebene**. Ein Objekt darin bleibt veränderbar.

## Flache und tiefe Kopien

Der Spread-Operator `{ ...obj }` kopiert ebenfalls nur die oberste Ebene. Verschachtelte Objekte werden geteilt:

```js
const kurs = { titel: "JS", ort: { stadt: "Nürnberg" } };

const flach = { ...kurs };
flach.ort.stadt = "Fürth";
console.log(kurs.ort.stadt);

const kurs2 = { titel: "JS", ort: { stadt: "Nürnberg" } };
const tief = structuredClone(kurs2);
tief.ort.stadt = "Fürth";
console.log(kurs2.ort.stadt);
```

`structuredClone` kopiert **alle Ebenen**. Funktionen kann es allerdings nicht kopieren.

## Das typische Muster

Eine Funktion, die Daten „ändert“, gibt eine neue Fassung zurück:

```js
function umbenennen(person, neuerName) {
  return { ...person, name: neuerName };
}

const alt = { name: "Lea", alter: 30 };
const neu = umbenennen(alt, "Mia");
console.log(alt.name, neu.name);
```
