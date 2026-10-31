## Aufgabe: Hund mit Rasse

Im Editor steht schon die Klasse `Tier` und ein Gerüst für `Hund`. Du gibst dem Hund eine Rasse, genau wie in der Erklärung.

### Schritt 1: Der constructor

```js
const h = new Hund("Rex", "Pudel");
h.name;  // "Rex"
h.rasse; // "Pudel"
```

So gehst du vor:

1. Rufe im `constructor` als Erstes `super(name);` auf.
2. Speichere danach die Rasse: `this.rasse = rasse;`.

Wichtig: `super(name)` muss **vor** `this` stehen. Andersherum bricht JavaScript mit einem Fehler ab.

### Schritt 2: Die Beschreibung

```js
new Hund("Bello", "Dackel").beschreibung(); // "Bello ist ein Tier. Rasse: Dackel"
new Tier("Fisch").beschreibung();           // "Fisch ist ein Tier."
```

So gehst du vor:

1. Schreibe in `Hund` eine eigene Methode `beschreibung()`.
2. Hole mit `super.beschreibung()` den Satz von `Tier`.
3. Hänge `" Rasse: "` und `this.rasse` an und gib alles zurück.

`Tier` selbst bleibt dabei unverändert.

### Schritt 3: Bello

Baue unter den Klassen den Hund `const bello = new Hund("Bello", "Dackel");`.
