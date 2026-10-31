## Aufgabe: Mini-Shop

Im Editor stehen zwei Funktionen, die so tun, als würden sie mit einem Server sprechen. Ändere sie nicht:

- `ladeProdukte()` liefert nach kurzer Zeit das Sortiment, zum Beispiel `{ name: "Tasse", preis: 8 }`.
- `bezahlen(betrag)` bezahlt den Betrag und liefert einen Text wie „Bezahlt: 20 €“. Über 100 € wird das Promise mit dem Fehler „Limit überschritten“ abgelehnt.

Arbeite die Schritte der Reihe nach ab. Drücke nach jedem Schritt auf **Ausführen** und schau, welche Tests schon grün sind.

### Schritt 1: Der Warenkorb

```js
const korb = new Warenkorb();
korb.hinzufuegen({ name: "Tasse", preis: 8 }, 2);
korb.hinzufuegen({ name: "Kaffee", preis: 12 });
korb.anzahl;  // 3
korb.summe(); // 28
korb.namen(); // ["Tasse", "Kaffee"]
korb.hinzufuegen({ name: "Kanne", preis: 35 }, 0); // Fehler: Menge muss mindestens 1 sein.
```

So gehst du vor:

1. Lege oben in der Klasse das private Feld `#artikel = [];` an.
2. Schreibe `hinzufuegen(produkt, menge = 1)`. Ist `menge` kleiner als 1, wirf `new Error("Menge muss mindestens 1 sein.")`. Sonst lege `{ produkt, menge }` mit `push` in `#artikel`.
3. Schreibe den Getter `anzahl`. Er zählt mit `reduce` alle Mengen zusammen.
4. Schreibe `summe()`. Sie zählt mit `reduce` Preis mal Menge für jeden Eintrag zusammen.
5. Schreibe `namen()`. Sie macht mit `map` aus jedem Eintrag den Namen des Produkts.

Wichtig: Der Fehler muss **vor** dem `push` kommen. Sonst landet die falsche Menge trotzdem im Korb.

### Schritt 2: Einkaufen

`einkaufen(namen)` bekommt eine Liste mit Produktnamen und gibt einen gefüllten Korb zurück:

```js
const korb = await einkaufen(["Tasse", "Kaffee"]);
korb.summe();                // 20
await einkaufen(["Einhorn"]); // Fehler: Einhorn gibt es nicht.
```

So gehst du vor:

1. Schreibe `async function einkaufen(namen)`.
2. Lade das Sortiment mit `const produkte = await ladeProdukte();` und lege einen neuen `Warenkorb` an.
3. Gehe mit `for…of` durch die Namen. Suche jedes Produkt mit `produkte.find(...)`.
4. Findet `find` nichts, wirf einen Fehler mit dem Text „… gibt es nicht.“ und dem Namen vorne.
5. Sonst lege das Produkt in den Korb. Gib am Ende den Korb zurück.

### Schritt 3: Die Kasse

`kasse(korb)` bezahlt die Summe des Korbs:

```js
const korb = await einkaufen(["Tasse", "Kaffee"]);
await kasse(korb); // "Bezahlt: 20 €"
// bei mehr als 100 €: "Zahlung fehlgeschlagen: Limit überschritten"
```

So gehst du vor:

1. Schreibe `async function kasse(korb)`.
2. Gib im `try`-Block `await bezahlen(korb.summe())` zurück.
3. Gib im `catch`-Block `"Zahlung fehlgeschlagen: "` plus die Fehlermeldung zurück.

### Schritt 4: Einkaufen gehen

Schreibe `async function start()`. Kaufe darin `"Tasse"` und `"Kaffee"` ein, schicke den Korb an die Kasse und gib das Ergebnis mit `console.log` aus. Rufe danach ganz unten `start();` auf. Im Reiter **Ausgabe** erscheint dann „Bezahlt: 20 €“.
