## Aufgabe: Das Formular-Prüfgerät

Du baust vier kleine Prüfer für ein Formular. Jeder benutzt einen regulären Ausdruck aus der Erklärung.

### Schritt 1: Die Postleitzahl

```js
istPlz("90459");  // true
istPlz("9045");   // false
istPlz("90459a"); // false
```

Gib `/^\d{5}$/.test(text)` zurück. Das ist genau das Muster aus der Erklärung.

Wichtig: Ohne `^` und `$` würde auch ein Teil eines längeren Textes passen.

### Schritt 2: Alle Zahlen finden

```js
zahlenFinden("3 Äpfel und 12 Birnen"); // [3, 12]
zahlenFinden("keine Zahl");            // []
```

So gehst du vor:

1. Suche mit `text.match(/\d+/g)` alle Zahlen.
2. Gibt es keine, kommt `null` heraus. Mach mit `?? []` ein leeres Array daraus.
3. Die Treffer sind Texte. Wandle sie mit `.map(Number)` in Zahlen um.

### Schritt 3: Das Datum umdrehen

```js
datumDeutsch("2026-10-31"); // "31.10.2026"
```

Nimm `replace` mit drei Gruppen, genau wie in der Erklärung.

### Schritt 4: Eine grobe E-Mail-Prüfung

```js
istEmail("lea@beispiel.de");    // true
istEmail("LEA@BEISPIEL.DE");    // true
istEmail("lea.beispiel.de");    // false
istEmail("lea@beispiel");       // false
istEmail("lea @beispiel.de");   // false
```

Eine Adresse besteht hier aus vier Teilen. Baue das Muster Stück für Stück zusammen:

1. Am Anfang ein oder mehr Zeichen, die weder Leerzeichen noch `@` sind: `^[^\s@]+`.
2. Dann ein `@`.
3. Dann wieder solche Zeichen, dann ein Punkt: `[^\s@]+\.`. Der Punkt braucht davor einen umgekehrten Schrägstrich `\`, sonst bedeutet er „irgendein Zeichen“.
4. Am Ende mindestens zwei Buchstaben: `[a-z]{2,}$`.

Setze hinter das Muster das Flag `i`. Dann ist Groß- und Kleinschreibung egal.
