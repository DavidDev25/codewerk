## Aufgabe: package.json ausfüllen und Versionen prüfen

Zuerst füllst du die `package.json` des Projekts aus. Danach schreibst du in `main.js` eine Funktion, die prüft, ob eine Version zu einem Bereich passt. Das Hauptprogramm in `main.js` ist schon fertig. Es liest deine `package.json` und vergleicht sie mit den installierten Versionen.

Am Ende steht im Reiter **Ausgabe**:

```
mein-laden v1.0.0
express ^4.21.2: installiert 4.22.3 passt
eslint ~9.17.0: installiert 9.18.0 passt nicht
```

### Schritt 1: Die package.json

Öffne den Reiter `package.json`. So gehst du vor:

1. Setze `version` auf `"1.0.0"` und schreibe bei `description` einen kurzen Satz hinein.
2. Trage bei `scripts` zwei Skripte ein: `"start": "node main.js"` und `"test": "node --test"`.
3. Trage bei `dependencies` den Eintrag `"express": "^4.21.2"` ein.
4. Trage bei `devDependencies` den Eintrag `"eslint": "~9.17.0"` ein.

Wichtig: Es ist JSON. Achte auf doppelte Anführungszeichen und darauf, dass nach dem letzten Eintrag kein Komma steht.

### Schritt 2: Passt die Version?

`passt(version, bereich)` gibt `true` zurück, wenn die Version zum Bereich passt:

```js
passt("5.0.0", "*");      // true
passt("1.2.3", "1.2.3");  // true
passt("1.2.4", "1.2.3");  // false
passt("1.2.9", "~1.2.3"); // true
passt("1.3.0", "~1.2.3"); // false
passt("1.9.0", "^1.2.3"); // true
passt("2.0.0", "^1.2.3"); // false
passt("0.2.9", "^0.2.3"); // true
passt("0.3.0", "^0.2.3"); // false
passt("1.2.2", "^1.2.3"); // false
```

So gehst du vor:

1. Ist der Bereich `"*"`, gib `true` zurück.
2. Merke dir das erste Zeichen des Bereichs. Ist es `^` oder `~`, schneide es ab.
3. Zerlege beide Versionen mit `split(".").map(Number)` in drei Zahlen.
4. Ohne Zeichen davor müssen alle drei Zahlen gleich sein.
5. Bei `~` müssen die erste und die zweite Zahl gleich sein. Bei `^` muss die erste Zahl gleich sein. Ist sie 0, muss auch die zweite gleich sein.
6. Bei `~` und `^` darf die Version außerdem nicht kleiner sein als die im Bereich. Vergleiche dafür die dritte Zahl, wenn die ersten beiden gleich sind, und sonst die zweite.

Wichtig: Eine Version, die kleiner ist als die im Bereich, passt nie. `1.2.2` passt deshalb nicht zu `^1.2.3`.
