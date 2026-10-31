## Was ist in der Nacht passiert?

Jeder Server schreibt ein **Logbuch**. Das ist eine Textdatei, in der jede Zeile ein Ereignis beschreibt. Wenn morgens etwas nicht funktioniert, liest man dort nach. Bei Tausenden Zeilen macht das niemand von Hand, sondern ein kleines Programm. Genau so eins baust du jetzt.

So sehen ein paar Zeilen aus:

```text
2026-10-31 02:14 INFO Sicherung gestartet
2026-10-31 02:15 FEHLER Datenbank nicht erreichbar
2026-10-31 02:16 WARNUNG Wiederholung 1 von 3
```

Jede Zeile hat denselben Aufbau: Datum, Uhrzeit, Stufe und eine Nachricht. Die Stufe ist `INFO`, `WARNUNG` oder `FEHLER`. Manche Zeilen sind kaputt oder leer. Die muss dein Programm überspringen.

:::alltag
Du bist wie ein Detektiv mit einem Stapel Notizzettel. Erst machst du jeden Zettel lesbar, dann suchst du die wichtigen heraus, dann zählst du, und am Ende schreibst du einen kurzen Bericht. Genau in dieser Reihenfolge baust du die Funktionen.
:::

## Was du brauchst

| Werkzeug | gelernt in |
| --- | --- |
| reguläre Ausdrücke mit Gruppen und `match` | Lektion 51 |
| Generator mit `function*` und `yield` | Lektion 49 |
| `Intl.DateTimeFormat` | Lektion 52 |
| Zählen in einem Objekt oder einer Map | Lektion 20 und 22 |
| Destructuring | Lektion 13 |

## Eine Zeile zerlegen

Mit Gruppen in `match` bekommst du alle Teile einer Zeile auf einmal. Mit Destructuring packst du sie gleich in Variablen:

```js
const zeile = "2026-10-31 02:15 FEHLER Datenbank nicht erreichbar";
const treffer = zeile.match(/^(\S+) (\S+) (\S+) (.+)$/);
const [, datum, zeit, stufe, text] = treffer;
console.log({ datum, zeit, stufe, text });
```

Heraus kommt `{ datum: "2026-10-31", zeit: "02:15", stufe: "FEHLER", text: "Datenbank nicht erreichbar" }`. `\S+` passt auf alles bis zum nächsten Leerzeichen. Die letzte Gruppe `(.+)` nimmt den ganzen Rest der Zeile, auch mit Leerzeichen.

Das Komma ganz vorne in `[, datum, …]` überspringt den ersten Eintrag. Dort steht der komplette Treffer, den du nicht brauchst.
