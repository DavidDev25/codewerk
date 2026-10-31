## Aufgabe: Der Notizzettel mit Gedächtnis

1. **Besuche zählen:** Lies `"besuche"` aus `localStorage` (noch nichts gespeichert heißt 0), erhöhe um 1, speichere den neuen Wert und zeige ihn in `#besuche`.
2. **Notiz laden:** Steht unter `"notiz"` schon etwas, kommt es beim Start in das Textfeld `#notiz`.
3. **Notiz speichern:** Ein Klick auf `#speichern` speichert den Inhalt von `#notiz` unter `"notiz"` und schreibt `"Gespeichert"` in `#status`.
4. `einstellungenSpeichern(obj)` speichert ein Objekt als JSON unter `"einstellungen"`. `einstellungenLaden()` gibt es wieder als Objekt zurück, oder `{ thema: "hell" }`, wenn noch nichts gespeichert ist.

Drücke danach mehrmals **Ausführen** und schau in der **Vorschau**, wie der Zähler wächst.
