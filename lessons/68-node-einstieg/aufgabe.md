## Aufgabe: Ein Gruß-Programm für das Terminal

Das Programm wird so gestartet: `GRUSS=Moin node main.js Mara 2`. In Codewerk sind diese Argumente und die Umgebungsvariable schon eingestellt.

1. Schreibe `begruessen(name, anzahl, gruss = "Hallo")`. Sie gibt ein **Array** mit `anzahl` gleichen Zeilen zurück, jede im Format `"Hallo, Mara!"` (mit dem jeweiligen Gruß).
2. Hole `name` und `anzahlText` aus `process.argv`. Denk an `slice(2)`.
3. Hole den Gruß aus `process.env.GRUSS`. Fehlt er, nimm `"Hallo"`.
4. Fehlt der Name: Gib mit `console.error` aus `Bitte gib einen Namen an: node main.js <name> [anzahl]` und setze den Exit-Code auf `1`.
5. Sonst: Gib jede Zeile von `begruessen(…)` mit `console.log` aus. Fehlt die Anzahl, grüße einmal.

Erwartete Ausgabe:

```
Moin, Mara!
Moin, Mara!
```

Die letzte Zeile `module.exports = { begruessen };` bleibt stehen. Sie macht die Funktion für die Tests sichtbar, mehr dazu in der nächsten Lektion.
