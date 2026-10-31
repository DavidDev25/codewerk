## Fehler finden ist eine Fähigkeit

Profis schreiben nicht fehlerfreien Code. Sie sind aber gut darin, Fehler **schnell zu finden**. Das ist kein Talent, sondern eine Methode.

:::alltag
Ein Arzt rät nicht wild herum. Er fragt nach Symptomen, misst Fieber, schließt Ursachen aus und grenzt Schritt für Schritt ein. Debugging funktioniert genauso.
:::

## 1. Die Fehlermeldung lesen

Eine Fehlermeldung ist ein Geschenk. Sie sagt dir **was** passiert ist und **wo**:

```js
function preisVon(produkt) {
  return produkt.preis * 2;
}
try {
  preisVon(undefined);
} catch (fehler) {
  console.log(fehler.name + ": " + fehler.message);
}
```

| Fehlerart | bedeutet meist |
| --- | --- |
| `ReferenceError` | Name falsch geschrieben oder Variable nicht angelegt |
| `TypeError` | Wert hat den falschen Typ, oft `undefined` oder `null` |
| `SyntaxError` | Klammer, Komma oder Anführungszeichen fehlt |
| `RangeError` | Wert außerhalb des Erlaubten, z. B. endlose Rekursion |

Im Reiter **Ausgabe** springst du mit einem Klick zur Zeile.

## 2. Werte sichtbar machen

Die meisten Fehler sind falsche **Annahmen** über einen Wert. Mach den Wert sichtbar, statt zu raten:

```js
const warenkorb = [{ name: "Brot", preis: 3 }, { name: "Milch", preis: "1.5" }];
let summe = 0;
for (const posten of warenkorb) {
  summe += posten.preis;
  console.log(posten.name, typeof posten.preis, summe);
}
console.table(warenkorb);
```

Hier sieht man sofort: Der Preis der Milch ist ein **Text**, und ab da wird geklebt statt gerechnet.

## 3. Eingrenzen

- **Kleiner machen:** Rufe die Funktion mit dem einfachsten Wert auf, der den Fehler noch zeigt.
- **Halbieren:** Prüfe in der Mitte des Codes, ob die Werte dort noch stimmen. So weißt du, in welcher Hälfte der Fehler steckt.
- **Annahmen prüfen:** `console.assert(bedingung, "Nachricht")` meldet sich nur, wenn die Bedingung **nicht** stimmt.

## 4. Erklären

Erkläre den Code Zeile für Zeile laut, einer Kollegin oder einer Quietscheente auf dem Tisch („Rubber-Duck-Debugging“). Beim Erklären fällt die falsche Annahme oft von selbst auf.

## Werkzeuge im Browser

In den Entwicklerwerkzeugen jedes Browsers (F12) kannst du mit **Haltepunkten** das Programm an einer Zeile anhalten und alle Variablen ansehen. Die Anweisung `debugger;` im Code setzt so einen Haltepunkt, wenn die Werkzeuge geöffnet sind.
