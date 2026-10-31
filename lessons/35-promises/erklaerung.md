## Ein Versprechen für später

Manche Dinge dauern: Daten aus dem Internet laden, eine Datei lesen, auf eine Antwort warten. Statt das Ergebnis sofort zu liefern, gibt eine Funktion dann ein **Promise** zurück – ein Versprechen: „Das Ergebnis kommt noch.“

:::alltag
In der Reinigung gibst du deinen Mantel ab und bekommst einen **Abholschein**. Der Schein ist noch nicht der Mantel – aber das Versprechen darauf. Später ist der Mantel entweder fertig (**resolve**) oder es ist etwas schiefgegangen, z. B. ein Fleck ging nicht raus (**reject**).
:::

## Ein Promise erstellen

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

- `resolve(wert)` – das Versprechen ist **erfüllt**, mit diesem Ergebnis.
- `reject(fehler)` – das Versprechen ist **gebrochen**, mit diesem Fehler.

Die Ausgabe zeigt nur `Promise {}` – das Versprechen selbst, noch nicht den Text. Der kommt erst später.

## Das Ergebnis abholen

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

- `.then(callback)` läuft, wenn das Promise erfüllt ist. Der Callback bekommt das Ergebnis.
- `.catch(callback)` läuft, wenn es abgelehnt wurde. Der Callback bekommt den Fehler.
- Ein `reject` **ohne** `catch` endet als Fehler – Codewerk zeigt ihn dir dann an.

Im **Diagramm** siehst du am Ende, was in deinen Variablen steht.
