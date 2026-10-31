## Aufgabe: Eine Seite für alle

Auf der Seite gibt es eine Karte mit einem Knopf, ein Menü und eine Auswahlliste. Du sorgst dafür, dass alles mit Maus **und** Tastatur funktioniert.

### Schritt 1: Die Karte

Ein Klick auf `#karte` klappt sie auf oder zu. Ein Klick auf den Knopf `#merken` darin merkt sie sich, ohne sie umzuklappen:

```js
// Klick auf die Karte
karte.classList.contains("offen"); // true
// Klick auf „Merken“
document.querySelector("#gemerkt").textContent; // "Gemerkt!"
karte.classList.contains("offen"); // immer noch true
```

So gehst du vor:

1. Hänge an `#karte` einen `click`-Listener. Schalte darin mit `classList.toggle("offen")` die Klasse um.
2. Hänge an `#merken` einen `click`-Listener. Schreibe darin „Gemerkt!“ in `#gemerkt`.
3. Rufe im Listener von `#merken` zusätzlich `event.stopPropagation()` auf.

Wichtig: Ohne Schritt 3 steigt der Klick zur Karte auf, und die Karte klappt jedes Mal mit um.

### Schritt 2: Das Menü

Ein Klick auf `#menue-knopf` blendet `#menue` ein oder aus. Gleichzeitig sagt `aria-expanded`, ob es offen ist:

```js
// erster Klick
menue.hidden;                                // false
menueKnopf.getAttribute("aria-expanded");    // "true"
// zweiter Klick
menue.hidden;                                // true
menueKnopf.getAttribute("aria-expanded");    // "false"
```

So gehst du vor:

1. Drehe im Listener `menue.hidden` um: `menue.hidden = !menue.hidden;`.
2. Setze danach mit `setAttribute("aria-expanded", …)` den Text `"true"`, wenn das Menü jetzt offen ist, sonst `"false"`.

### Schritt 3: Escape schließt das Menü

Drückt man irgendwo auf der Seite `Escape`, geht das Menü zu, und der Fokus springt zurück auf den Menü-Knopf.

So gehst du vor:

1. Hänge einen `keydown`-Listener an `document`.
2. Ist `event.key` gleich `"Escape"`, setze `menue.hidden` auf `true` und `aria-expanded` auf `"false"`.
3. Rufe danach `menueKnopf.focus()` auf.

### Schritt 4: Pfeiltasten in der Auswahl

In `#auswahl` springt der Fokus mit `ArrowDown` zum nächsten Eintrag und mit `ArrowUp` zum vorherigen. Am Ende der Liste bleibt er stehen.

So gehst du vor:

1. Hänge **einen** `keydown`-Listener an `#auswahl`.
2. Das gerade fokussierte `<li>` findest du mit `event.target.closest("li")`.
3. Bei `ArrowDown` nimmst du `nextElementSibling`, bei `ArrowUp` nimmst du `previousElementSibling`.
4. Gibt es diesen Nachbarn, rufe darauf `focus()` auf. Gibt es ihn nicht, passiert nichts.
