## Wenn etwas schiefgeht

Manchmal kann eine Funktion ihre Arbeit nicht erledigen, zum Beispiel weil sie einen falschen Wert bekommt. Dann schlägt sie Alarm. Das machst du mit `throw`.

:::alltag
Ein Rauchmelder piept, wenn es brennt. Das ist **throw**. Irgendwo im Haus hört ihn jemand und kümmert sich darum. Das ist **catch**. Ohne Rauchmelder würde der Fehler unbemerkt alles kaputtmachen.
:::

Im Beispiel lehnt eine Funktion ein negatives Alter ab:

```js
function alterSetzen(alter) {
  if (alter < 0) {
    throw new Error("Das Alter kann nicht negativ sein.");
  }
  return alter;
}

console.log(alterSetzen(30));
```

Ausgegeben wird 30, denn 30 ist ein gültiges Alter. Bei einem negativen Wert würde `throw new Error("…")` die Funktion **sofort** beenden. Der Text in der Klammer ist die Fehlermeldung. Du findest ihn später in `fehler.message`.

## Den Fehler auffangen

Mit `try` und `catch` sagst du: „Probier das. Wenn es einen Fehler gibt, mach stattdessen das hier.“ Im Beispiel wird die Funktion mit -5 aufgerufen:

```js
function alterSetzen(alter) {
  if (alter < 0) {
    throw new Error("Das Alter kann nicht negativ sein.");
  }
  return alter;
}

try {
  alterSetzen(-5);
  console.log("Das wird nicht ausgegeben.");
} catch (fehler) {
  console.log("Abgefangen: " + fehler.message);
}

console.log("Das Programm läuft weiter.");
```

Ausgegeben werden „Abgefangen: Das Alter kann nicht negativ sein.“ und „Das Programm läuft weiter.“. Die Zeile nach `alterSetzen(-5)` wird übersprungen, weil der Fehler das Programm direkt in den `catch`-Block springen lässt.

- Im `try`-Block steht der Code, der schiefgehen **könnte**.
- Gibt es dort einen Fehler, springt das Programm sofort in den `catch`-Block. `fehler` ist dann der Fehler, den `throw` geworfen hat.
- Danach läuft alles normal weiter. Ohne `catch` würde das Programm abbrechen.
