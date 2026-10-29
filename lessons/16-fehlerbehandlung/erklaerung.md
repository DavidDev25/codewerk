## Wenn etwas schiefgeht

Manchmal kann eine Funktion ihre Arbeit nicht erledigen, zum Beispiel weil ein Wert falsch ist. Dann schlägt sie mit `throw` Alarm.

:::alltag
Ein Rauchmelder piept, wenn es brennt (**throw**). Irgendwo im Haus hört ihn jemand und kümmert sich darum (**catch**). Ohne Rauchmelder würde der Fehler unbemerkt alles kaputtmachen.
:::

```js
function alterSetzen(alter) {
  if (alter < 0) {
    throw new Error("Das Alter kann nicht negativ sein.");
  }
  return alter;
}

console.log(alterSetzen(30));
```

`throw new Error("…")` beendet die Funktion **sofort**. Der Text steht später in `fehler.message`.

## Den Fehler auffangen

Mit `try … catch` sagst du: „Probier das. Wenn es einen Fehler gibt, mach stattdessen das hier.“

```js
try {
  alterSetzen(-5);
  console.log("Das wird nicht ausgegeben.");
} catch (fehler) {
  console.log("Abgefangen: " + fehler.message);
}

console.log("Das Programm läuft weiter.");
```

- Im `try`-Block steht der Code, der schiefgehen **könnte**.
- Gibt es einen Fehler, springt das Programm direkt in den `catch`-Block.
- Danach läuft alles normal weiter. Ohne `catch` würde das Programm abbrechen.
