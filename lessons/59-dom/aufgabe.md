## Aufgabe: Der Laden macht auf

Du machst die Seite aus der Erklärung fertig für den Verkauf. Sobald du auf **Ausführen** drückst, siehst du das Ergebnis im Reiter **Vorschau**.

### Schritt 1: Die Überschrift

```js
titel.textContent; // "Codewerk-Laden"
```

So gehst du vor:

1. Finde die Überschrift mit `document.querySelector("#titel")` und speichere sie in `const titel`.
2. Setze ihren `textContent` auf `"Codewerk-Laden"`.

### Schritt 2: Alle Einträge

```js
eintraege.length; // 3
anzahl;           // 3
```

So gehst du vor:

1. Speichere **alle** `<li>` aus `#angebote` in `const eintraege`. Nimm dafür `querySelectorAll`.
2. Speichere ihre Anzahl in `const anzahl`.

### Schritt 3: Der Hinweis wird wichtig

Gib dem Absatz mit der Klasse `hinweis` zusätzlich die Klasse `wichtig`. In der Vorschau wird er dann rot.

Wichtig: Nimm `classList.add`. Mit `className = "wichtig"` wäre die alte Klasse `hinweis` weg.

### Schritt 4: Großbuchstaben

```js
eintraege[0].textContent; // "ÄPFEL"
```

Gehe mit `for…of` durch `eintraege`. Setze bei jedem Eintrag den `textContent` auf denselben Text in Großbuchstaben. Das geht mit `toUpperCase()`.

### Schritt 5: Der Knopf

```js
knopf.textContent;     // "In den Warenkorb"
knopf.dataset.produkt; // "obst"
```

Finde den Knopf `#knopf`. Ändere seinen Text und setze `dataset.produkt` auf `"obst"`.
