## Alles zusammen: eine Mini-Bibliothek

Du hast jetzt alle Werkzeuge aus Teil 2 kennengelernt. Zum Abschluss baust du damit eine kleine Bibliothek, in der man Bücher ausleihen kann.

:::alltag
In einer echten Bücherei merkt sich **jedes Buch** selbst, ob es gerade verliehen ist. Die **Bibliothek** hat viele Bücher und sorgt dafür, dass man nur freie ausleihen kann. Hörbücher sind auch Bücher, sie haben nur zusätzlich eine Laufzeit.
:::

## Welches Werkzeug wohin gehört

Drei Klassen arbeiten zusammen. Jede benutzt etwas, das du in den letzten Lektionen gelernt hast:

- `Buch` merkt sich in einem **privaten Feld** `#verliehen`, ob es verliehen ist. Lesen kann man das über den **Getter** `istVerliehen`.
- `Hoerbuch` **erbt** von `Buch`. Es ruft `super(…)` auf und hat eine eigene Methode `beschreibung()`, die die von `Buch` überschreibt.
- `Bibliothek` **hat** eine Liste von Büchern. Das ist Komposition.

So sieht eine Klasse aus, die eine Liste von etwas hat. Die Bibliothek funktioniert nach demselben Muster, nur mit Büchern statt Namen:

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

Die Liste entsteht im `constructor`, und eine Methode legt neue Einträge hinein.

Die Bibliothek behandelt jedes Buch gleich. Sie ruft einfach `beschreibung()` auf. Ob ein normales Buch oder ein Hörbuch antwortet, muss sie nicht wissen. Das ist die Polymorphie aus Lektion 34.

Im **Diagramm** siehst du am Ende alles auf einen Blick: die Pfeile zwischen den Objekten, die Vererbung und die Schlösser der privaten Felder.
