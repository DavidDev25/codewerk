## Einer ruft, jeder antwortet auf seine Art

Mehrere Klassen können eine Methode mit demselben Namen haben. Jede Klasse füllt sie aber mit eigenem Code. Dann kannst du alle Objekte gleich behandeln, und jedes reagiert auf seine eigene Weise. Das nennt man **Polymorphie**, auf Deutsch etwa „Vielgestaltigkeit“.

:::alltag
Du rufst in einer Küche: „Macht etwas zu essen!“ Der Bäcker backt Brot, der Koch brät Fleisch, die Konditorin macht Kuchen. Du musst nicht wissen, wer was kann. Du rufst allen dasselbe zu.
:::

Im Beispiel haben `Tier`, `Hund` und `Katze` alle eine Methode `laut()`. Die Schleife ruft sie einfach bei jedem Tier auf:

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

Ausgegeben werden „Wuff“, „Miau“ und „...“. Jedes Objekt benutzt die `laut()`-Methode seiner eigenen Klasse. Das allgemeine `Tier` hat keinen besonderen Laut und antwortet mit drei Punkten.

- Alle Klassen haben eine Methode `laut()`.
- `Hund` und `Katze` **überschreiben** sie jeweils auf ihre Weise.
- Die Schleife fragt **nie**, ob ein Tier ein Hund ist. Sie ruft einfach `laut()` auf.

Der große Vorteil: Kommt später ein neues Tier dazu, zum Beispiel eine Kuh, musst du die Schleife nicht ändern. Die Kuh bekommt einfach ihre eigene Methode `laut()`.
