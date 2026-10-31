## Was ist in der Nacht passiert?

Jeder Server schreibt ein **Logbuch**: eine Textdatei, in der jede Zeile ein Ereignis beschreibt. Wenn morgens etwas nicht funktioniert, liest man dort nach. Bei Tausenden Zeilen macht das niemand von Hand, sondern ein kleines Programm.

```text
2026-10-31 02:14 INFO Sicherung gestartet
2026-10-31 02:15 FEHLER Datenbank nicht erreichbar
2026-10-31 02:16 WARNUNG Wiederholung 1 von 3
```

Jede Zeile hat denselben Aufbau: Datum, Uhrzeit, Stufe (`INFO`, `WARNUNG` oder `FEHLER`) und eine Nachricht. Manche Zeilen sind kaputt oder leer. Die müssen übersprungen werden.

## Was du brauchst

| Werkzeug | gelernt in |
| --- | --- |
| RegEx mit Gruppen, `match` | Lektion 51 |
| Generator mit `function*` und `yield` | Lektion 49 |
| `Intl.DateTimeFormat` | Lektion 52 |
| Map oder Objekt zum Zählen | Lektion 20 und 22 |
| Destructuring | Lektion 13 |

Mit einer Gruppe in `match` bekommst du die Teile einer Zeile auf einmal. Destructuring macht das besonders lesbar:

```js
const zeile = "2026-10-31 02:15 FEHLER Datenbank nicht erreichbar";
const treffer = zeile.match(/^(\S+) (\S+) (\S+) (.+)$/);
const [, datum, zeit, stufe, text] = treffer;
console.log({ datum, zeit, stufe, text });
```

Das Komma ganz vorne überspringt den ersten Eintrag. Dort steht der komplette Treffer.

:::alltag
Wie ein Detektiv mit einem Stapel Notizzettel: erst jeden Zettel lesbar machen, dann die wichtigen heraussuchen, dann zählen und am Ende einen kurzen Bericht schreiben. Genau in dieser Reihenfolge baust du die Funktionen.
:::
