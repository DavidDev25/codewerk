## super: Zuerst die Eltern fragen

:::alltag
Ein Rezept, das sagt: „Bereite den Grundteig zu wie immer, dann gib zusätzlich Schokolade hinein.“ Du machst nicht alles neu, du **baust auf dem Grundrezept auf**.
:::

Die Kindklasse will eigene Daten? Dann braucht sie einen eigenen `constructor`. Der muss **zuerst** `super(…)` aufrufen:

```js
class Tier {
  constructor(name) {
    this.name = name;
  }
  beschreibung() {
    return this.name + " ist ein Tier.";
  }
}

class Hund extends Tier {
  constructor(name, rasse) {
    super(name);
    this.rasse = rasse;
  }

  beschreibung() {
    return super.beschreibung() + " Rasse: " + this.rasse;
  }
}

console.log(new Hund("Bello", "Dackel").beschreibung());
```

- `super(name)` ruft den constructor der Elternklasse auf.
- Erst **danach** darfst du `this` benutzen.
- `super.beschreibung()` ruft die Methode der Eltern auf. Die Kindklasse **überschreibt** sie und baut darauf auf.
