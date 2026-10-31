## Aufgabe: Die gedrosselte Obstsuche

1. `debounce(fn, ms)` gibt eine Funktion zurück, die `fn` erst `ms` Millisekunden nach dem **letzten** Aufruf ausführt, mit den Werten dieses letzten Aufrufs.
2. `throttle(fn, ms)` gibt eine Funktion zurück, die `fn` sofort ausführt, danach aber für `ms` Millisekunden alle weiteren Aufrufe ignoriert.
3. **Suche:** Bei Eingaben in `#suche` werden 150 ms nach dem letzten Tastendruck alle Einträge in `#liste` ausgeblendet (`hidden`), die den Suchtext **nicht** enthalten (Groß- und Kleinschreibung egal). Jede tatsächlich durchgeführte Suche erhöht `#anzahl` um 1. Nutze deine `debounce`-Funktion.
