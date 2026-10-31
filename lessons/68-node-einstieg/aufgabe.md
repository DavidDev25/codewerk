## Aufgabe: Ein Gruß-Programm für das Terminal

Du schreibst ein kleines Programm, das man im Terminal so starten würde: `GRUSS=Moin node main.js Mara 2`. In Codewerk sind diese Argumente und die Umgebungsvariable schon eingestellt.

Am Ende soll im Reiter **Ausgabe** stehen:

```
Moin, Mara!
Moin, Mara!
```

Die letzte Zeile im Editor, `module.exports = { begruessen };`, bleibt stehen. Sie macht die Funktion für die Tests sichtbar. Mehr dazu erfährst du in der nächsten Lektion.

### Schritt 1: Die Gruß-Funktion

`begruessen(name, anzahl, gruss)` gibt ein Array mit `anzahl` gleichen Zeilen zurück:

```js
begruessen("Mara", 2, "Moin"); // ["Moin, Mara!", "Moin, Mara!"]
begruessen("Ali", 1);          // ["Hallo, Ali!"]
```

So gehst du vor:

1. Schreibe `function begruessen(name, anzahl, gruss = "Hallo")`.
2. Lege darin ein leeres Array an und lege mit einer Schleife `anzahl`-mal die Zeile hinein.
3. Gib das Array zurück.

### Schritt 2: Argumente und Gruß holen

So gehst du vor:

1. Hole Name und Anzahl mit `const [name, anzahlText] = process.argv.slice(2);`.
2. Hole den Gruß mit `process.env.GRUSS ?? "Hallo"`.

### Schritt 3: Ausgeben oder Fehler melden

Fehlt der Name, meldet das Programm einen Fehler. Sonst gibt es alle Zeilen aus:

```text
Bitte gib einen Namen an: node main.js <name> [anzahl]
```

So gehst du vor:

1. Fehlt `name`, gib mit `console.error` genau die Meldung oben aus und setze `process.exitCode = 1`.
2. Sonst wandle die Anzahl mit `Number(anzahlText)` um. Fehlt sie, nimm 1. Das geht mit `?? 1` vor dem Umwandeln.
3. Gib jede Zeile von `begruessen(name, anzahl, gruss)` mit `console.log` aus.
