## Computer rechnen nicht immer exakt

In Lektion 6 hast du gesehen, dass `0.1 + 0.2` nicht genau `0.3` ergibt. Das ist kein Fehler von JavaScript. Fast alle Programmiersprachen speichern Kommazahlen im Zweiersystem und mit begrenzt vielen Stellen. Manche Zahlen passen da einfach nicht exakt hinein.

:::alltag
Versuche, ein Drittel als Dezimalzahl aufzuschreiben: 0,3333… Irgendwann musst du aufhören, und dann stimmt es nicht mehr ganz. Dem Computer geht es mit 0,1 genauso, nur eben im Zweiersystem.
:::

```js
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON);
```

Die Ausgabe ist `0.30000000000000004`, dann `false` und dann `true`. Der direkte Vergleich mit `===` schlägt fehl, weil die beiden Zahlen ganz minimal verschieden sind.

Deshalb gilt: Vergleiche Kommazahlen nie mit `===`. Prüfe stattdessen, ob ihr Abstand winzig ist. Das macht die dritte Zeile. `Math.abs` rechnet den Abstand aus, und `Number.EPSILON` ist ein sehr kleiner Wert, unter dem JavaScript zwei Zahlen um 1 herum nicht mehr unterscheiden kann.

## Geld in Cent

Bei Geld darf kein Cent verloren gehen. Deshalb rechnen viele Programme intern mit ganzen Cent und wandeln erst für die Anzeige wieder in Euro um:

```js
const preisCent = Math.round(19.99 * 100);
const summeCent = preisCent * 3;
console.log(summeCent, (summeCent / 100).toFixed(2));
```

Die Ausgabe ist `5997 59.97`. Das `Math.round` ist dabei wichtig: `19.99 * 100` ergibt nämlich `1998.9999999999998`. Erst das Runden macht daraus die ganze Zahl 1999.

## Die Grenze der ganzen Zahlen

Auch ganze Zahlen sind nicht unendlich genau. Ab einer bestimmten Größe verschluckt JavaScript Ziffern:

```js
console.log(Number.MAX_SAFE_INTEGER);
console.log(9007199254740992 === 9007199254740993);
console.log(Number.isSafeInteger(9007199254740993));
```

Die erste Zeile zeigt die Grenze: gut 9 Billiarden. Die zweite Zeile ergibt `true`, obwohl die Zahlen verschieden sind. JavaScript kann sie schlicht nicht mehr auseinanderhalten. `Number.isSafeInteger` prüft, ob eine Zahl noch im sicheren Bereich liegt, und sagt hier `false`.

Das betrifft zum Beispiel sehr große Nummern aus Datenbanken.

## BigInt: ganze Zahlen ohne Grenze

Für solche Fälle gibt es **BigInt**. Du erkennst ihn an einem `n` hinter der Zahl. Ein BigInt rechnet mit ganzen Zahlen beliebiger Größe exakt:

```js
const gross = 9007199254740993n;
console.log(gross + 2n);
console.log(2n ** 100n);
console.log(BigInt("123456789012345678901234567890") * 2n);
console.log(typeof 10n);
```

Alle Ergebnisse stimmen auf die letzte Stelle, und `typeof` meldet `bigint`. Ein paar Regeln:

- `BigInt("…")` macht aus einem Text einen BigInt, ohne dass unterwegs Ziffern verloren gehen.
- Du darfst BigInt und normale Zahlen nicht mischen. `10n + 1` wirft einen Fehler. Schreib stattdessen `10n + 1n` oder `10n + BigInt(1)`.
- Beim Teilen fällt der Rest weg: `7n / 2n` ist `3n`. Kommazahlen kann BigInt nicht.
- Mit `.toString()` wird wieder ein Text daraus.
