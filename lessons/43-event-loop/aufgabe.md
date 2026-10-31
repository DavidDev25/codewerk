## Aufgabe: Wer kommt zuerst?

1. Lies den Code im Startbereich, **ohne** ihn auszuführen, und trage in `const vorhersage` die Buchstaben in der Reihenfolge ein, in der sie ausgegeben werden. Prüfe danach mit **Ausführen**.
2. `einplanen(log)` schreibt sofort `"sync"` in das Array `log`, plant `"micro"` als **Microtask** und `"task"` mit `setTimeout` ein. Am Ende soll `log` `["sync", "micro", "task"]` enthalten, **obwohl** du den Timer zuerst einplanst.
3. `zerlegen(liste, fertig)` verdoppelt jede Zahl der Liste, aber jede in einem **eigenen** Task (`setTimeout(…, 0)`). Wenn alle fertig sind, ruft sie `fertig(ergebnis)` mit dem neuen Array auf. Sie selbst gibt nichts zurück.
