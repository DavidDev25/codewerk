## Aufgabe: Teste die Rabatt-Funktion

Diesmal schreibst du keine Funktion, die etwas berechnet. Du schreibst die **Tests** für eine Rabatt-Funktion. Codewerk prüft danach, ob deine Tests gut genug sind: Sie bekommen eine richtige Rabatt-Funktion und vier versteckte kaputte. Die richtige muss alle Tests bestehen. Jede kaputte muss an mindestens einem Test scheitern.

### So soll die Rabatt-Funktion arbeiten

```js
rabatt(100, 10);  // 90
rabatt(100, 0);   // 100
rabatt(100, 100); // 0
rabatt(100, 150); // wirft einen RangeError
rabatt(100, -5);  // wirft einen RangeError
```

Sie zieht also `prozent` Prozent vom Preis ab. Erlaubt sind 0 bis einschließlich 100 Prozent. Alles darunter oder darüber wirft einen `RangeError`.

### Die beiden Helfer

Im Editor stehen schon zwei Helfer:

- `pruefe(ist, soll)` ist `true`, wenn beide Werte gleich sind.
- `wirft(fn)` ist `true`, wenn `fn()` einen Fehler wirft.

### Deine Tests

`meineTests(rabatt)` gibt ein Array mit Prüfergebnissen zurück. Die erste Prüfung steht schon da:

```js
pruefe(rabatt(100, 10), 90)
```

So gehst du vor:

1. Ergänze Prüfungen für die Grenzfälle 0 % und 100 %. Rechne vorher aus, was herauskommen muss.
2. Ergänze Prüfungen für die Fehlerfälle. Ein Fehler wird so geprüft: `wirft(() => rabatt(100, 150))`. Das `() =>` ist wichtig, damit `wirft` den Aufruf selbst ausführt und den Fehler auffangen kann.
3. Schreibe mindestens vier Prüfungen.

Unten im Editor ruft `console.log` deine Tests schon mit einer Rabatt-Funktion auf. Führe den Code aus und schau, ob überall `true` steht.

Wichtig: Steht bei der richtigen Funktion irgendwo `false`, erwartet eine deiner Prüfungen etwas Falsches. Rechne dann noch einmal nach.
