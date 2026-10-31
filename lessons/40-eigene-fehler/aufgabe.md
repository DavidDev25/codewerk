## Aufgabe: Das Anmeldeformular prüft genauer

1. Schreibe die Klasse `EingabeFehler`, die von `Error` erbt. Sie bekommt `(feld, nachricht)`, setzt `name` auf `"EingabeFehler"` und merkt sich `feld`.
2. `alterPruefen(text)` wandelt `text` in eine Zahl um und gibt sie zurück. Ist es keine Zahl, wirf `EingabeFehler("alter", "Bitte eine Zahl eingeben.")`. Ist sie kleiner als 0, wirf `EingabeFehler("alter", "Das Alter kann nicht negativ sein.")`.
3. `profilLesen(json)` gibt das Objekt aus dem JSON-Text zurück. Ist der Text kaputt, wirf einen normalen `Error` mit der Nachricht `"Profil beschädigt"` und dem ursprünglichen Fehler als `cause`.
4. `sicher(fn)` ruft `fn()` auf:
   - Klappt es: `{ ok: true, wert: … }`.
   - Kommt ein `EingabeFehler`: `{ ok: false, feld: …, nachricht: … }`.
   - Jeden **anderen** Fehler wirft `sicher` unverändert weiter.
