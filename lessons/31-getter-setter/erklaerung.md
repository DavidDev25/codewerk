## Getter lesen, Setter prüfen

Ein privates Feld ist gut geschützt. Trotzdem möchtest du es oft so bequem benutzen wie eine normale Eigenschaft, also mit `p.hoehe` statt mit `p.gibHoehe()`. Dafür gibt es **Getter** zum Lesen und **Setter** zum Ändern.

:::alltag
Denk an das Thermostat an der Heizung. Du **liest** die Temperatur ab, das ist der Getter. Du **stellst** sie mit dem Rädchen ein, das ist der Setter. Auf minus 500 Grad lässt sich das Rädchen nicht drehen, denn der Hersteller hat eine Grenze eingebaut.
:::

Im Beispiel hat eine Pflanze eine private Höhe. Getter und Setter tragen beide den Namen `hoehe`:

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

Ausgegeben wird 25. `p.hoehe = 25` sieht aus wie eine normale Zuweisung. In Wahrheit läuft der Setter. Er prüft den Wert und speichert ihn dann in `#hoehe`. `p.hoehe` ohne Zuweisung ruft den Getter auf, und der gibt den Wert zurück.

- Von außen sieht es aus wie eine normale Eigenschaft.
- Dahinter läuft aber Code. Der Setter kann Werte **prüfen** und falsche ablehnen.
- Gibt es nur einen Getter und keinen Setter, kann man den Wert **nur lesen**.
- Ein Getter kann auch etwas **ausrechnen**, statt nur einen gespeicherten Wert zurückzugeben.

Im **Diagramm** stehen Getter und Setter in der Klassen-Box mit „(lesen)“ oder „(lesen/setzen)“.
