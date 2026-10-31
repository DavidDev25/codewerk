## Aufgabe: Das Thermometer

Du baust ein Thermometer, das die Temperatur in Grad Celsius speichert. Im Editor steht schon die Klasse `Thermometer` mit dem privaten Feld `#celsius`. Du ergänzt Getter und Setter wie bei der Pflanze in der Erklärung.

### Schritt 1: Die Temperatur lesen

```js
new Thermometer().celsius; // 20
```

Gib im Getter `celsius` den Wert `this.#celsius` zurück.

### Schritt 2: Die Temperatur ändern

```js
const t = new Thermometer();
t.celsius = 5;
t.celsius;        // 5
t.celsius = -300; // Fehler: Zu kalt!
t.celsius;        // 5
```

Kälter als minus 273,15 Grad geht es in der Natur nicht. So gehst du vor:

1. Prüfe im Setter, ob `wert` kleiner als `-273.15` ist. Wenn ja, wirf einen Fehler mit `throw new Error("Zu kalt!");`.
2. Sonst speichere den Wert in `this.#celsius`.

Wichtig: Der Fehler muss **vor** dem Speichern kommen. `throw` beendet den Setter sofort, und der alte Wert bleibt erhalten.

### Schritt 3: In Fahrenheit umrechnen

```js
t.celsius = 100;
t.fahrenheit; // 212
t.celsius = 0;
t.fahrenheit; // 32
```

Schreibe den Getter `get fahrenheit()`. Er rechnet aus `#celsius` den Wert aus: `this.#celsius * 9 / 5 + 32`.

Wichtig: Schreibe für `fahrenheit` **keinen** Setter. Den Wert soll man nur lesen können. Die Tests prüfen, dass ein Zuweisen fehlschlägt.
