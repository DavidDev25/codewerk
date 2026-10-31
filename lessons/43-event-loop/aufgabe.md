## Aufgabe: Wer kommt zuerst?

Oben im Editor stehen vier Zeilen, die die Buchstaben W, X, Y und Z ausgeben. Lass diese Zeilen unverändert. Zuerst sagst du voraus, in welcher Reihenfolge die Buchstaben kommen. Danach planst du selbst Code auf beiden Stapeln ein.

### Schritt 1: Die Vorhersage

Lies die vier Zeilen, **ohne** den Code auszuführen. Trage die Buchstaben in der Reihenfolge der Ausgabe ein:

```js
const vorhersage = ["?", "?", "?", "?"];
```

Denk an den Koch aus der Erklärung: Erst der normale Code, dann alle Microtasks in ihrer Reihenfolge, zuletzt der Timer. Prüfe deine Vorhersage danach mit **Ausführen**.

### Schritt 2: Einplanen

`einplanen(log)` schreibt drei Wörter in das Array `log`, aber zu verschiedenen Zeiten:

```js
const log = [];
einplanen(log);
log; // sofort: ["sync"]
// etwas später: ["sync", "micro", "task"]
```

So gehst du vor, und zwar genau in dieser Reihenfolge:

1. Plane mit `setTimeout(() => log.push("task"), 0)` einen Task ein.
2. Plane mit `queueMicrotask(() => log.push("micro"))` eine Microtask ein.
3. Schreibe mit `log.push("sync")` sofort ein Wort hinein.

Wichtig: Der Timer muss im Code **zuerst** stehen. Die Tests prüfen das. Trotzdem landet `"task"` zuletzt im Array, weil der Event Loop die Reihenfolge bestimmt.

### Schritt 3: Arbeit in Stücken

`zerlegen(liste, fertig)` verdoppelt jede Zahl der Liste. Jede Zahl kommt in einem **eigenen** Task dran. Wenn alle fertig sind, ruft die Funktion `fertig` mit der neuen Liste auf:

```js
zerlegen([1, 2, 3], (ergebnis) => console.log(ergebnis));
// etwas später: [2, 4, 6]
```

So gehst du vor:

1. Lege in `zerlegen` eine leere Liste `ergebnis` und einen Zähler `let i = 0` an.
2. Schreibe darin eine Funktion `schritt()`. Ist `i` so groß wie `liste.length`, ruft sie `fertig(ergebnis)` auf und hört auf.
3. Sonst legt sie `liste[i] * 2` in `ergebnis`, erhöht `i` und plant sich selbst mit `setTimeout(schritt, 0)` neu ein.
4. Starte das Ganze mit `setTimeout(schritt, 0)`.

Wichtig: `zerlegen` selbst gibt nichts zurück. Das Ergebnis kommt nur über `fertig`. Auch eine leere Liste muss am Ende `fertig([])` aufrufen.
