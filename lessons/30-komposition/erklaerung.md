## Komposition: Ein Auto hat einen Motor

:::alltag
Ein Auto **ist kein** Motor. Es **hat** einen Motor, vier Räder und ein Radio. Wenn der Motor kaputt ist, tauschst du ihn aus, und das Auto bleibt dasselbe.
:::

Vererbung sagt: **ist ein** (`Hund` ist ein `Tier`).
Komposition sagt: **hat ein** (`Auto` hat einen `Motor`).

```js
class Lampe {
  #an = false;

  einschalten() {
    this.#an = true;
  }

  get an() {
    return this.#an;
  }
}

class Schreibtisch {
  constructor() {
    this.lampe = new Lampe();
  }

  arbeitenBeginnen() {
    this.lampe.einschalten();
    return "Es ist hell genug zum Arbeiten.";
  }
}

const tisch = new Schreibtisch();
tisch.arbeitenBeginnen();
console.log(tisch.lampe.an);
```

- Das Teil (`Lampe`) ist ein **eigenes Objekt** innerhalb des großen.
- Das große Objekt **delegiert**: Es gibt Aufgaben an das Teil weiter.
- Im **Diagramm** zeigt ein Pfeil von `tisch` zu `lampe`.

Faustregel: Wenn du „ist ein“ nicht sinnvoll sagen kannst, nimm Komposition.
