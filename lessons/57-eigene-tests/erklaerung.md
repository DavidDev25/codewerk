## Warum selbst testen?

In jeder Lektion haben bisher Tests dein Programm geprüft. In echten Projekten schreibst du diese Tests **selbst**. Sie sind dein Sicherheitsnetz: Änderst du später etwas, sagen sie dir sofort, ob du etwas kaputt gemacht hast.

:::alltag
Ein Rauchmelder: Er nützt nur, wenn er auch wirklich bei Rauch piept. Ein Test, der nie fehlschlägt, ist wie ein Rauchmelder ohne Batterie. Er beruhigt, schützt aber nicht.
:::

## Ein Test besteht aus drei Teilen

**Vorbereiten, Ausführen, Prüfen** (auf Englisch „Arrange, Act, Assert“):

```js
function verdoppeln(x) {
  return x * 2;
}

const eingabe = 21;
const ergebnis = verdoppeln(eingabe);
console.log(ergebnis === 42 ? "bestanden" : "FEHLGESCHLAGEN");
```

## Welche Fälle testen?

Gute Tests decken nicht nur den Normalfall ab:

| Art | Beispiel für eine Rabatt-Funktion |
| --- | --- |
| Normalfall | 10 % von 100 € → 90 € |
| Grenzfälle | 0 %, genau 100 %, ein Preis von 0 € |
| Fehlerfälle | -5 % oder 150 % sollen einen Fehler werfen |

Die meisten Fehler sitzen an den **Grenzen**: `<` statt `<=`, eins zu viel oder eins zu wenig.

## Wie gut sind meine Tests?

Profis prüfen ihre Tests mit einem Trick: Sie bauen absichtlich Fehler in den Code ein („Mutanten“) und schauen, ob die Tests das merken. Fällt ein Mutant nicht auf, fehlt ein Test. Genau so wird deine Aufgabe geprüft.

## So sieht es in echten Projekten aus

Dort benutzt man fertige Werkzeuge wie **Vitest**, **Jest** oder das eingebaute `node:test`. Die Form kennst du schon aus Codewerk:

```text
test("10 % Rabatt auf 100 €", () => {
  expect(preisMitRabatt(100, 10)).toBe(90);
});
```

Die Tests laufen dann mit einem Befehl wie `npm test`, oft automatisch bei jedem Hochladen des Codes.
