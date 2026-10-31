## Eine Funktion ruft sich selbst

:::alltag
Matroschka-Puppen: Du öffnest eine Puppe, darin steckt eine kleinere, darin wieder eine kleinere, bis du bei der kleinsten ankommst, die sich nicht mehr öffnen lässt. **Rekursion** funktioniert genauso: Eine Aufgabe wird in eine kleinere Version derselben Aufgabe zerlegt, bis sie ganz einfach ist.
:::

```js
function countdown(n) {
  if (n === 0) {
    console.log("Start!");
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(3);
```

Jede rekursive Funktion braucht zwei Teile:

1. **Abbruch**: Ein einfacher Fall, der ohne Selbstaufruf gelöst wird (hier `n === 0`).
2. **Selbstaufruf** mit einer **kleineren** Aufgabe (hier `n - 1`).

Fehlt der Abbruch, ruft sich die Funktion endlos selbst auf, bis JavaScript mit „Maximum call stack size exceeded“ abbricht.

## Mit Ergebnis

Die Summe von 1 bis n ist n plus die Summe von 1 bis n − 1:

```js
function summeBis(n) {
  if (n <= 0) {
    return 0;
  }
  return n + summeBis(n - 1);
}

console.log(summeBis(4));
```

`summeBis(4)` rechnet 4 + `summeBis(3)` = 4 + 3 + `summeBis(2)` = … = 4 + 3 + 2 + 1 + 0.

## Wo Rekursion glänzt: verschachtelte Daten

Für einfache Zählaufgaben reicht eine Schleife. Ihre Stärke spielt Rekursion bei Daten aus, die **beliebig tief** verschachtelt sind, zum Beispiel Ordner mit Unterordnern:

```js
const projekt = {
  name: "projekt",
  dateien: 2,
  unterordner: [
    { name: "bilder", dateien: 5, unterordner: [] },
    { name: "code", dateien: 3, unterordner: [
      { name: "tests", dateien: 4, unterordner: [] },
    ] },
  ],
};

function alleDateien(ordner) {
  let summe = ordner.dateien;
  for (const unter of ordner.unterordner) {
    summe += alleDateien(unter);
  }
  return summe;
}

console.log(alleDateien(projekt));
```

Mit einer einfachen Schleife wüsstest du nicht, wie viele Ebenen es gibt. Die Rekursion steigt einfach so tief hinab, wie nötig. Der Abbruch passiert hier von selbst: Ein Ordner ohne Unterordner ruft niemanden mehr auf.

Ob etwas ein Array ist, prüfst du mit `Array.isArray(wert)`.
