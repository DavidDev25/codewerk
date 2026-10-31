## Ein Koch, viele Aufträge

JavaScript hat nur **einen** Faden (Thread): Es kann immer nur eine Sache gleichzeitig tun. Trotzdem warten Programme auf Timer, Klicks und Server. Wie das zusammenpasst, regelt der **Event Loop**.

:::alltag
Ein Koch allein in der Küche. Er kocht immer ein Gericht zu Ende, bevor er etwas Neues anfängt. Neben ihm liegen zwei Zettelstapel: ein **eiliger** (Microtasks: „noch schnell nachwürzen“) und ein **normaler** (Tasks: „Timer abgelaufen, nächster Gast“). Nach jedem Gericht arbeitet er zuerst den **ganzen** eiligen Stapel ab und nimmt erst dann einen normalen Zettel.
:::

```js
console.log("A: normaler Code");

setTimeout(() => console.log("B: Timer (Task)"), 0);

Promise.resolve().then(() => console.log("C: then (Microtask)"));

queueMicrotask(() => console.log("D: queueMicrotask (Microtask)"));

console.log("E: normaler Code");
```

Die Reihenfolge ist A, E, C, D, B:

1. Zuerst läuft der **ganze normale Code** bis zum Ende (A, E).
2. Dann **alle Microtasks**, in der Reihenfolge, in der sie eingeplant wurden (C, D). Dazu gehören alle `then`-Callbacks und alles nach einem `await`.
3. Erst dann der nächste **Task**, zum Beispiel ein abgelaufener Timer (B). Auch `setTimeout(…, 0)` wartet also, bis alles andere erledigt ist.

| Stapel | Was kommt hinein |
| --- | --- |
| Aufrufstapel | der gerade laufende Code |
| Microtasks | `then`, `catch`, `finally`, Code nach `await`, `queueMicrotask` |
| Tasks | `setTimeout`, `setInterval`, Klicks und andere Events, Netzwerk-Antworten |

## Warum das wichtig ist

Solange normaler Code läuft, kann **nichts anderes** passieren: Keine Klicks werden verarbeitet, im Browser friert die Seite ein. Eine Schleife, die drei Sekunden rechnet, blockiert alles für drei Sekunden.

Lange Arbeit teilt man deshalb in kleine Stücke und plant jedes Stück mit `setTimeout` als eigenen Task ein. Dazwischen kann der Browser Klicks verarbeiten und die Seite neu zeichnen:

```js
function zaehlenInStuecken(bis, fertig) {
  let i = 0;
  function stueck() {
    const ende = Math.min(i + 1000, bis);
    while (i < ende) i++;
    if (i < bis) setTimeout(stueck, 0);
    else fertig(i);
  }
  stueck();
}

zaehlenInStuecken(5000, (n) => console.log("Fertig gezählt bis", n));
console.log("Der Rest des Programms läuft sofort weiter.");
```
