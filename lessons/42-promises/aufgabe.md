## Aufgabe: Der Pizza-Lieferdienst

Du baust einen Lieferdienst, bei dem jede Bestellung ein bisschen dauert. Im Editor steht schon die `speisekarte`. Was darauf steht, wird geliefert. Alles andere wird abgelehnt.

### Schritt 1: Warten

`warten(ms)` gibt ein Promise zurück, das nach `ms` Millisekunden erfüllt wird:

```js
warten(50).then(() => console.log("50 ms sind um"));
```

So gehst du vor:

1. Schreibe `function warten(ms)`.
2. Gib darin `new Promise((resolve) => { ... })` zurück.
3. Rufe im Promise `setTimeout(resolve, ms)` auf. Dann ruft der Timer `resolve` auf, sobald die Zeit um ist.

### Schritt 2: Bestellen

`bestellen(gericht)` gibt ein Promise zurück. Nach 100 Millisekunden ist das Gericht fertig oder die Bestellung wird abgelehnt:

```js
bestellen("Pizza"); // wird erfüllt mit "Pizza ist fertig!"
bestellen("Salat"); // wird erfüllt mit "Salat ist fertig!"
bestellen("Sushi"); // wird abgelehnt mit dem Fehler "Sushi gibt es heute nicht."
```

So gehst du vor:

1. Gib in `bestellen` ein `new Promise((resolve, reject) => { ... })` zurück.
2. Starte darin einen Timer mit `setTimeout` und 100 Millisekunden.
3. Prüfe im Timer mit `speisekarte.includes(gericht)`, ob es das Gericht gibt.
4. Wenn ja, rufe `resolve(gericht + " ist fertig!")` auf.
5. Wenn nein, rufe `reject(new Error(gericht + " gibt es heute nicht."))` auf.

Wichtig: Schreibe nicht fest `"Pizza"` hinein. Die Tests bestellen auch andere Gerichte.

### Schritt 3: Pizza bestellen

Bestelle `"Pizza"` und hänge `.then((text) => console.log(text))` an. Im Reiter **Ausgabe** erscheint dann „Pizza ist fertig!“.

### Schritt 4: Sushi bestellen

Bestelle `"Sushi"` und hänge `.catch((fehler) => console.log(fehler.message))` an. Dann erscheint „Sushi gibt es heute nicht.“.
