## Aufgabe: Die Kursanmeldung

Reagiere auf das Absenden von `#anmeldung`:

1. Verhindere das Neuladen der Seite.
2. Lies `name` (ohne Leerzeichen am Rand), `email` und `kurs` aus.
3. Prüfe in dieser Reihenfolge und schreibe die Meldung in `#meldung`:
   - kein Name: `"Bitte gib einen Namen ein."`
   - E-Mail ohne `@`: `"Bitte gib eine gültige E-Mail ein."`
   
   Gib `#meldung` bei einem Fehler die Klasse `fehler`.
4. Sind die Angaben in Ordnung:
   - hänge an `#teilnehmer` ein `<li>` mit `"<name> (<kurs>)"` an,
   - schreibe `"Angemeldet: <name>"` in `#meldung` mit der Klasse `ok` (statt `fehler`),
   - leere das Formular mit `reset()`.
