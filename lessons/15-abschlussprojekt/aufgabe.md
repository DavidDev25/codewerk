## Aufgabe: Mini-Bibliothek

Im Startcode steht schon ein Gerüst. Arbeite die Schritte der Reihe nach ab und drücke nach jedem Schritt **Ausführen**.

### Schritt 1: Buch

- Privates Feld `#verliehen`, startet bei `false`.
- `constructor(titel)` speichert den Titel.
- Getter `istVerliehen` gibt `#verliehen` zurück.
- `ausleihen()` gibt `false` zurück, wenn das Buch schon verliehen ist. Sonst setzt es `#verliehen` auf `true` und gibt `true` zurück.
- `zurueckgeben()` setzt `#verliehen` wieder auf `false`.
- `beschreibung()` gibt den Titel zurück.

### Schritt 2: Hoerbuch

- `Hoerbuch extends Buch`.
- `constructor(titel, minuten)` ruft `super(titel)` auf und speichert `minuten`.
- `beschreibung()` gibt `<titel> (Hörbuch, <minuten> Min.)` zurück. Nutze `super.beschreibung()`.

### Schritt 3: Bibliothek

- `this.buecher` ist ein leeres Array.
- `hinzufuegen(buch)` fügt ein Buch hinzu.
- `ausleihen(titel)` sucht das Buch und leiht es aus. Die Antwort ist einer dieser Texte:
  `Viel Spaß mit <titel>!`, `<titel> ist schon verliehen.` oder `<titel> gibt es nicht.`
- `verfuegbar()` gibt ein Array mit den **Beschreibungen** aller nicht verliehenen Bücher zurück.

### Schritt 4: Benutzen

- Lege `const bibliothek` an.
- Füge `new Buch("Momo")` und `new Hoerbuch("Der Hobbit", 660)` hinzu.
- Leihe `"Momo"` aus.
