## Zustand merken, Methoden ausführen

:::alltag
Ein Klicker-Zähler am Eingang: Er **merkt sich** die Zahl (Zustand). Du drückst den Knopf (Methode) und die Zahl wird größer. Mit dem Rädchen setzt du ihn zurück.
:::

```js
class Lampe {
  constructor() {
    this.an = false;
  }

  umschalten() {
    this.an = !this.an;
  }
}

const lampe = new Lampe();
lampe.umschalten();
console.log(lampe.an);
```

- Der **Zustand** steht in Eigenschaften (`this.an`).
- **Methoden** sind Funktionen in der Klasse. Sie dürfen den Zustand ändern.
- Jedes Objekt hat seinen **eigenen** Zustand.

Parameter mit Standardwert: `constructor(start = 0)` nimmt `0`, wenn nichts übergeben wird.

Im **Diagramm** siehst du die Methoden in der Klassen-Box und den Zustand in der Objekt-Box.
