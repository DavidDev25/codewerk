## Aufgabe: Die To-do-App

Du baust die App Schritt für Schritt. Die Daten liegen in `let aufgaben`, einem Array aus Objekten wie `{ text: "Einkaufen", erledigt: false }`. Halte dich an das Prinzip aus der Erklärung: Jede Aktion ändert die Daten, speichert sie und zeichnet dann neu.

### Schritt 1: Laden und Speichern

```js
laden();      // [] beim ersten Start
speichern();  // legt aufgaben als JSON unter "aufgaben" ab
```

So gehst du vor:

1. `laden()` liest den Text unter `"aufgaben"`. Gibt es ihn, gib `JSON.parse(text)` zurück, sonst `[]`.
2. Starte mit `let aufgaben = laden();`.
3. `speichern()` legt `JSON.stringify(aufgaben)` unter `"aufgaben"` ab.

### Schritt 2: Zeichnen

`zeichnen()` baut `#aufgaben` komplett neu. Jede Aufgabe wird ein `<li>`:

```html
<li data-index="0" class="erledigt">
  <span>Einkaufen</span>
  <button class="loeschen">✕</button>
</li>
```

So gehst du vor:

1. Leere `#aufgaben` mit `replaceChildren()`.
2. Gehe mit `forEach((aufgabe, index) => { ... })` durch `aufgaben`.
3. Baue für jede Aufgabe ein `<li>` mit `dataset.index`. Ist sie erledigt, bekommt es die Klasse `erledigt`.
4. Lege ein `<span>` mit dem Text hinein und einen `<button>` mit der Klasse `loeschen` und dem Text „✕“.
5. Schreibe zum Schluss in `#zaehler`, wie viele offen sind, zum Beispiel „2 von 3 offen“. Die offenen zählst du mit `filter`.

Rufe `zeichnen()` einmal beim Start auf.

### Schritt 3: Hinzufügen

Beim Absenden von `#neu` kommt eine neue Aufgabe dazu:

```js
// jemand tippt „  Einkaufen “ und drückt Enter
aufgaben.at(-1); // { text: "Einkaufen", erledigt: false }
```

So gehst du vor:

1. Hänge an `#neu` einen `submit`-Listener und rufe `event.preventDefault()` auf.
2. Lies den Text aus dem Feld `text` und entferne mit `trim()` die Leerzeichen am Rand.
3. Ist der Text leer, höre mit `return` auf.
4. Sonst lege `{ text, erledigt: false }` mit `push` in `aufgaben`, rufe `speichern()` und `zeichnen()` auf und leere das Formular mit `reset()`.

### Schritt 4: Abhaken und Löschen

Hänge **einen** `click`-Listener an `#aufgaben`, wie bei der Event-Delegation in Lektion 61:

1. Suche mit `event.target.closest("li")` den Eintrag. Gibt es keinen, höre auf.
2. Hole die Position mit `Number(li.dataset.index)`.
3. Wurde auf `.loeschen` geklickt, entferne die Aufgabe. Das prüfst du mit `event.target.closest(".loeschen")`. Entfernen geht zum Beispiel mit `filter` oder `splice`.
4. Sonst schalte `erledigt` bei dieser Aufgabe um: `aufgaben[index].erledigt = !aufgaben[index].erledigt`.
5. Rufe danach `speichern()` und `zeichnen()` auf.

Wichtig: Vergiss bei keiner Änderung `speichern()` und `zeichnen()`. Sonst passen Daten, Speicher und Anzeige nicht mehr zusammen.
