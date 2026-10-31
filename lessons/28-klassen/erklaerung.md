## Eine Klasse ist ein Bauplan

Oft brauchst du viele Objekte mit demselben Aufbau, zum Beispiel viele Katzen, die alle einen Namen und eine Farbe haben. Statt jedes Objekt einzeln zu schreiben, legst du einmal einen Bauplan fest. So ein Bauplan heißt **Klasse**.

:::alltag
Denk an einen Plätzchen-Ausstecher. Die **Form** ist die Klasse. Jedes ausgestochene Plätzchen ist ein eigenes **Objekt**. Alle haben dieselbe Form, aber jedes kann anders verziert sein.
:::

Im Beispiel baust du mit dem Bauplan `Katze` zwei verschiedene Katzen:

```js
class Katze {
  constructor(name, farbe) {
    this.name = name;
    this.farbe = farbe;
  }
}

const minka = new Katze("Minka", "grau");
const felix = new Katze("Felix", "schwarz");
console.log(minka.name, felix.name);
```

Ausgegeben wird „Minka Felix“. Beide Objekte stammen aus demselben Bauplan, haben aber eigene Werte. So hängen die Teile zusammen:

- `class Katze` ist der Bauplan.
- `new Katze(…)` baut aus dem Bauplan ein neues Objekt.
- `constructor` läuft bei jedem `new` von selbst. Er bekommt die Werte aus der Klammer.
- `this` ist im `constructor` das neue Objekt, das gerade entsteht. Mit `this.name = name` speicherst du den Namen darin.

Im **Diagramm** hängen `minka` und `felix` an der Klasse `Katze`. Beide haben dieselben Eigenschaften, aber eigene Werte.
