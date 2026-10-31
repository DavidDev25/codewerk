## Zeit für ein eigenes Projekt

Du hast Teil 1 fast geschafft. Jetzt setzt du alles zusammen: ein digitales **Klassenbuch**, das aus den Noten einer Klasse ein kleines Zeugnis erstellt.

:::alltag
Wie beim Kochen nach vielen einzelnen Übungen (Schneiden, Anbraten, Abschmecken) zum ersten Mal ein ganzes Menü: Du kennst jeden Handgriff schon, jetzt kommt es auf die Reihenfolge an.
:::

## So gehst du vor

Große Aufgaben zerlegst du in kleine Funktionen, die je **eine** Sache gut können. Später baust du sie zusammen:

```js
const verdoppeln = (x) => x * 2;
const plusEins = (x) => x + 1;
const beides = (x) => plusEins(verdoppeln(x));
console.log(beides(5));
```

Teste jede Funktion einzeln mit `console.log`, bevor du die nächste schreibst. Dann weißt du bei einem Fehler sofort, wo er steckt.

## Was du brauchst

| Werkzeug | gelernt in |
| --- | --- |
| Funktionen, Arrow-Funktionen | Lektion 3 und 7 |
| `if` / `else if` / `else` | Lektion 4 |
| Runden mit `Math.round` | Lektion 6 |
| Template-Strings mit `${…}` | Lektion 1 |
| `map`, `reduce`, `sort` | Lektion 15 und 16 |
| Destructuring | Lektion 12 |
| Zählen in einem Objekt oder einer Map | Lektion 17 und 19 |

Auf eine Nachkommastelle rundest du so: `Math.round(wert * 10) / 10`.
