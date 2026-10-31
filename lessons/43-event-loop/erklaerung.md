## Ein Koch, viele Aufträge

JavaScript kann immer nur **eine** Sache gleichzeitig tun. Trotzdem warten Programme auf Timer, Klicks und Server. Wie das zusammenpasst, regelt der **Event Loop**, auf Deutsch etwa „Ereignis-Schleife“.

:::alltag
Ein Koch steht allein in der Küche. Er kocht immer ein Gericht zu Ende, bevor er etwas Neues anfängt. Neben ihm liegen zwei Zettelstapel. Auf dem **eiligen** Stapel stehen Kleinigkeiten wie „noch schnell nachwürzen“. Auf dem **normalen** Stapel stehen neue Aufträge wie „Timer abgelaufen“ oder „nächster Gast“. Nach jedem Gericht arbeitet er zuerst den **ganzen** eiligen Stapel ab. Erst dann nimmt er einen normalen Zettel.
:::

In JavaScript heißen die eiligen Zettel **Microtasks** und die normalen **Tasks**. Im Beispiel kommen alle drei Arten von Code vor:

```js
console.log("A: normaler Code");

setTimeout(() => console.log("B: Timer (Task)"), 0);

Promise.resolve().then(() => console.log("C: then (Microtask)"));

queueMicrotask(() => console.log("D: queueMicrotask (Microtask)"));

console.log("E: normaler Code");
```

Ausgegeben wird in der Reihenfolge A, E, C, D, B:

1. Zuerst läuft der **ganze normale Code** bis zum Ende. Das sind A und E.
2. Dann laufen **alle Microtasks**, in der Reihenfolge, in der sie eingeplant wurden. Das sind C und D. Dazu gehören alle `then`-Callbacks und alles, was nach einem `await` steht.
3. Erst dann kommt der nächste **Task**, hier der Timer B. Auch `setTimeout` mit 0 Millisekunden wartet also, bis alles andere erledigt ist.

| Stapel | Was kommt hinein |
| --- | --- |
| Aufrufstapel | der Code, der gerade läuft |
| Microtasks | `then`, `catch`, `finally`, Code nach `await`, `queueMicrotask` |
| Tasks | `setTimeout`, `setInterval`, Klicks und andere Ereignisse, Antworten aus dem Netz |

## Warum das wichtig ist

Solange normaler Code läuft, kann **nichts anderes** passieren. Klicks werden nicht verarbeitet, und im Browser friert die Seite ein. Eine Schleife, die drei Sekunden rechnet, blockiert alles für drei Sekunden.

Lange Arbeit teilt man deshalb in kleine Stücke. Jedes Stück plant man mit `setTimeout` als eigenen Task ein. Dazwischen kann der Browser Klicks verarbeiten und die Seite neu zeichnen. Im Beispiel wird in Stücken von je 1000 gezählt:

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

Zuerst erscheint „Der Rest des Programms läuft sofort weiter.“ und danach „Fertig gezählt bis 5000“. Das erste Stück läuft sofort, die übrigen vier kommen jeweils als eigener Task dran. Zwischen den Stücken ist das Programm frei für anderes.
