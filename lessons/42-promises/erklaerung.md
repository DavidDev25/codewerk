## Ein Versprechen für später

Manche Dinge dauern: Daten aus dem Internet laden, eine Datei lesen, auf eine Antwort warten. Dann liefert eine Funktion das Ergebnis nicht sofort. Sie gibt stattdessen ein **Promise** zurück. Das ist englisch und heißt „Versprechen“: Das Ergebnis kommt noch.

:::alltag
In der Reinigung gibst du deinen Mantel ab und bekommst einen **Abholschein**. Der Schein ist noch nicht der Mantel, aber das Versprechen darauf. Später ist der Mantel entweder fertig, das ist **resolve**. Oder es ist etwas schiefgegangen, zum Beispiel ging ein Fleck nicht raus. Das ist **reject**.
:::

## Ein Promise erstellen

Im Beispiel dauert das Backen 300 Millisekunden. Muffins gelingen immer, die Torte brennt an:

```js
function backen(kuchen) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (kuchen === "Torte") {
        reject(new Error("Die Torte ist leider angebrannt."));
      } else {
        resolve(kuchen + " ist fertig!");
      }
    }, 300);
  });
}

console.log(backen("Muffin"));
```

`new Promise` bekommt eine Funktion mit zwei Werkzeugen. Eines davon rufst du auf, sobald das Ergebnis feststeht:

- `resolve(wert)` sagt: Das Versprechen ist **erfüllt**, und das hier ist das Ergebnis.
- `reject(fehler)` sagt: Das Versprechen ist **gebrochen**, und das hier ist der Fehler.

Die Ausgabe zeigt nur `Promise {}`. Das ist der Abholschein, noch nicht der Text. Der Text entsteht erst 300 Millisekunden später.

## Das Ergebnis abholen

Mit `.then` und `.catch` sagst du, was passieren soll, wenn das Ergebnis da ist. Im Beispiel wird ein Muffin und eine Torte gebacken:

```js
function backen(kuchen) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (kuchen === "Torte") reject(new Error("Die Torte ist leider angebrannt."));
      else resolve(kuchen + " ist fertig!");
    }, 300);
  });
}

backen("Muffin").then((text) => console.log(text));

backen("Torte")
  .then((text) => console.log(text))
  .catch((fehler) => console.log("Oh nein: " + fehler.message));

console.log("Der Ofen läuft …");
```

Zuerst erscheint „Der Ofen läuft …“, weil das Programm nicht auf den Ofen wartet. Danach kommen „Muffin ist fertig!“ und „Oh nein: Die Torte ist leider angebrannt.“.

- `.then(callback)` läuft, wenn das Promise erfüllt ist. Der Callback bekommt das Ergebnis.
- `.catch(callback)` läuft, wenn das Promise gebrochen wurde. Der Callback bekommt den Fehler.
- Ein `reject` **ohne** `catch` endet als Fehler. Codewerk zeigt ihn dir dann an.

Im **Diagramm** siehst du am Ende, was in deinen Variablen steht.
