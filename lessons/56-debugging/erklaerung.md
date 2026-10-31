## Fehler finden kann man lernen

Auch erfahrene Entwickler schreiben keinen fehlerfreien Code. Sie sind aber gut darin, Fehler **schnell zu finden**. Das ist kein Talent, sondern eine Methode. Diese Methode heißt **Debugging**, auf Deutsch etwa „Entwanzen“.

:::alltag
Eine Ärztin rät nicht wild herum. Sie fragt nach Beschwerden, misst Fieber, schließt Ursachen aus und grenzt Schritt für Schritt ein. Debugging funktioniert genauso.
:::

## Schritt 1: Die Fehlermeldung lesen

Eine Fehlermeldung ist ein Geschenk. Sie sagt dir, **was** passiert ist und **wo**. Im Beispiel wird eine Funktion ohne Produkt aufgerufen:

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

Ausgegeben wird „TypeError: Cannot read properties of undefined (reading 'preis')“. Übersetzt heißt das: Von `undefined` kann man keine Eigenschaft `preis` lesen. Die Meldung verrät also genau, welcher Wert gefehlt hat und wobei.

| Fehlerart | bedeutet meistens |
| --- | --- |
| `ReferenceError` | Name falsch geschrieben oder Variable nicht angelegt |
| `TypeError` | Wert hat den falschen Typ, oft `undefined` oder `null` |
| `SyntaxError` | Klammer, Komma oder Anführungszeichen fehlt |
| `RangeError` | Wert außerhalb des Erlaubten, zum Beispiel bei endloser Rekursion |

Im Reiter **Ausgabe** springst du mit einem Klick auf die Meldung zur passenden Zeile.

## Schritt 2: Werte sichtbar machen

Die meisten Fehler sind falsche **Annahmen** über einen Wert. Mach den Wert sichtbar, statt zu raten. Im Beispiel soll ein Warenkorb zusammengerechnet werden:

```js
const warenkorb = [{ name: "Brot", preis: 3 }, { name: "Milch", preis: "1.5" }];
let summe = 0;
for (const posten of warenkorb) {
  summe += posten.preis;
  console.log(posten.name, typeof posten.preis, summe);
}
console.table(warenkorb);
```

Die erste Zeile zeigt „Brot number 3“, die zweite „Milch string 31.5“. Jetzt sieht man sofort, was los ist: Der Preis der Milch ist ein **Text**. Ab da klebt `+` die Werte zusammen, statt zu rechnen. Aus 3 und „1.5“ wird „31.5“. `console.table` zeigt zum Schluss die ganze Liste auf einmal an.

## Schritt 3: Eingrenzen

- **Kleiner machen:** Rufe die Funktion mit dem einfachsten Wert auf, bei dem der Fehler noch auftritt.
- **Halbieren:** Prüfe in der Mitte des Codes, ob die Werte dort noch stimmen. Dann weißt du, in welcher Hälfte der Fehler steckt.
- **Annahmen prüfen:** `console.assert(bedingung, "Nachricht")` meldet sich nur, wenn die Bedingung **nicht** stimmt.

## Schritt 4: Erklären

Erkläre den Code Zeile für Zeile laut, einer Kollegin oder einer Quietscheente auf dem Tisch. Das nennt man scherzhaft **Rubber-Duck-Debugging**. Beim Erklären fällt die falsche Annahme oft von selbst auf.

## Werkzeuge im Browser

Jeder Browser hat Entwicklerwerkzeuge, die du mit F12 öffnest. Dort kannst du mit **Haltepunkten** das Programm an einer Zeile anhalten und dir alle Variablen ansehen. Die Anweisung `debugger;` im Code setzt so einen Haltepunkt, wenn die Werkzeuge geöffnet sind.
