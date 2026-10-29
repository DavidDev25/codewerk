## Polymorphie: Einer ruft, jeder macht es auf seine Art

:::alltag
Du rufst in einer Küche: „Mach etwas zu essen!“ Der Bäcker backt Brot, der Koch brät Fleisch, die Konditorin macht Kuchen. Du musst nicht wissen, wer was kann. Du rufst allen dasselbe zu.
:::

```js
class Tier {
  laut() {
    return "...";
  }
}

class Hund extends Tier {
  laut() {
    return "Wuff";
  }
}

class Katze extends Tier {
  laut() {
    return "Miau";
  }
}

const tiere = [new Hund(), new Katze(), new Tier()];
for (const tier of tiere) {
  console.log(tier.laut());
}
```

- Alle haben die Methode `laut()`.
- Jede Klasse **überschreibt** sie auf ihre Weise.
- Die Schleife fragt **nie**: „Bist du ein Hund?“ Sie ruft einfach `laut()` auf.

Neue Tiere kannst du später hinzufügen, ohne die Schleife zu ändern. Das ist der große Vorteil.
