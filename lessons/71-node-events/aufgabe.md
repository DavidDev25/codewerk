## Aufgabe: Eine Kasse, die Bescheid sagt

Du baust eine Kasse, die bei jeder Zahlung Bescheid sagt, und ein Hauptprogramm, das zuhört. Am Ende soll im Reiter **Ausgabe** stehen:

```
+20 € (gesamt 20 €)
Fehler: Ungültiger Betrag
+40 € (gesamt 60 €)
Tagesziel erreicht!
+10 € (gesamt 70 €)
```

### Schritt 1: Die Klasse

So gehst du vor:

1. Schreibe `class Kasse extends EventEmitter`.
2. Rufe im `constructor(tagesziel)` zuerst `super()` auf.
3. Merke dir danach `this.summe = 0` und `this.tagesziel = tagesziel`.

### Schritt 2: Bezahlen

`bezahlen(betrag)` löst je nach Betrag verschiedene Events aus:

```js
const kasse = new Kasse(50);
kasse.bezahlen(20); // löst "bezahlt" mit { betrag: 20, summe: 20 } aus
kasse.bezahlen(40); // löst "bezahlt" mit { betrag: 40, summe: 60 } und danach "ziel" aus
kasse.bezahlen(-5); // löst "error" aus, die Summe bleibt gleich
```

So gehst du vor:

1. Ist `betrag` keine Zahl oder nicht größer als 0, löse `"error"` mit `new Error("Ungültiger Betrag")` aus und höre mit `return` auf.
2. Sonst erhöhe `this.summe` und löse `"bezahlt"` mit dem Objekt `{ betrag, summe: this.summe }` aus.
3. Ist `this.summe` jetzt mindestens so groß wie das Tagesziel, löse zusätzlich `"ziel"` aus.

### Schritt 3: Zuhören

Lege im Hauptprogramm eine Kasse mit dem Tagesziel 50 an und melde drei Listener an:

1. Bei `"bezahlt"` gibst du die Zeile mit Betrag und Summe aus, zum Beispiel „+20 € (gesamt 20 €)“.
2. Bei `"ziel"` gibst du „Tagesziel erreicht!“ aus. Nimm dafür `once` statt `on`, denn die Meldung soll nur beim ersten Mal kommen.
3. Bei `"error"` gibst du „Fehler:“ und die Fehlermeldung aus.

Wichtig: Der Listener für `"error"` muss stehen, bevor du `-5` bezahlst. Ohne ihn stürzt das Programm ab.

### Schritt 4: Einkaufen

Bezahle nacheinander `20`, `-5`, `40` und `10`. Bei der 10 ist die Summe 70 und damit wieder über dem Ziel. Weil du `once` benutzt hast, kommt die Ziel-Meldung trotzdem nur einmal.
