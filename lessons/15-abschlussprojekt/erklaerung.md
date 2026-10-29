## Alles zusammen: eine Mini-Bibliothek

Du hast jetzt alle Werkzeuge. Hier baust du eine kleine Bibliothek, in der man Bücher ausleihen kann.

:::alltag
In einer echten Bücherei merkt sich **jedes Buch** selbst, ob es verliehen ist. Die **Bibliothek** hat viele Bücher und sorgt dafür, dass man nur freie ausleihen kann. Hörbücher sind auch Bücher, nur mit einer Laufzeit.
:::

Das Zusammenspiel:

- `Buch` hat ein **privates** Feld `#verliehen` und einen **Getter** `istVerliehen`.
- `Hoerbuch` **erbt** von `Buch`, nutzt `super(…)` und überschreibt `beschreibung()` (**Polymorphie**).
- `Bibliothek` **hat** ein Array von Büchern (**Komposition**).

```js
class Verein {
  constructor() {
    this.mitglieder = [];
  }

  aufnehmen(name) {
    this.mitglieder.push(name);
  }
}
```

Die Bibliothek arbeitet ganz normal mit jedem Buch. Ob es ein Buch oder Hörbuch ist, interessiert sie nicht.

Im **Diagramm** siehst du am Ende alles auf einen Blick: Pfeile, Vererbung, Schlösser.
