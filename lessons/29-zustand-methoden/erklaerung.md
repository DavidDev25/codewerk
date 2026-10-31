## Zustand merken, Methoden ausführen

Ein Objekt kann sich Werte merken und sie mit seinen Methoden ändern. Was sich ein Objekt gerade merkt, nennt man seinen **Zustand**.

:::alltag
Denk an einen Klicker-Zähler am Eingang. Er **merkt sich** die Zahl, das ist sein Zustand. Du drückst den Knopf, und die Zahl wird größer. Der Knopf ist eine Methode. Mit dem Rädchen setzt du den Zähler wieder zurück.
:::

Im Beispiel merkt sich eine Lampe, ob sie an ist. Die Methode `umschalten` ändert diesen Zustand:

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

Ausgegeben wird `true`. Die Lampe startet mit `false`. `umschalten` dreht den Wert mit `!` um, also wird aus `false` jetzt `true`.

- Der **Zustand** steht in Eigenschaften wie `this.an`.
- **Methoden** sind Funktionen in der Klasse. Sie dürfen den Zustand ändern.
- Jedes Objekt hat seinen **eigenen** Zustand. Schaltest du eine Lampe um, bleiben alle anderen, wie sie sind.

Ein Parameter kann einen Standardwert haben. `constructor(start = 0)` nimmt `0`, wenn du beim `new` nichts übergibst.

Im **Diagramm** siehst du die Methoden in der Klassen-Box und den Zustand in der Objekt-Box.
