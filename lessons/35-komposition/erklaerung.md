## Ein Objekt besteht aus Teilen

Vererbung passt, wenn etwas ein Sonderfall von etwas anderem ist. Oft besteht ein Objekt aber einfach aus anderen Objekten. Dann steckst du die Teile in das große Objekt hinein. Das nennt man **Komposition**, auf Deutsch „Zusammensetzung“.

:::alltag
Ein Auto **ist kein** Motor. Es **hat** einen Motor, vier Räder und ein Radio. Ist der Motor kaputt, tauschst du ihn aus, und es bleibt dasselbe Auto.
:::

Vererbung beantwortet die Frage „ist ein?“: Ein `Hund` ist ein `Tier`. Komposition beantwortet die Frage „hat ein?“: Ein `Auto` hat einen `Motor`.

Im Beispiel hat ein Schreibtisch eine Lampe. Der Schreibtisch baut die Lampe in seinem `constructor` selbst:

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

Ausgegeben wird `true`. `arbeitenBeginnen` schaltet die Lampe nicht selbst ein. Sie gibt die Aufgabe an die Lampe weiter, indem sie `this.lampe.einschalten()` aufruft.

- Die `Lampe` ist ein **eigenes Objekt** innerhalb des Schreibtischs.
- Der Schreibtisch **gibt Aufgaben weiter** an seine Teile. Fachleute nennen das **delegieren**.
- Im **Diagramm** zeigt ein Pfeil von `tisch` zu `lampe`.

Eine Faustregel: Klingt der Satz „X ist ein Y“ unsinnig, nimm Komposition.
