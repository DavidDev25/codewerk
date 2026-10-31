## Aufgabe: Mini-Shop

Im Startcode stehen schon zwei Funktionen, die du **nicht** änderst:

- `ladeProdukte()` liefert nach kurzer Zeit das Sortiment: Objekte wie `{ name: "Tasse", preis: 8 }`.
- `bezahlen(betrag)` bezahlt den Betrag und liefert z. B. `"Bezahlt: 20 €"`. Über 100 € wird das Promise mit dem Fehler `"Limit überschritten"` abgelehnt.

Arbeite die Schritte der Reihenfolge nach ab und drücke nach jedem Schritt **Ausführen**.

### Schritt 1: Warenkorb

- Privates Feld `#artikel`, startet als leeres Array.
- `hinzufuegen(produkt, menge = 1)` legt `{ produkt, menge }` in `#artikel` ab.
- Ist `menge` kleiner als 1, wirft `hinzufuegen` einen Fehler mit dem Text `"Menge muss mindestens 1 sein."`.
- Getter `anzahl` gibt zurück, wie viele Stück insgesamt im Korb liegen (alle Mengen zusammen).
- `summe()` gibt den Gesamtpreis zurück (Preis mal Menge, alles zusammen).
- `namen()` gibt ein Array mit den Namen der Produkte zurück.

### Schritt 2: Einkaufen

- `async function einkaufen(namen)` bekommt ein Array mit Produktnamen.
- Lade das Sortiment mit `await ladeProdukte()` und lege einen neuen Warenkorb an.
- Suche jeden Namen im Sortiment und lege das Produkt in den Korb.
- Gibt es einen Namen nicht, wirf einen Fehler mit dem Text `"<name> gibt es nicht."`.
- Gib den gefüllten Korb zurück.

### Schritt 3: Kasse

- `async function kasse(korb)` bezahlt `korb.summe()` mit `await bezahlen(…)` und gibt die Antwort zurück.
- Geht das Bezahlen schief, gib `"Zahlung fehlgeschlagen: "` plus die Fehlermeldung zurück.

### Schritt 4: Benutzen

- Schreibe `async function start()`: Kaufe `"Tasse"` und `"Kaffee"` ein und gib das Ergebnis der Kasse mit `console.log` aus.
- Rufe `start()` auf.
