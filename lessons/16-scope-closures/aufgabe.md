## Aufgabe: Funktionen, die Funktionen bauen

Du schreibst drei kleine „Fabriken“. Jede gibt etwas zurück, das sich Werte aus seiner Entstehung merkt.

1. Schreibe `zaehlerErstellen()`. Sie gibt eine Funktion zurück, die bei jedem Aufruf um 1 weiterzählt und den neuen Stand zurückgibt. Zwei Zähler dürfen sich dabei nicht gegenseitig beeinflussen.

```js
const z = zaehlerErstellen();
z(); // 1
z(); // 2
```

2. Schreibe `begruesser(gruss)`. Sie gibt eine Funktion zurück, die einen Namen bekommt und daraus einen Gruß baut.

```js
const moin = begruesser("Moin");
moin("Lea"); // "Moin, Lea!"
```

3. Schreibe `kontoErstellen(start)`. Sie gibt ein Objekt mit zwei Funktionen zurück: `einzahlen(betrag)` erhöht den Kontostand, `stand()` gibt ihn zurück. Den Kontostand selbst speicherst du nicht im Objekt, sondern nur in der Closure. So kann ihn von außen niemand direkt verändern.

```js
const konto = kontoErstellen(50);
konto.einzahlen(20);
konto.stand(); // 70
```
