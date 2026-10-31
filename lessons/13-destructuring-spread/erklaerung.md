## Werte auspacken mit Destructuring

Oft brauchst du aus einem Objekt nur ein paar Werte. Statt jedes Mal `nutzer.name` und `nutzer.stadt` zu schreiben, kannst du sie in einem Schritt in eigene Variablen auspacken. Das heißt **Destructuring**.

:::alltag
Ein Paket kommt an. Statt jedes Mal „das Buch aus dem Paket“ zu sagen, packst du aus und legst das Buch direkt auf den Tisch.
:::

## Aus Objekten auspacken

```js
const nutzer = { name: "Mara", alter: 31, stadt: "Nürnberg" };

const { name, stadt } = nutzer;
console.log(name, stadt);
```

Die Ausgabe ist `Mara Nürnberg`. Die Zeile mit den geschweiften Klammern ist eine Kurzform für zwei Zeilen: `const name = nutzer.name;` und `const stadt = nutzer.stadt;`. Die Namen in den Klammern müssen dabei genau zu den Schlüsseln im Objekt passen.

Du kannst beim Auspacken auch umbenennen und einen Standardwert festlegen:

```js
const nutzer = { name: "Mara" };
const { name: vorname, rolle = "Gast" } = nutzer;
console.log(vorname, rolle);
```

Die Ausgabe ist `Mara Gast`. `name: vorname` packt den Namen in eine Variable namens `vorname`. `rolle` gibt es im Objekt nicht, deshalb springt der Standardwert `"Gast"` ein.

## Aus Arrays auspacken

Bei Arrays nimmst du eckige Klammern. Hier zählt nicht der Name, sondern die Position:

```js
const podium = ["Lea", "Tom", "Ben"];
const [gold, silber] = podium;
console.log(gold, silber);
```

Die Ausgabe ist `Lea Tom`. `gold` bekommt den ersten Eintrag, `silber` den zweiten. Ben bleibt einfach übrig.

## Direkt in der Funktion auspacken

Bekommt eine Funktion ein Objekt, kannst du es gleich bei den Eingaben auspacken:

```js
const vorstellen = ({ name, alter }) => `${name} ist ${alter}.`;
console.log(vorstellen({ name: "Ali", alter: 25 }));
```

Die Ausgabe ist `Ali ist 25.` Die geschweiften Klammern in den runden Klammern holen `name` und `alter` direkt aus dem übergebenen Objekt.

## Zusammenbauen mit Spread

In Lektion 12 hast du mit `...` kopiert. Dabei kannst du gleich etwas ändern oder dazunehmen. Steht ein Schlüssel zweimal da, gewinnt der hintere:

```js
const nutzer = { name: "Mara", stadt: "Nürnberg" };
const umgezogen = { ...nutzer, stadt: "Fürth" };
console.log(nutzer.stadt, umgezogen.stadt);

const obst = ["Apfel", "Birne"];
const korb = [...obst, "Kirsche"];
console.log(korb);
```

Die Ausgabe ist `Nürnberg Fürth` und dann `["Apfel", "Birne", "Kirsche"]`. Das Original bleibt jeweils unverändert. Dieses Auspacken mit drei Punkten heißt **Spread**.

## Einsammeln mit Rest

Dieselben drei Punkte gibt es auch in die andere Richtung. Bei den Eingaben einer Funktion sammeln sie alle übrigen Werte in ein Array ein:

```js
function zeigen(erster, ...rest) {
  console.log("Erster:", erster);
  console.log("Rest:", rest);
}

zeigen(1, 2, 3, 4);
```

Die Ausgabe ist `Erster: 1` und `Rest: [2, 3, 4]`. Das Einsammeln heißt **Rest**. So kann eine Funktion beliebig viele Werte bekommen.

Woran du erkennst, was gerade passiert:

| Wo stehen die drei Punkte? | Was passiert? |
| --- | --- |
| in `[…]` oder `{…}` auf der rechten Seite | Spread: auspacken |
| bei den Eingaben einer Funktion | Rest: einsammeln |
