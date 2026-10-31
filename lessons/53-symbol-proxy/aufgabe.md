## Aufgabe: Die Objekt-Werkstatt

1. `const GEHEIM` ist ein Symbol mit der Beschreibung `"geheim"`. `verstecken(obj, wert)` speichert `wert` unter `GEHEIM` im Objekt und gibt das Objekt zurück. Der Wert taucht dann weder in `Object.keys` noch in JSON auf.
2. `mitStandard(obj, standard)` gibt einen Proxy zurück: Fragt man eine Eigenschaft ab, die es im Objekt **nicht** gibt, kommt `standard` zurück, sonst der echte Wert.
3. `nurZahlen(obj)` gibt einen Proxy zurück, der beim **Setzen** prüft: Ist der Wert keine Zahl, wirft er einen `TypeError`. Zahlen werden normal gespeichert.
4. `protokolliert(obj, log)` gibt einen Proxy zurück, der bei jedem Setzen `"<name>=<wert>"` in das Array `log` schreibt und den Wert dann normal speichert.
