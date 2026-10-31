## Aufgabe: Dein Steckbrief

Du legst ein paar Variablen an und baust daraus einen Satz. Am Ende soll unter **Ausgabe** zum Beispiel das hier stehen:

```
Hallo Mara, du hast 10 Punkte.
```

Statt „Mara“ darfst du jeden Namen nehmen.

### Schritt 1: Name und Punkte

1. Lege `const name` an und gib ihr einen Text, zum Beispiel `"Mara"`.
2. Lege `let punkte` an und gib ihr die Zahl `0`.

### Schritt 2: Punkte dazugeben

Erhöhe `punkte` um `10`. Am kürzesten geht das mit `punkte += 10;`.

Wichtig: Mach das **vor** Schritt 3. Sonst steht im Satz noch die alte Zahl 0.

### Schritt 3: Den Satz bauen

Lege `const nachricht` an. So gehst du vor:

1. Schreib den Satz zwischen zwei Backticks `` ` `` statt Anführungszeichen.
2. Wo der Name stehen soll, schreibst du `${name}`.
3. Wo die Punkte stehen sollen, schreibst du `${punkte}`.

Achte auf das Komma nach dem Namen und den Punkt am Ende.

### Schritt 4: Ausgeben

Gib `nachricht` mit `console.log` aus und drücke **Ausführen**.
