## Aufgabe: Die Kasse im Café

Drei Kaffee à 4,50 € plus Trinkgeld. Du rechnest aus, was bezahlt wird. Die Werte `preis`, `anzahl` und `eingabe` stehen schon im Editor.

Am Ende soll unter **Ausgabe** das hier stehen:

```
15.5
```

### Schritt 1: Der Gesamtpreis

Lege `const gesamt` an. Darin steht `preis` mal `anzahl`. Malnehmen geht mit `*`.

### Schritt 2: Gerade oder ungerade?

Lege `const istGerade` an. Sie soll `true` sein, wenn `anzahl` gerade ist, sonst `false`.

So gehst du vor:

1. Rechne den Rest beim Teilen durch 2 aus: `anzahl % 2`.
2. Vergleiche diesen Rest mit `=== 0`.

Bei 3 Kaffee kommt `false` heraus, denn 3 ist ungerade.

### Schritt 3: Das Trinkgeld als Zahl

`eingabe` kommt aus einem Formular. Deshalb steht dort der **Text** `"2"`, keine Zahl.

Lege `const trinkgeld` an und mach aus `eingabe` mit `Number(…)` eine echte Zahl.

### Schritt 4: Was bezahlt wird

Lege `const bezahlt` an: `gesamt` plus `trinkgeld`.

Wichtig: Nimm `trinkgeld`, nicht `eingabe`. Mit `eingabe` würde JavaScript Text zusammenkleben, und heraus käme `13.52` statt `15.5`.

### Schritt 5: Den Typ nachsehen

Lege `const typVonEingabe` an. Darin steht der Typ von `eingabe`, den du mit `typeof` herausfindest.

### Schritt 6: Ausgeben

Gib `bezahlt` mit `console.log` aus.
