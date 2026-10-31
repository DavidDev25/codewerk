## Computer rechnen nicht immer exakt

In Lektion 6 hast du gesehen: `0.1 + 0.2` ergibt nicht genau `0.3`. Das ist kein Fehler von JavaScript, sondern liegt daran, wie fast alle Programmiersprachen Kommazahlen speichern: im **Zweiersystem** und mit begrenzt vielen Stellen.

:::alltag
Versuche, ein Drittel als Dezimalzahl aufzuschreiben: 0,3333… Irgendwann musst du aufhören, und dann stimmt es nicht mehr ganz. Dem Computer geht es mit 0,1 genauso, nur eben im Zweiersystem.
:::

```js
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON);
```

**Regel:** Kommazahlen nie mit `===` vergleichen. Prüfe stattdessen, ob der Abstand winzig ist. `Number.EPSILON` ist der kleinste Unterschied, den JavaScript bei Zahlen um 1 herum überhaupt darstellen kann.

## Geld in Cent

Bei Geld darf kein Cent verloren gehen. Deshalb rechnen Programme intern mit **ganzen Cent** und wandeln erst für die Anzeige um:

```js
const preisCent = Math.round(19.99 * 100);
const summeCent = preisCent * 3;
console.log(summeCent, (summeCent / 100).toFixed(2));
```

`Math.round` ist wichtig: `19.99 * 100` ergibt nämlich `1998.9999999999998`.

## Die Grenze der ganzen Zahlen

Auch ganze Zahlen sind nur bis zu einer Grenze exakt:

```js
console.log(Number.MAX_SAFE_INTEGER);
console.log(9007199254740992 === 9007199254740993);
console.log(Number.isSafeInteger(9007199254740993));
```

Über `Number.MAX_SAFE_INTEGER` (gut 9 Billiarden) hinaus verschluckt JavaScript Ziffern. Das betrifft zum Beispiel sehr große IDs aus Datenbanken.

## BigInt: beliebig große ganze Zahlen

Mit einem `n` am Ende entsteht ein **BigInt**. Er rechnet mit ganzen Zahlen beliebiger Größe exakt:

```js
const gross = 9007199254740993n;
console.log(gross + 2n);
console.log(2n ** 100n);
console.log(BigInt("123456789012345678901234567890") * 2n);
console.log(typeof 10n);
```

- `BigInt("…")` macht aus einem Text einen BigInt, ohne dass unterwegs Ziffern verloren gehen.
- BigInt und normale Zahlen lassen sich **nicht mischen**: `10n + 1` wirft einen Fehler. Wandle vorher um: `10n + BigInt(1)`.
- Division schneidet ab: `7n / 2n` ist `3n`. Kommazahlen kann BigInt nicht.
- `.toString()` macht wieder einen Text daraus.
