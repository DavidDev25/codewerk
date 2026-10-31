## Aufgabe: Ein Zähler, der sich etwas merkt

Du baust drei Funktionen. Jede gibt eine **neue Funktion** zurück. Diese neue Funktion merkt sich einen Wert, auch wenn die äußere Funktion schon fertig ist. Genau das hast du in der Erklärung beim Zähler gesehen.

### Schritt 1: Der Zähler

Schreibe die Funktion `zaehlerErstellen`. So soll sie sich verhalten:

```js
const zaehler = zaehlerErstellen();
zaehler(); // 1
zaehler(); // 2
zaehler(); // 3
```

So gehst du vor:

1. Lege in `zaehlerErstellen` eine Variable `stand` mit dem Wert `0` an.
2. Gib eine Funktion zurück. Sie erhöht `stand` um 1 und gibt `stand` zurück.

Wichtig: `stand` gehört **in** `zaehlerErstellen`, nicht ganz nach oben. Nur so bekommt jeder neue Zähler seinen eigenen Stand.

### Schritt 2: Der Grüßer

Schreibe die Funktion `begruesser(gruss)`. Sie bekommt einen Gruß wie `"Moin"` und gibt eine Funktion zurück. Diese Funktion bekommt einen Namen und gibt den fertigen Gruß zurück:

```js
const moin = begruesser("Moin");
moin("Lea"); // "Moin, Lea!"
moin("Ben"); // "Moin, Ben!"
```

### Schritt 3: Das Konto

Schreibe die Funktion `kontoErstellen(start)`. Sie gibt diesmal keine einzelne Funktion zurück, sondern ein Objekt mit **zwei** Funktionen:

- `einzahlen(betrag)` erhöht den Kontostand.
- `stand()` gibt den aktuellen Kontostand zurück.

```js
const konto = kontoErstellen(50);
konto.einzahlen(20);
konto.stand(); // 70
```

Speichere den Kontostand in einer Variable **innerhalb** von `kontoErstellen`, nicht im Objekt. Dann kann ihn von außen niemand heimlich ändern.
