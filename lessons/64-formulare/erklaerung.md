## Formulare abschicken

Ein Formular schickt seine Daten beim Absenden normalerweise an einen Server. Der Browser lädt dabei die **ganze Seite neu**. Moderne Seiten verhindern das und erledigen alles mit JavaScript.

:::alltag
Denk an den Briefkasten in einer Firma. Normalerweise wirfst du den Brief ein, und er geht zur Post. Mit `preventDefault()` fängst du ihn vorher ab, liest ihn selbst und entscheidest, was damit passiert.
:::

Im Beispiel fängst du das Absenden des Anmeldeformulars ab:

```js
const form = document.querySelector("#anmeldung");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Abgefangen! Die Seite lädt nicht neu.");
});
```

Klickst du in der Vorschau auf den Knopf zum Absenden, erscheint „Abgefangen! Die Seite lädt nicht neu.“. Die Seite bleibt, wie sie ist.

Wichtig: Hör auf das `submit`-Event des **Formulars**, nicht auf den Klick auf den Knopf. `submit` kommt auch, wenn jemand im Eingabefeld Enter drückt.

## Werte auslesen

Jedes Feld mit einem `name` findest du über `form.elements`. Im Beispiel füllt der Code zwei Felder selbst aus und liest sie dann auf zwei Arten:

```js
const form = document.querySelector("#anmeldung");
form.elements.name.value = "  Mara ";
form.elements.kurs.value = "React";

console.log(form.elements.name.value.trim());
console.log(form.elements.kurs.value);

const daten = new FormData(form);
console.log(daten.get("kurs"));
```

Ausgegeben werden „Mara“, „React“ und noch einmal „React“. `trim()` hat die Leerzeichen um Mara entfernt.

`FormData` sammelt alle Felder auf einmal. `daten.get("kurs")` liefert den Wert des Feldes mit diesem Namen. Mit `Object.fromEntries(new FormData(form))` bekommst du sogar ein ganz normales Objekt mit allen Feldern.

## Eingaben prüfen

Prüfe immer zuerst und zeige eine **verständliche** Meldung, was fehlt. Im Beispiel gibt die Prüfung eine Meldung zurück oder `null`, wenn alles stimmt:

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

Beim ersten Aufruf fehlt der Name. Beim zweiten fehlt das @. Beim dritten stimmt alles, und es kommt `null` heraus. Die Prüfung hört beim ersten Fehler auf. So bekommt man immer genau eine Meldung.

## Zurücksetzen

`form.reset()` leert alle Felder wieder. Das ist ideal nach einem erfolgreichen Absenden.

:::achtung
Diese Prüfung im Browser ist eine Hilfe für die Nutzer, aber kein Schutz. Wer will, kann sie umgehen. Ein echter Server muss alle Daten **noch einmal selbst** prüfen.
:::
