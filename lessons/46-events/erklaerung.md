## Die Seite reagiert

Bisher lief dein Code einmal von oben nach unten und war fertig. Interaktive Seiten warten dagegen auf etwas: einen Klick, eine Eingabe, einen Tastendruck. So etwas heißt **Event** (Ereignis).

:::alltag
Eine Türklingel: Du stehst nicht die ganze Zeit an der Tür und schaust nach. Du hängst eine Klingel auf, und **wenn** jemand drückt, klingelt es. `addEventListener` ist das Aufhängen der Klingel. Die Funktion, die du mitgibst, ist das, was beim Klingeln passiert.
:::

```js
const knopf = document.querySelector("#plus");

knopf.addEventListener("click", () => {
  console.log("Geklickt!");
});

console.log("Klingel hängt.");
```

Drücke **Ausführen**, wechsle zur **Vorschau** und klicke auf **+1**. Jede Ausgabe erscheint im Reiter **Ausgabe**.

- Der erste Wert ist der **Typ** des Events: `"click"`, `"input"`, `"keydown"`, `"submit"` …
- Der zweite ist die Funktion, die bei jedem Event aufgerufen wird (ein Callback wie in Lektion 7).

## Das Event-Objekt

Die Funktion bekommt ein Objekt mit Infos zum Event. `event.target` ist das Element, auf dem es passiert ist:

```js
const feld = document.querySelector("#name");
feld.addEventListener("input", (event) => {
  console.log("Jetzt steht da:", event.target.value);
});
```

Das `input`-Event kommt bei **jedem** Tastendruck in einem Eingabefeld. Den Inhalt liest du mit `.value`.

## Ein Listener für viele: Event-Delegation

Events „blubbern“ nach oben: Ein Klick auf ein `<li>` ist auch ein Klick auf die `<ul>` darum herum. Statt jedem Eintrag eine eigene Klingel zu geben, hängst du **eine** an die Liste:

```js
const liste = document.querySelector("#farben");
liste.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  console.log("Gewählt:", li.dataset.farbe);
});
```

- `event.target.closest("li")` sucht vom angeklickten Element aus nach oben das nächste `<li>`.
- Das funktioniert auch für Einträge, die **später** per JavaScript dazukommen. Eigene Listener auf jedem `<li>` würden die neuen verpassen.

## Zustand merken

Der Zähler braucht eine Variable, die zwischen den Klicks erhalten bleibt. Lege sie außerhalb des Listeners an, so wie in Lektion 14 bei den Closures:

```js
let klicks = 0;
document.querySelector("#plus").addEventListener("click", () => {
  klicks++;
  console.log(klicks);
});
```
