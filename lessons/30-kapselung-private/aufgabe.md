## Aufgabe: Das Konto

Du baust ein Bankkonto wie den Geldautomaten aus der Erklärung. Den Kontostand speicherst du in einem privaten Feld `#saldo`. So kann ihn von außen niemand heimlich ändern. Im Editor steht schon ein Gerüst der Klasse `Konto`.

### Schritt 1: Das private Feld

```js
new Konto().kontostand(); // 0
```

So gehst du vor:

1. Schreibe oben in die Klasse `#saldo = 0;`.
2. Gib in `kontostand()` den Wert `this.#saldo` zurück.

### Schritt 2: Einzahlen

```js
const k = new Konto();
k.einzahlen(50);
k.einzahlen(-20);
k.kontostand(); // 50
```

`einzahlen(betrag)` erhöht den Saldo. Prüfe vorher mit `if (betrag > 0)`, ob der Betrag sinnvoll ist. Beträge von 0 oder weniger ignorierst du einfach.

### Schritt 3: Abheben

`abheben(betrag)` gibt `true` zurück, wenn es geklappt hat, sonst `false`:

```js
const k = new Konto();
k.einzahlen(100);
k.abheben(30);  // true
k.kontostand(); // 70
k.abheben(500); // false
k.kontostand(); // 70
```

So gehst du vor:

1. Ist der Betrag 0 oder kleiner oder größer als `this.#saldo`, gib `false` zurück.
2. Sonst ziehe den Betrag ab und gib `true` zurück.

Wichtig: Prüfe **zuerst** und ziehe erst danach ab. Sonst ist das Geld schon weg, wenn du merkst, dass es nicht reicht.

### Schritt 4: Dein eigenes Konto

Lege unter der Klasse `const meinKonto = new Konto();` an und zahle mit `meinKonto.einzahlen(100);` ein.

Wichtig: Schreibe überall `this.#saldo` mit `#`. Mit `this.saldo` ohne `#` wäre das Feld nicht privat, und jeder könnte es von außen ändern.
