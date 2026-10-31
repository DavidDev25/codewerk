## Auspacken mit Destructuring

:::alltag
Ein Paket kommt an. Statt jedes Mal „das Paket, darin das Buch“ zu sagen, packst du aus und legst das Buch direkt auf den Tisch. **Destructuring** packt Werte aus Objekten und Arrays aus und legt sie in eigene Variablen.
:::

```js
const nutzer = { name: "Mara", alter: 31, stadt: "Nürnberg" };

const { name, stadt } = nutzer;
console.log(name, stadt);
```

Das ist die Kurzform von `const name = nutzer.name; const stadt = nutzer.stadt;`. Die Namen in den geschweiften Klammern müssen zu den Eigenschaften passen.

Du kannst auch umbenennen und Standardwerte setzen:

```js
const nutzer = { name: "Mara" };
const { name: vorname, rolle = "Gast" } = nutzer;
console.log(vorname, rolle);
```

Bei Arrays zählt die **Position**:

```js
const podium = ["Lea", "Tom", "Ben"];
const [gold, silber] = podium;
console.log(gold, silber);
```

## Auspacken direkt im Parameter

Bekommt eine Funktion ein Objekt, kannst du es gleich im Parameter auspacken:

```js
const vorstellen = ({ name, alter }) => `${name} ist ${alter}.`;
console.log(vorstellen({ name: "Ali", alter: 25 }));
```

## Zusammenbauen mit Spread

In Lektion 12 hast du mit `...` kopiert. Dabei kannst du auch gleich etwas ändern oder hinzufügen. Was weiter hinten steht, gewinnt:

```js
const nutzer = { name: "Mara", stadt: "Nürnberg" };
const umgezogen = { ...nutzer, stadt: "Fürth" };
console.log(nutzer.stadt, umgezogen.stadt);

const obst = ["Apfel", "Birne"];
const korb = [...obst, "Kirsche"];
console.log(korb);
```

## Einsammeln mit Rest

Dieselben drei Punkte gibt es auch in die andere Richtung. Im Parameter **sammeln** sie alle übrigen Werte in ein Array:

```js
function zeigen(erster, ...rest) {
  console.log("Erster:", erster);
  console.log("Rest:", rest);
}

zeigen(1, 2, 3, 4);
```

| Wo stehen die `...`? | Was passiert? |
| --- | --- |
| beim Aufruf oder in `[…]`, `{…}` | **Spread**: auspacken |
| im Parameter oder links vom `=` | **Rest**: einsammeln |
