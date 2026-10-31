## Ein Objekt ist eine Karteikarte

Ein Array ist eine Liste, in der jeder Wert eine Nummer hat. Manchmal willst du Werte aber lieber mit einem Namen ansprechen: den Namen einer Katze, ihr Alter, ihre Farbe. Dafür gibt es **Objekte**.

:::alltag
Denk an eine Karteikarte in der Bibliothek. Oben steht der Titel, darunter der Autor, das Jahr und der Standort. Jede Zeile hat eine Überschrift und einen Eintrag. Bei einem Objekt heißt die Überschrift **Schlüssel**, der Eintrag heißt **Wert**.
:::

## Ein Objekt anlegen und lesen

Ein Objekt schreibst du in geschweiften Klammern. Jede Zeile besteht aus Schlüssel, Doppelpunkt und Wert:

```js
const katze = {
  name: "Minka",
  alter: 3,
  gestreift: true,
};

console.log(katze.name);
console.log(katze.alter);
```

Die Ausgabe ist `Minka` und dann 3. Einen Wert liest du mit einem Punkt: `katze.name` heißt „der Name von katze“.

## Werte ändern und hinzufügen

Mit dem Punkt kannst du auch einen Wert ändern oder einen ganz neuen Schlüssel anlegen:

```js
const katze = { name: "Minka", alter: 3 };
katze.alter = 4;
katze.farbe = "grau";
console.log(katze);
```

Die Ausgabe ist `{ name: "Minka", alter: 4, farbe: "grau" }`. Das Alter wurde geändert, die Farbe ist neu dazugekommen. Wie bei Arrays darfst du den Inhalt ändern, auch wenn die Variable mit `const` angelegt ist.

## Objekte in Objekten

Ein Wert in einem Objekt kann selbst ein Array oder ein weiteres Objekt sein:

```js
const wohnung = {
  ort: "Nürnberg",
  zimmer: ["Küche", "Bad"],
  vermieter: { name: "Herr Weber" },
};
console.log(wohnung.vermieter.name);
console.log(wohnung.zimmer[1]);
```

Die Ausgabe ist `Herr Weber` und `Bad`. Du hangelst dich mit Punkten und eckigen Klammern Schritt für Schritt nach innen.

Schau nach dem Ausführen ins **Diagramm**. Ein Objekt in einem Objekt ist dort eine eigene Box, und ein Pfeil zeigt dorthin.
