## Aufgabe: Ein sicherer Taschenrechner

Im Editor steht die Funktion `teilen(a, b)`. Sie teilt aber auch durch 0, und dabei kommt Unsinn heraus. Du bringst ihr bei, bei 0 Alarm zu schlagen. Danach schreibst du eine zweite Funktion, die diesen Alarm auffängt.

### Schritt 1: Alarm bei 0

```js
teilen(10, 2); // 5
teilen(1, 0);  // Fehler: Durch 0 kann man nicht teilen.
```

So gehst du vor:

1. Prüfe in `teilen` zuerst mit `if (b === 0)`, ob durch 0 geteilt werden soll.
2. Wenn ja, wirf einen Fehler: `throw new Error("Durch 0 kann man nicht teilen.");`.
3. Sonst gib wie bisher `a / b` zurück.

Wichtig: Schreibe den Fehlertext genau so ab, mit Punkt am Ende. Die Tests vergleichen ihn Zeichen für Zeichen.

### Schritt 2: Den Fehler auffangen

`sicherTeilen(a, b)` stürzt nie ab. Bei einem Fehler gibt sie einen Text zurück:

```js
sicherTeilen(9, 3);  // 3
sicherTeilen(10, 0); // "Fehler: Durch 0 kann man nicht teilen."
```

So gehst du vor:

1. Schreibe `function sicherTeilen(a, b) { ... }`.
2. Gib im `try`-Block `teilen(a, b)` zurück.
3. Gib im `catch (fehler)`-Block `"Fehler: " + fehler.message` zurück.

### Schritt 3: Ausprobieren

Lege `const ergebnis = sicherTeilen(10, 0);` an und gib `ergebnis` mit `console.log` aus. Im Reiter **Ausgabe** steht danach die Fehlermeldung, aber das Programm ist nicht abgestürzt.
