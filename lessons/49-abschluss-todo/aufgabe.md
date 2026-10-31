## Aufgabe: Die To-do-App

Baue die App Schritt für Schritt. Die Daten liegen in `let aufgaben` (ein Array aus `{ text, erledigt }`).

1. `laden()` gibt das gespeicherte Array aus `localStorage` (Schlüssel `"aufgaben"`) zurück, oder `[]`. Starte mit `let aufgaben = laden();`.
2. `speichern()` legt `aufgaben` als JSON unter `"aufgaben"` ab.
3. `zeichnen()` baut `#aufgaben` komplett neu. Jede Aufgabe wird ein `<li>` mit:
   - einem `<span>` mit dem Text,
   - einem Knopf mit der Klasse `loeschen` und dem Text `"✕"`,
   - der Klasse `erledigt`, wenn die Aufgabe erledigt ist,
   - `data-index` mit der Position im Array.

   Außerdem schreibt `zeichnen()` in `#zaehler` `"<offen> von <gesamt> offen"`.
4. **Hinzufügen:** Beim Absenden von `#neu` kommt der Text (ohne Leerzeichen am Rand) als neue, nicht erledigte Aufgabe hinzu. Leere Eingaben werden ignoriert. Danach wird das Feld geleert.
5. **Abhaken und Löschen** mit **einem** Listener auf `#aufgaben`: Ein Klick auf `.loeschen` entfernt die Aufgabe, ein Klick irgendwo sonst auf ein `<li>` schaltet `erledigt` um.
6. Nach **jeder** Änderung: `speichern()` und `zeichnen()`. Rufe `zeichnen()` auch einmal beim Start auf.
