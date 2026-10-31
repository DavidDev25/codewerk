## Aufgabe: Wochenmarkt und Sportverein

`produkte`, `fussball` und `schwimmen` gibt es schon.

1. `const nachKategorie` gruppiert `produkte` nach `kategorie` (mit `Object.groupBy`).
2. `const nachPreis` gruppiert `produkte` mit `Map.groupBy` nach `"günstig"` (unter 2 €) und `"teuer"` (ab 2 €).
3. `const beides` ist ein Set aller Kinder, die **in beiden** Sportarten sind.
4. `const alle` ist ein Set aller Kinder aus **mindestens einer** Sportart.
5. `const nurFussball` ist ein Set der Kinder, die Fußball, aber **nicht** Schwimmen machen.
6. `istTeilVon(a, b)` gibt `true` zurück, wenn jedes Kind aus Set `a` auch in Set `b` ist.
