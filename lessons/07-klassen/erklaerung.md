## Eine Klasse ist ein Bauplan

:::alltag
Ein Plätzchen-Ausstecher: Die **Form** ist die Klasse. Jedes ausgestochene Plätzchen ist ein eigenes **Objekt**. Alle haben dieselbe Form, aber jedes kann anders verziert sein.
:::

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

- `class Katze` ist der Bauplan.
- `constructor` läuft automatisch bei jedem `new`.
- `this` ist das neue Objekt, das gerade entsteht.
- `new Katze(…)` baut ein Objekt aus dem Bauplan.

Im **Diagramm** hängen `minka` und `felix` an der Klasse `Katze`. Beide haben dieselben Eigenschaften, aber eigene Werte.
