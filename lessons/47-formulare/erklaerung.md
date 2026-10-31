## Formulare abschicken

Ein Formular schickt seine Daten beim Absenden normalerweise an einen Server, und der Browser lädt dabei die **ganze Seite neu**. Moderne Seiten verhindern das und erledigen alles mit JavaScript.

:::alltag
Ein Briefkasten in der Firma: Normalerweise wirfst du den Brief ein und er geht zur Post. Mit `preventDefault()` fängst du ihn vorher ab, liest ihn selbst und entscheidest, was damit passiert.
:::

```js
const form = document.querySelector("#anmeldung");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Abgefangen! Die Seite lädt nicht neu.");
});
```

Wichtig: Hör auf das `submit`-Event des **Formulars**, nicht auf den Klick auf den Knopf. `submit` kommt auch, wenn jemand im Eingabefeld Enter drückt.

## Werte auslesen

Jedes Feld mit einem `name` findest du über `form.elements`:

```js
const form = document.querySelector("#anmeldung");
form.elements.name.value = "  Mara ";
form.elements.kurs.value = "React";

console.log(form.elements.name.value.trim());
console.log(form.elements.kurs.value);

const daten = new FormData(form);
console.log(daten.get("kurs"));
```

`FormData` sammelt alle Felder auf einmal. `daten.get("name")` liefert den Wert zum Namen. Mit `Object.fromEntries(new FormData(form))` bekommst du ein ganz normales Objekt.

## Eingaben prüfen

Prüfe immer zuerst und zeige eine **verständliche** Meldung, was fehlt:

```js
function pruefen(name, email) {
  if (!name) return "Bitte gib einen Namen ein.";
  if (!email.includes("@")) return "Bitte gib eine gültige E-Mail ein.";
  return null;
}

console.log(pruefen("", "a@b.de"));
console.log(pruefen("Ali", "ali.de"));
console.log(pruefen("Ali", "ali@web.de"));
```

## Zurücksetzen

`form.reset()` leert alle Felder wieder, ideal nach einem erfolgreichen Absenden.

:::alltag
Diese Prüfung im Browser ist eine Hilfe für die Nutzer, kein Schutz. Wer will, kann sie umgehen. Ein echter Server muss alle Daten **noch einmal selbst** prüfen.
:::
