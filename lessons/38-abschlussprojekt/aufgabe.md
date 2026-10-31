## Aufgabe: Mini-Bibliothek

Im Editor steht schon ein Gerüst mit drei leeren Klassen. Arbeite die Schritte der Reihe nach ab. Drücke nach jedem Schritt auf **Ausführen** und schau, welche Tests schon grün sind.

### Schritt 1: Das Buch

```js
const b = new Buch("Momo");
b.beschreibung(); // "Momo"
b.istVerliehen;   // false
b.ausleihen();    // true
b.ausleihen();    // false
b.zurueckgeben();
b.istVerliehen;   // false
```

So gehst du vor:

1. Lege oben in der Klasse das private Feld `#verliehen = false;` an.
2. Speichere im `constructor(titel)` den Titel in `this.titel`.
3. Schreibe den Getter `istVerliehen`. Er gibt `this.#verliehen` zurück.
4. Schreibe `ausleihen()`. Ist das Buch schon verliehen, gib `false` zurück. Sonst setze `#verliehen` auf `true` und gib `true` zurück.
5. Schreibe `zurueckgeben()`. Es setzt `#verliehen` wieder auf `false`.
6. Schreibe `beschreibung()`. Es gibt den Titel zurück.

Wichtig: Schreibe für `istVerliehen` **keinen** Setter. Von außen soll niemand ein Buch als verliehen markieren können.

### Schritt 2: Das Hörbuch

```js
const h = new Hoerbuch("Der Hobbit", 660);
h.minuten;        // 660
h.beschreibung(); // "Der Hobbit (Hörbuch, 660 Min.)"
h.ausleihen();    // true
```

So gehst du vor:

1. Rufe im `constructor(titel, minuten)` zuerst `super(titel)` auf und speichere dann `this.minuten`.
2. Schreibe `beschreibung()`. Hole mit `super.beschreibung()` den Titel und hänge die Angaben in Klammern an.

`ausleihen()` und `istVerliehen` musst du nicht neu schreiben. Das Hörbuch erbt beides vom Buch.

### Schritt 3: Die Bibliothek

```js
const bib = new Bibliothek();
bib.hinzufuegen(new Buch("Momo"));
bib.hinzufuegen(new Hoerbuch("Der Hobbit", 660));
bib.ausleihen("Momo");   // "Viel Spaß mit Momo!"
bib.ausleihen("Momo");   // "Momo ist schon verliehen."
bib.ausleihen("Nichts"); // "Nichts gibt es nicht."
bib.verfuegbar();        // ["Der Hobbit (Hörbuch, 660 Min.)"]
```

So gehst du vor:

1. Lege im `constructor` eine leere Liste an: `this.buecher = [];`.
2. `hinzufuegen(buch)` legt das Buch mit `push` in die Liste.
3. `ausleihen(titel)` sucht mit `this.buecher.find(...)` das Buch mit diesem Titel. Gibt es keins, gib den Text „gibt es nicht“ zurück. Klappt `buch.ausleihen()`, gib „Viel Spaß mit …!“ zurück. Sonst gib „ist schon verliehen“ zurück.
4. `verfuegbar()` behält mit `filter` alle Bücher, die nicht verliehen sind, und macht mit `map` aus jedem seine `beschreibung()`.

### Schritt 4: Deine Bibliothek

Ganz unten benutzt du alles zusammen:

1. Lege `const bibliothek = new Bibliothek();` an.
2. Füge `new Buch("Momo")` und `new Hoerbuch("Der Hobbit", 660)` hinzu.
3. Leihe `"Momo"` aus.

Danach ist nur noch das Hörbuch verfügbar.
