## Ein Objekt ist eine Karteikarte

:::alltag
Eine Karteikarte in der Bibliothek: Oben steht der Titel, darunter der Autor, das Jahr, der Standort. Jede Zeile hat eine **Überschrift** (Schlüssel) und einen **Eintrag** (Wert).
:::

```js
const katze = {
  name: "Minka",
  alter: 3,
  gestreift: true,
};

console.log(katze.name);
```

- Lesen: `katze.name`
- Ändern: `katze.alter = 4;`
- Neu anlegen: `katze.farbe = "grau";`

Ein Objekt kann auch andere Objekte und Arrays enthalten:

```js
const wohnung = {
  ort: "Nürnberg",
  zimmer: ["Küche", "Bad"],
  vermieter: { name: "Herr Weber" },
};
console.log(wohnung.vermieter.name);
```

Im **Diagramm** siehst du: Ein Objekt in einem Objekt ist eine Box mit einem Pfeil zur nächsten Box.
