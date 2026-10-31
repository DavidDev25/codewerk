## Aufgabe: Der Pizza-Lieferdienst

Die `speisekarte` gibt es schon.

1. Schreibe `function warten(ms)`. Sie gibt ein Promise zurück, das nach `ms` Millisekunden erfüllt wird (`resolve` in `setTimeout`).
2. Schreibe `function bestellen(gericht)`. Sie gibt ein Promise zurück und wartet darin 100 Millisekunden.
3. Steht `gericht` auf der Speisekarte, erfülle das Promise mit dem Text `"<gericht> ist fertig!"`, z. B. `"Pizza ist fertig!"`.
4. Sonst lehne es ab mit `new Error("<gericht> gibt es heute nicht.")`.
5. Bestelle `"Pizza"` und gib den Text mit `.then(…)` aus.
6. Bestelle `"Sushi"` und gib im `.catch(…)` die **Fehlermeldung** (`fehler.message`) aus.
