## Getter lesen, Setter prüfen

:::alltag
Ein Thermostat an der Heizung: Du **liest** die Temperatur ab (Getter). Du **stellst** sie mit dem Rädchen ein (Setter). Das Rädchen lässt sich nicht auf −500 Grad drehen, denn der Hersteller hat eine Grenze eingebaut.
:::

```js
class Pflanze {
  #hoehe = 10;

  get hoehe() {
    return this.#hoehe;
  }

  set hoehe(wert) {
    if (wert < 0) {
      throw new Error("Eine Pflanze kann nicht negativ hoch sein");
    }
    this.#hoehe = wert;
  }
}

const p = new Pflanze();
p.hoehe = 25;
console.log(p.hoehe);
```

- Von außen sieht es aus wie eine normale Eigenschaft: `p.hoehe`.
- Dahinter läuft aber Code. Der Setter kann **prüfen**.
- Ein Getter ohne Setter ist **nur lesbar**.
- Ein Getter kann auch etwas **berechnen**.

Im **Diagramm** stehen Getter und Setter in der Klassen-Box mit „(lesen)“ oder „(lesen/setzen)“.
