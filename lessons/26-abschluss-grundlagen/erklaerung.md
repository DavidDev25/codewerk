## Zeit für ein eigenes Projekt

Du hast Teil 1 fast geschafft. Jetzt setzt du alles zusammen. Du baust ein digitales **Klassenbuch**, das aus den Noten einer Klasse ein kleines Zeugnis erstellt.

:::alltag
Es ist wie beim Kochen. Lange hast du einzelne Handgriffe geübt: schneiden, anbraten, abschmecken. Jetzt kochst du zum ersten Mal ein ganzes Menü. Jeden Handgriff kennst du schon. Neu ist nur, dass du sie in der richtigen Reihenfolge zusammensetzt.
:::

## Große Aufgaben in kleine Funktionen zerlegen

Eine große Aufgabe löst du am besten mit mehreren kleinen Funktionen. Jede kann genau **eine** Sache. Danach baust du sie zusammen. Das Beispiel zeigt die Idee im Kleinen:

```js
const verdoppeln = (x) => x * 2;
const plusEins = (x) => x + 1;
const beides = (x) => plusEins(verdoppeln(x));
console.log(beides(5));
```

Heraus kommt 11. `beides` benutzt die beiden kleinen Funktionen: Erst wird die 5 zu 10 verdoppelt, dann kommt 1 dazu.

Teste jede Funktion einzeln mit `console.log`, bevor du die nächste schreibst. Wenn dann etwas nicht stimmt, weißt du sofort, wo der Fehler steckt.

## Was du brauchst

Alle Werkzeuge für das Klassenbuch hast du schon kennengelernt:

| Werkzeug | gelernt in |
| --- | --- |
| Funktionen und Arrow-Funktionen | Lektion 3 und 8 |
| `if`, `else if` und `else` | Lektion 4 |
| Runden mit `Math.round` | Lektion 6 |
| Template-Strings mit `${…}` | Lektion 1 |
| `map`, `reduce` und `sort` | Lektion 17 und 18 |
| Destructuring | Lektion 13 |
| Zählen in einem Objekt oder einer Map | Lektion 20 und 22 |

Auf eine Nachkommastelle rundest du so: `Math.round(wert * 10) / 10`. Aus 1,666… wird erst 16,66…, gerundet 17 und geteilt durch 10 wieder 1,7.
