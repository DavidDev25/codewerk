## Die Seite reagiert

Bisher lief dein Code einmal von oben nach unten und war dann fertig. Interaktive Seiten warten dagegen auf etwas: einen Klick, eine Eingabe oder einen Tastendruck. So etwas heißt **Event**, auf Deutsch „Ereignis“.

:::alltag
Denk an eine Türklingel. Du stehst nicht die ganze Zeit an der Tür und schaust nach. Du hängst eine Klingel auf, und **wenn** jemand drückt, klingelt es. `addEventListener` hängt die Klingel auf. Die Funktion, die du mitgibst, ist das, was beim Klingeln passiert.
:::

Im Beispiel bekommt der Knopf **+1** eine Klingel:

```js
const knopf = document.querySelector("#plus");

knopf.addEventListener("click", () => {
  console.log("Geklickt!");
});

console.log("Klingel hängt.");
```

Beim Ausführen erscheint nur „Klingel hängt.“. Die Funktion im Listener läuft erst, wenn wirklich jemand klickt. Wechsle zur **Vorschau** und klicke auf **+1**. Bei jedem Klick erscheint „Geklickt!“ im Reiter **Ausgabe**.

- Der erste Wert ist die **Art** des Events, zum Beispiel `"click"`, `"input"`, `"keydown"` oder `"submit"`.
- Der zweite ist die Funktion, die bei jedem Event aufgerufen wird. Das ist ein Callback wie in Lektion 41.

## Das Event-Objekt

Die Funktion bekommt ein Objekt mit Angaben zum Event. `event.target` ist das Element, auf dem das Event passiert ist. Im Beispiel liest du bei jeder Eingabe den Inhalt des Namensfeldes:

```js
const feld = document.querySelector("#name");
feld.addEventListener("input", (event) => {
  console.log("Jetzt steht da:", event.target.value);
});
```

Tippst du in der Vorschau „Lea“, erscheinen nacheinander „L“, „Le“ und „Lea“. Das `input`-Event kommt nämlich bei **jedem** Tastendruck. Den Inhalt eines Eingabefeldes liest du mit `.value`.

## Ein Listener für viele

Events steigen nach oben auf, wie Blasen im Wasser. Ein Klick auf ein `<li>` ist deshalb auch ein Klick auf die `<ul>` darum herum. Statt jedem Eintrag eine eigene Klingel zu geben, hängst du **eine** an die Liste. Das nennt man **Event-Delegation**:

```js
const liste = document.querySelector("#farben");
liste.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  console.log("Gewählt:", li.dataset.farbe);
});
```

Klickst du in der Vorschau auf „Grün“, erscheint „Gewählt: grün“. Die Farbe kommt aus dem Attribut `data-farbe` des Eintrags.

- `event.target.closest("li")` sucht vom angeklickten Element aus nach oben das nächste `<li>`.
- Klickt jemand zwischen die Einträge, gibt es kein `<li>`. Dann hört die Funktion mit `return` auf.
- Das funktioniert auch für Einträge, die **später** per JavaScript dazukommen. Eigene Listener auf jedem `<li>` würden die neuen verpassen.

## Etwas zwischen den Klicks merken

Ein Zähler braucht eine Variable, die zwischen den Klicks erhalten bleibt. Lege sie **außerhalb** des Listeners an, so wie in Lektion 16:

```js
let klicks = 0;
document.querySelector("#plus").addEventListener("click", () => {
  klicks++;
  console.log(klicks);
});
```

Jeder Klick gibt die nächste Zahl aus: 1, 2, 3 und so weiter. Stünde `let klicks = 0` im Listener, finge der Zähler bei jedem Klick wieder bei 0 an.
