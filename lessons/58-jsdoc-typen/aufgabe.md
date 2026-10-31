## Aufgabe: Die Rechnung mit Typen

Du schreibst eine Funktion, die eine Rechnung zusammenzählt. Du beschreibst sie mit JSDoc und sicherst sie mit einer Prüfung ab, damit kein Text als Preis durchrutscht.

### Schritt 1: Der Prüfer

```js
mussZahlSein(12, "preis");   // nichts passiert
mussZahlSein("12", "preis"); // TypeError: preis muss eine Zahl sein
mussZahlSein(NaN, "menge");  // TypeError: menge muss eine Zahl sein
```

Schreibe `mussZahlSein(wert, name)` wie in der Erklärung. Die Bedingung kannst du übernehmen. Die Nachricht ist hier kürzer: nur der Name und dahinter „muss eine Zahl sein“.

### Schritt 2: Die Summe

```js
rechnungsSumme([
  { name: "Brot", preis: 3, menge: 2 },
  { name: "Milch", preis: 1.5, menge: 1 },
]); // 7.5
rechnungsSumme([{ name: "Käse", preis: "4", menge: 1 }]); // TypeError: preis muss eine Zahl sein
```

So gehst du vor:

1. Lege in `rechnungsSumme` eine Variable `summe` mit 0 an.
2. Gehe mit `for…of` durch alle Posten.
3. Prüfe bei jedem Posten zuerst `mussZahlSein(p.preis, "preis")` und `mussZahlSein(p.menge, "menge")`.
4. Addiere `p.preis * p.menge` zur Summe und gib sie am Ende zurück.

### Schritt 3: Die Beschreibung

Schreibe direkt über `function rechnungsSumme` einen JSDoc-Kommentar mit drei Teilen:

1. Einen Typ für einen Posten: `@typedef {Object} Posten`. Darunter je eine `@property` für `name` als `string`, `preis` als `number` und `menge` als `number`.
2. Den Parameter: `@param {Posten[]} posten`. `Posten[]` bedeutet eine Liste von Posten.
3. Die Rückgabe: `@returns {number}`.

So sieht der Anfang aus:

```text
/**
 * @typedef {Object} Posten
 * @property {string} name
 …
 */
```

Fahre danach im Editor mit der Maus über `posten`. Dann siehst du, dass der Editor deinen Typ kennt.
