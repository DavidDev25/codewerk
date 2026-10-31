## Ein Objekt als Liste betrachten

:::alltag
Ein Vorratsregal mit Etiketten: „Mehl: 2“, „Zucker: 0“, „Reis: 5“. Manchmal willst du nur die Etiketten lesen, manchmal nur die Mengen zählen und manchmal beides zusammen. Für jede dieser Sichtweisen gibt es eine eigene Funktion.
:::

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };

console.log(Object.keys(vorrat));
console.log(Object.values(vorrat));
console.log(Object.entries(vorrat));
```

| Funktion | Ergebnis |
| --- | --- |
| `Object.keys(obj)` | Array der Schlüssel (Etiketten) |
| `Object.values(obj)` | Array der Werte |
| `Object.entries(obj)` | Array von Paaren `[schluessel, wert]` |

Weil das Ergebnis jeweils ein Array ist, funktionieren alle Array-Methoden:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };
const gesamt = Object.values(vorrat).reduce((summe, menge) => summe + menge, 0);
console.log(gesamt);
```

## Paare durchlaufen

Mit `for…of` und Destructuring liest sich das besonders gut:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };
for (const [sorte, menge] of Object.entries(vorrat)) {
  console.log(`${sorte}: ${menge}`);
}
```

Bei `filter` und `map` packst du das Paar direkt im Parameter aus:

```js
const vorrat = { mehl: 2, zucker: 0, reis: 5 };
const leer = Object.entries(vorrat)
  .filter(([, menge]) => menge === 0)
  .map(([sorte]) => sorte);
console.log(leer);
```

Das Komma in `[, menge]` heißt: den ersten Wert überspringen.

## Zurück zum Objekt

`Object.fromEntries` macht aus einem Array von Paaren wieder ein Objekt. So kannst du alle Werte umrechnen:

```js
const preise = { brot: 3, milch: 1.5 };
const teurer = Object.fromEntries(
  Object.entries(preise).map(([name, preis]) => [name, preis * 2])
);
console.log(teurer);
```

## Gibt es den Schlüssel?

```js
const vorrat = { mehl: 2, zucker: 0 };
console.log("zucker" in vorrat);
console.log("salz" in vorrat);
```

Achtung: `if (vorrat.zucker)` wäre hier falsch, weil `0` als falsch zählt. `in` fragt nur, ob es den Schlüssel gibt.
