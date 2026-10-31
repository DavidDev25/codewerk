## Eine Funktion ruft sich selbst auf

Eine Funktion darf sich selbst aufrufen. Das klingt erst einmal seltsam, ist aber ein sehr nützlicher Trick.

:::alltag
Denk an Matroschka-Puppen. Du öffnest eine Puppe, und darin steckt eine kleinere. Darin steckt wieder eine kleinere, bis du bei der kleinsten ankommst. Die lässt sich nicht mehr öffnen. So funktioniert **Rekursion**: Eine Aufgabe wird in eine kleinere Fassung derselben Aufgabe zerlegt, bis sie ganz einfach ist.
:::

Das Beispiel zählt rückwärts. `countdown` gibt eine Zahl aus und ruft sich dann mit der nächstkleineren Zahl auf:

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

Ausgegeben werden 3, 2, 1 und „Start!“. Bei `n === 0` ruft sich die Funktion nicht mehr auf. Sie gibt „Start!“ aus und hört auf.

Jede Funktion, die sich selbst aufruft, braucht zwei Teile:

1. Einen **Abbruch**: einen einfachen Fall, den sie ohne Selbstaufruf löst. Hier ist das `n === 0`.
2. Einen **Selbstaufruf** mit einer **kleineren** Aufgabe. Hier ist das `n - 1`.

Fehlt der Abbruch, ruft sich die Funktion immer weiter auf. Irgendwann bricht JavaScript mit der Meldung „Maximum call stack size exceeded“ ab. Das bedeutet: zu viele Aufrufe auf einmal.

## Mit Ergebnis

Die Funktion kann auch etwas zurückgeben. Die Summe von 1 bis 4 ist 4 plus die Summe von 1 bis 3. Genau so rechnet das Beispiel:

```js
function summeBis(n) {
  if (n <= 0) {
    return 0;
  }
  return n + summeBis(n - 1);
}

console.log(summeBis(4));
```

Heraus kommt 10. Der Rechenweg sieht so aus: `summeBis(4)` ist 4 + `summeBis(3)`. Das ist 4 + 3 + `summeBis(2)`, und so weiter bis 4 + 3 + 2 + 1 + 0. Bei 0 greift der Abbruch und liefert 0.

## Wofür Rekursion am besten passt

Für einfaches Zählen reicht auch eine Schleife. Richtig stark ist Rekursion bei Daten, die **beliebig tief** verschachtelt sind. Ein Beispiel sind Ordner mit Unterordnern, in denen wieder Unterordner stecken:

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

Heraus kommen 14 Dateien, denn 2 + 5 + 3 + 4 ergibt 14. `alleDateien` zählt die Dateien im eigenen Ordner und ruft sich dann für jeden Unterordner selbst auf. So steigt die Funktion genau so tief hinab, wie es Ebenen gibt. Mit einer einfachen Schleife wüsstest du vorher nicht, wie viele Ebenen das sind.

Den Abbruch musst du hier nicht extra hinschreiben. Ein Ordner ohne Unterordner hat eine leere Liste, und die Schleife läuft dann gar nicht.

Manchmal musst du prüfen, ob ein Wert eine Liste ist, in der du weitersuchen musst. Das geht mit `Array.isArray(wert)`. Es ergibt `true` für Arrays und `false` für alles andere.
