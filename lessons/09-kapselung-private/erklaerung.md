## Private Felder schützen den Zustand

:::alltag
Ein Geldautomat: Du kannst Geld einzahlen und abheben. Aber du kannst nicht hinten ins Gehäuse greifen und die Scheine selbst umlegen. Der Automat achtet darauf, dass nichts Unmögliches passiert.
:::

Ein Feld mit `#` ist **privat**:

```js
class Tresor {
  #inhalt = "Gold";

  zeigeInhalt() {
    return this.#inhalt;
  }
}

const tresor = new Tresor();
console.log(tresor.zeigeInhalt());
console.log(tresor.inhalt);
```

- `#inhalt` ist nur **innerhalb** der Klasse sichtbar.
- Von außen ist `tresor.inhalt` einfach `undefined`.
- Zugriff geht nur über Methoden. Dort kannst du **Regeln** prüfen.

Im **Diagramm** erkennst du private Felder am Schloss: Die Box zeigt, dass es sie gibt, aber nicht, was drin ist.
