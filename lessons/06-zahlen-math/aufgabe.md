## Aufgabe: Der Spieleabend

Für einen Spieleabend brauchst du ein paar Helfer rund um Zahlen: zum Runden, für Preise, zum Würfeln und zum Prüfen von Eingaben.

### Schritt 1: Runden

Schreibe `runden(zahl)`. Sie rundet auf zwei Nachkommastellen:

```js
runden(3.14159); // 3.14
runden(1.239);   // 1.24
runden(2.5);     // 2.5
```

Nimm den Trick aus der Erklärung: mal 100, runden, durch 100.

### Schritt 2: Der Preis als Text

Schreibe `preisText(betrag)`. Sie gibt einen Preis mit zwei Stellen, Komma und Euro-Zeichen zurück:

```js
preisText(4.5); // "4,50 €"
preisText(12);  // "12,00 €"
```

So gehst du vor:

1. Mach mit `toFixed(2)` aus der Zahl einen Text mit zwei Stellen.
2. Tausche mit `replace` den Punkt gegen ein Komma.
3. Häng ein Leerzeichen und `€` an.

### Schritt 3: Würfeln

Schreibe `wuerfeln()`. Sie gibt bei jedem Aufruf eine zufällige **ganze** Zahl von 1 bis 6 zurück.

Wichtig: Es muss auch die 6 vorkommen können. Fehlt sie, hast du das `+ 1` vergessen. Kommt eine Kommazahl heraus, fehlt `Math.floor`.

### Schritt 4: Ist das eine Zahl?

Schreibe `alsZahl(text)`. Sie wandelt einen Text in eine Zahl um. Klappt das nicht, gibt sie `null` zurück:

```js
alsZahl("42");   // 42
alsZahl("3.5");  // 3.5
alsZahl("vier"); // null
```

Wandle zuerst mit `Number(text)` um. Prüfe dann mit `Number.isNaN(…)`, ob dabei `NaN` herausgekommen ist.
