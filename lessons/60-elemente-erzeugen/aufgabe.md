## Aufgabe: Die Einkaufsliste füllen

Auf der Seite steht eine leere Einkaufsliste mit dem Hinweis „Noch nichts auf der Liste.“. Im Editor steht schon das Array `artikel`. Du füllst die Liste und baust eine Funktion, mit der man später sicher Einträge hinzufügen kann.

### Schritt 1: Einen Eintrag bauen

`eintragErstellen(text)` baut ein neues `<li>` und gibt es zurück. Eingefügt wird es hier noch nicht:

```js
const li = eintragErstellen("Milch");
li.textContent; // "Milch"
```

So gehst du vor:

1. Baue mit `document.createElement("li")` ein neues Element.
2. Setze seinen `textContent` auf `text`.
3. Gib das Element mit `return` zurück.

### Schritt 2: Die Liste füllen

Gehe mit `for…of` durch `artikel`. Hänge für jeden Artikel `eintragErstellen(name)` mit `append` an `#liste` an. In der Vorschau stehen danach alle Artikel auf der Liste.

### Schritt 3: Den Hinweis entfernen

Die Liste ist jetzt nicht mehr leer. Entferne den Absatz `#leer` mit `remove()`.

### Schritt 4: Sicher hinzufügen

`hinzufuegen(text)` baut mit `eintragErstellen` einen Eintrag und hängt ihn an `#liste` an:

```js
hinzufuegen("Äpfel");       // neuer Eintrag „Äpfel“
hinzufuegen("<b>fett</b>"); // neuer Eintrag, in dem wirklich „<b>fett</b>“ steht
```

Weil `eintragErstellen` den Text mit `textContent` setzt, ist `hinzufuegen` automatisch sicher. Der HTML-Code erscheint als Text und wird nicht fett.

Wichtig: Benutze nirgends `innerHTML`. Die Tests prüfen das.
