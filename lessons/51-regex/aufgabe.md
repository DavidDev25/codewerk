## Aufgabe: Das Formular-Prüfgerät

Löse jede Aufgabe mit einem regulären Ausdruck.

1. `istPlz(text)` gibt `true` zurück, wenn `text` aus **genau fünf** Ziffern besteht.
2. `zahlenFinden(text)` gibt alle Zahlen im Text als Array von **Zahlen** zurück: `"3 Äpfel und 12 Birnen"` ergibt `[3, 12]`. Ohne Zahlen ein leeres Array.
3. `datumDeutsch(iso)` wandelt `"2026-10-31"` in `"31.10.2026"` um. Nutze Gruppen und `replace`.
4. `istEmail(text)` macht eine grobe Prüfung: ein oder mehr Zeichen ohne Leerzeichen und ohne `@`, dann `@`, dann wieder solche Zeichen, dann ein Punkt und am Ende mindestens zwei Buchstaben. Groß- und Kleinschreibung ist egal.
