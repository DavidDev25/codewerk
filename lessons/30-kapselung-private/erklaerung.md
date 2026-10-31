## Private Felder schützen den Zustand

Bisher konnte jeder von außen die Werte eines Objekts ändern. Manchmal soll das nicht gehen. Dann versteckst du den Wert im Objekt und erlaubst Änderungen nur über Methoden.

:::alltag
Denk an einen Geldautomaten. Du kannst Geld einzahlen und abheben. Du kannst aber nicht hinten ins Gehäuse greifen und die Scheine selbst umlegen. Der Automat achtet darauf, dass nichts Unmögliches passiert.
:::

Ein Feld, dessen Name mit `#` beginnt, ist **privat**. Im Beispiel liegt Gold in einem Tresor:

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

Die erste Zeile gibt „Gold“ aus, weil `zeigeInhalt` zur Klasse gehört und `#inhalt` lesen darf. Die zweite Zeile gibt `undefined` aus. Von außen gibt es keine Eigenschaft `inhalt`.

- `#inhalt` ist nur **innerhalb** der Klasse sichtbar.
- Von außen kommst du nur über Methoden an den Wert.
- In diesen Methoden kannst du **Regeln** prüfen, zum Beispiel ob genug Geld da ist.

Im **Diagramm** erkennst du private Felder am Schloss. Die Box zeigt, dass es sie gibt, aber nicht, was drin ist.
