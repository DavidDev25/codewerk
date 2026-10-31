## Aufgabe: Der Event-Kalender

Alle Daten kommen als Text im Format `"JJJJ-MM-TT"`. Gib bei `Intl.DateTimeFormat` immer `timeZone: "UTC"` mit.

1. `tageBis(von, bis)` gibt zurück, wie viele Tage zwischen den beiden Daten liegen. `tageBis("2026-10-31", "2026-12-24")` ergibt `54`.
2. `datumLang(iso)` gibt das Datum lang auf Deutsch zurück: `"2026-12-24"` wird `"24. Dezember 2026"`.
3. `wochentag(iso)` gibt den Wochentag auf Deutsch zurück: `"2026-12-24"` ist `"Donnerstag"`.
4. `preis(betrag)` gibt den Betrag als Euro-Preis auf Deutsch zurück: `1234.5` wird `"1.234,50 €"`.
