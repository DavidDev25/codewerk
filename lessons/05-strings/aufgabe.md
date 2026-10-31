## Aufgabe: Das Anmeldeformular

Schreibe vier Funktionen, die Eingaben aus einem Formular aufbereiten.

1. `initialen(vorname, nachname)` gibt die Anfangsbuchstaben groß mit Punkt zurück: `initialen("mara", "schulz")` ergibt `"M.S."`.
2. `bereinigen(text)` entfernt Leerzeichen am Rand und macht alles klein: `"  Mara@Beispiel.de "` wird `"mara@beispiel.de"`.
3. `istBild(dateiname)` gibt `true` zurück, wenn der Name auf `.png` oder `.jpg` endet, egal ob groß oder klein geschrieben.
4. `kuerzen(text, max)` gibt den Text unverändert zurück, wenn er höchstens `max` Zeichen hat. Sonst die ersten `max` Zeichen und danach `"…"`.
