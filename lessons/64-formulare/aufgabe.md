## Aufgabe: Die Kursanmeldung

Auf der Seite steht ein Anmeldeformular mit Name, E-Mail und Kurs. Darunter gibt es eine Meldung und die Liste der Teilnehmer. Du schreibst **einen** `submit`-Listener für `#anmeldung`, der alles erledigt.

### Schritt 1: Abfangen und auslesen

So gehst du vor:

1. Hänge an `#anmeldung` einen `submit`-Listener und rufe darin zuerst `event.preventDefault()` auf.
2. Lies die drei Felder über `form.elements` aus: `name`, `email` und `kurs`.
3. Entferne beim Namen mit `trim()` die Leerzeichen am Rand.

### Schritt 2: Prüfen

Bei einem Fehler steht in `#meldung` eine Meldung, und `#meldung` hat die Klasse `fehler`:

```js
// Name leer
meldung.textContent; // "Bitte gib einen Namen ein."
// E-Mail ohne @
meldung.textContent; // "Bitte gib eine gültige E-Mail ein."
meldung.classList.contains("fehler"); // true
```

So gehst du vor:

1. Prüfe zuerst den Namen, dann die E-Mail, genau wie `pruefen` in der Erklärung.
2. Gibt es einen Fehler, schreibe die Meldung in `#meldung` und gib ihr die Klasse `fehler`.
3. Höre danach mit `return` auf.

Wichtig: Ohne das `return` kommt die Person trotz Fehler auf die Liste.

### Schritt 3: Anmelden

Sind alle Angaben in Ordnung, wird die Person angemeldet:

```js
// Name „Mara“, Kurs „React“
teilnehmer.lastElementChild.textContent; // "Mara (React)"
meldung.textContent;                     // "Angemeldet: Mara"
meldung.classList.contains("ok");        // true
```

So gehst du vor:

1. Baue ein neues `<li>` mit Name und Kurs in Klammern und hänge es an `#teilnehmer` an.
2. Schreibe „Angemeldet:“ und den Namen in `#meldung`.
3. Nimm `#meldung` die Klasse `fehler` weg und gib ihr die Klasse `ok`.
4. Leere das Formular mit `form.reset()`.
