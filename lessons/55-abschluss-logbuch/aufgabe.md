## Aufgabe: Das Server-Logbuch

Das Array `log` mit den Zeilen gibt es schon.

1. `zeileLesen(zeile)` zerlegt eine Zeile in ein Objekt `{ datum, zeit, stufe, text }`. Die Stufe muss `INFO`, `WARNUNG` oder `FEHLER` sein. Passt die Zeile nicht ins Format, gib `null` zurück.
2. `nurFehler(zeilen)` ist ein **Generator**, der die gelesenen Objekte aller gültigen Zeilen mit Stufe `FEHLER` liefert, einen nach dem anderen.
3. `zaehleStufen(zeilen)` gibt ein Objekt zurück, das zählt, wie oft jede Stufe bei den gültigen Zeilen vorkommt, z. B. `{ INFO: 3, WARNUNG: 1, FEHLER: 2 }`.
4. `bericht(zeilen)` gibt einen Text zurück:
   - Gibt es Fehler: `"2 Fehler, zuletzt am 31. Oktober 2026 um 02:40: Speicher voll"` (Datum mit `Intl`, lang auf Deutsch).
   - Gibt es keine: `"Keine Fehler"`.
