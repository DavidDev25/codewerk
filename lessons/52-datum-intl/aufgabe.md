## Aufgabe: Der Event-Kalender

Du baust vier Helfer für einen Veranstaltungskalender. Alle Daten kommen als Text wie `"2026-12-24"`, also erst Jahr, dann Monat, dann Tag.

Wichtig: Gib bei `Intl.DateTimeFormat` immer `timeZone: "UTC"` mit. Sonst rutscht das Datum je nach Zeitzone auf den Vortag.

### Schritt 1: Tage zählen

```js
tageBis("2026-10-31", "2026-12-24"); // 54
```

So gehst du vor:

1. Mache aus beiden Texten mit `new Date(...)` ein Datum.
2. Ziehe das frühere vom späteren Datum ab.
3. Teile das Ergebnis durch die Millisekunden pro Tag: `24 * 60 * 60 * 1000`.

### Schritt 2: Das Datum ausschreiben

```js
datumLang("2026-12-24"); // "24. Dezember 2026"
```

Lege ein `new Intl.DateTimeFormat("de-DE", { ... })` mit `dateStyle: "long"` und `timeZone: "UTC"` an. Gib damit `format(new Date(iso))` zurück.

### Schritt 3: Der Wochentag

```js
wochentag("2026-12-24"); // "Donnerstag"
```

Das funktioniert genau wie Schritt 2. Statt `dateStyle` nimmst du `weekday: "long"`.

### Schritt 4: Der Preis

```js
preis(1234.5); // "1.234,50 €"
```

Nimm `new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })` und gib damit `format(betrag)` zurück.

Wichtig: Baue den Preis nicht von Hand mit `+ " €"` zusammen. Dann fehlen Tausenderpunkt und geschütztes Leerzeichen, und die Tests schlagen fehl.
