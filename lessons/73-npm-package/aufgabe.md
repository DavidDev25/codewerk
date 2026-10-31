## Aufgabe: package.json ausfüllen und Versionen prüfen

**In `package.json`:**

1. Setze `version` auf `"1.0.0"` und schreibe eine `description` (nicht leer).
2. Trage zwei Skripte ein: `"start": "node main.js"` und `"test": "node --test"`.
3. Trage `express` in Version `^4.21.2` in die `dependencies` ein und `eslint` in Version `~9.17.0` in die `devDependencies`.

**In `main.js`:**

4. Schreibe `passt(version, bereich)`. Sie gibt `true` zurück, wenn die Version zum Bereich passt:
   - `"*"` passt immer.
   - `"1.2.3"` ohne Zeichen davor: nur genau diese Version.
   - `"~1.2.3"`: gleiche erste und zweite Zahl, und mindestens 1.2.3.
   - `"^1.2.3"`: gleiche erste Zahl, und mindestens 1.2.3. Ist die erste Zahl `0`, muss auch die zweite gleich sein.
5. Das Hauptprogramm ist schon fertig: Es liest `package.json` und prüft die installierten Versionen.

Erwartete Ausgabe:

```
mein-laden v1.0.0
express ^4.21.2: installiert 4.22.3 passt
eslint ~9.17.0: installiert 9.18.0 passt nicht
```
