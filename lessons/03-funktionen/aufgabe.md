## Aufgabe: Drei kleine Maschinen

Du schreibst drei Funktionen. Die Gerüste stehen schon im Editor, es fehlt jeweils nur das Innere.

### Schritt 1: Das Quadrat

`quadrat(zahl)` nimmt eine Zahl mal sich selbst:

```js
quadrat(5);  // 25
quadrat(-3); // 9
```

Schreib in die Funktion eine Zeile mit `return`.

### Schritt 2: Der Gruß

`begruesse(name)` baut einen Gruß aus dem Namen:

```js
begruesse("Mara"); // "Hallo Mara!"
```

Nimm Backticks und setze den Namen mit `${name}` ein. Das Ausrufezeichen gehört dazu.

### Schritt 3: Gerade oder nicht?

`istGerade(zahl)` gibt `true` zurück, wenn die Zahl gerade ist, sonst `false`:

```js
istGerade(4); // true
istGerade(7); // false
```

So gehst du vor:

1. Rechne den Rest beim Teilen durch 2 aus: `zahl % 2`.
2. Vergleiche ihn mit `=== 0` und gib das Ergebnis mit `return` zurück.

Wichtig: Jede Funktion braucht ein `return`. Ohne `return` kommt `undefined` heraus, auch wenn richtig gerechnet wird.
