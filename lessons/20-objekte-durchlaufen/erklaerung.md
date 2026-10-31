## Ein Objekt als Liste betrachten

Arrays haben viele praktische Methoden wie `map` und `filter`. Objekte haben sie nicht. Du kannst ein Objekt aber in eine Liste verwandeln und dann mit allen Array-Methoden weiterarbeiten.

:::alltag
Denk an ein Vorratsregal mit Etiketten: „Mehl: 2“, „Zucker: 0“, „Reis: 5“. Manchmal willst du nur die Etiketten lesen. Manchmal willst du nur die Mengen zählen. Und manchmal brauchst du beides zusammen.
:::

Für jede dieser Sichtweisen gibt es eine eigene Funktion. Das Beispiel wendet alle drei auf denselben Vorrat an:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };

console.log(Object.keys(vorrat));
console.log(Object.values(vorrat));
console.log(Object.entries(vorrat));
```

`Object.keys` liefert die Etiketten: `["mehl", "zucker", "reis"]`. `Object.values` liefert nur die Mengen: `[2, 0, 5]`. `Object.entries` liefert beides als Paare. Jedes Paar ist eine kleine Liste aus Schlüssel und Wert, zum Beispiel `["mehl", 2]`.

| Funktion | Ergebnis |
| --- | --- |
| `Object.keys(obj)` | Liste der Schlüssel, also der Etiketten |
| `Object.values(obj)` | Liste der Werte |
| `Object.entries(obj)` | Liste von Paaren aus Schlüssel und Wert |

Weil das Ergebnis jedes Mal eine Liste ist, kannst du direkt weiterrechnen. Hier zählst du mit `reduce` alle Mengen zusammen:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };
const gesamt = Object.values(vorrat).reduce((summe, menge) => summe + menge, 0);
console.log(gesamt);
```

Heraus kommt 7, denn 2 + 0 + 5 ergibt 7.

## Paare durchlaufen

Mit `for…of` gehst du alle Paare nacheinander durch. Mit `[sorte, menge]` packst du jedes Paar gleich in zwei Variablen aus, so wie beim Destructuring in Lektion 13:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };
for (const [sorte, menge] of Object.entries(vorrat)) {
  console.log(`${sorte}: ${menge}`);
}
```

Ausgegeben werden drei Zeilen: „mehl: 2“, „zucker: 0“ und „reis: 5“.

Auch bei `filter` und `map` kannst du das Paar direkt in der Klammer der Funktion auspacken. Hier suchst du alle Sorten, von denen nichts mehr da ist:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };
const leer = Object.entries(vorrat)
  .filter(([, menge]) => menge === 0)
  .map(([sorte]) => sorte);
console.log(leer);
```

Heraus kommt `["zucker"]`. `filter` behält nur das Paar mit der Menge 0, und `map` macht daraus die Sorte. Das Komma vorne in `[, menge]` überspringt den ersten Wert. Die Sorte brauchst du beim Filtern nämlich nicht.

## Vom Paar zurück zum Objekt

`Object.fromEntries` macht es umgekehrt: Aus einer Liste von Paaren wird wieder ein Objekt. Damit kannst du alle Werte eines Objekts umrechnen. Im Beispiel werden alle Preise verdoppelt:

```js
const preise = { brot: 3, milch: 1.5 };
const teurer = Object.fromEntries(
  Object.entries(preise).map(([name, preis]) => [name, preis * 2])
);
console.log(teurer);
```

Die Ausgabe ist `{ brot: 6, milch: 3 }`. Der Weg hat drei Schritte: Du zerlegst das Objekt in Paare, rechnest jedes Paar mit `map` um und machst aus den Paaren wieder ein Objekt. `preise` selbst bleibt dabei unverändert.

## Prüfen, ob es einen Schlüssel gibt

Mit `in` fragst du, ob ein Objekt einen bestimmten Schlüssel hat:

```js
const vorrat = { mehl: 2, zucker: 0 };
console.log("zucker" in vorrat);
console.log("salz" in vorrat);
```

Die erste Zeile gibt `true` aus, obwohl die Menge 0 ist. Die zweite gibt `false` aus, weil es den Schlüssel `salz` gar nicht gibt.

Wichtig: `if (vorrat.zucker)` wäre hier ein Fehler. Die 0 zählt als falsch, also sähe es so aus, als gäbe es keinen Zucker. `in` fragt nur nach dem Schlüssel, nicht nach dem Wert.
