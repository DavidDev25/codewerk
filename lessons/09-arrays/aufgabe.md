## Aufgabe: Die Einkaufsliste

Im Editor steht schon eine Einkaufsliste mit Milch, Eiern und Käse. Du ergänzt etwas und liest Werte aus der Liste heraus.

### Schritt 1: Brot dazu

Hänge `"Brot"` hinten an die Liste `einkaufsliste` an. Danach sieht sie so aus:

```js
["Milch", "Eier", "Käse", "Brot"]
```

### Schritt 2: Wie viele Einträge?

Lege `const anzahl` an. Darin steht die Länge der Liste. Nach Schritt 1 ist das 4.

### Schritt 3: Der erste und der letzte Eintrag

1. Lege `const erstes` an. Darin steht der erste Eintrag, also `"Milch"`.
2. Lege `const letztes` an. Darin steht der letzte Eintrag, also `"Brot"`.

Wichtig: Der erste Eintrag hat die Nummer 0. Der letzte hat die Nummer `einkaufsliste.length - 1`.

### Schritt 4: Steht Brot drauf?

Lege `const hatBrot` an. Sie soll `true` sein, wenn `"Brot"` in der Liste steht. Nimm dafür `includes`.
