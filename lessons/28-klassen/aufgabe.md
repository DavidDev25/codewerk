## Aufgabe: Die Klasse Buch

Du schreibst einen Bauplan für Bücher und baust damit zwei Bücher. Das funktioniert genau wie bei den Katzen in der Erklärung.

### Schritt 1: Der Bauplan

Jedes Buch hat einen Titel, einen Autor und eine Seitenzahl:

```js
const b = new Buch("Momo", "Michael Ende", 304);
b.titel;  // "Momo"
b.autor;  // "Michael Ende"
b.seiten; // 304
```

So gehst du vor:

1. Schreibe `class Buch { ... }`.
2. Schreibe darin einen `constructor(titel, autor, seiten)`.
3. Speichere im `constructor` jeden Wert mit `this`, zum Beispiel `this.titel = titel;`.

### Schritt 2: Der Hobbit

Baue unter der Klasse das erste Buch:

```js
const hobbit = new Buch("Der Hobbit", "J. R. R. Tolkien", 310);
```

### Schritt 3: Ein zweites Buch

Baue `const krimi` mit `new Buch(...)`. Titel, Autor und Seitenzahl darfst du dir selbst aussuchen.

Wichtig: Schreibe nicht `const krimi = hobbit`. Dann zeigen beide Namen auf dasselbe Buch. Du brauchst ein zweites `new`.
