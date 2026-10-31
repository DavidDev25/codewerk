## Warum selbst testen?

Bisher haben in jeder Lektion Tests dein Programm geprüft. In echten Projekten schreibst du diese Tests **selbst**. Sie sind dein Sicherheitsnetz: Änderst du später etwas, sagen sie dir sofort, ob du dabei etwas kaputt gemacht hast.

:::alltag
Denk an einen Rauchmelder. Er nützt nur, wenn er bei Rauch auch wirklich piept. Ein Test, der nie fehlschlägt, ist wie ein Rauchmelder ohne Batterie. Er beruhigt, aber er schützt nicht.
:::

## Ein Test hat drei Teile

Jeder Test bereitet etwas vor, führt es aus und prüft das Ergebnis. Auf Englisch heißt das „Arrange, Act, Assert“. Im Beispiel testest du eine Funktion, die verdoppelt:

```js
function verdoppeln(x) {
  return x * 2;
}

const eingabe = 21;
const ergebnis = verdoppeln(eingabe);
console.log(ergebnis === 42 ? "bestanden" : "FEHLGESCHLAGEN");
```

Ausgegeben wird „bestanden“. Die erste Zeile nach der Funktion bereitet die Eingabe vor. Die zweite führt die Funktion aus. Die dritte prüft, ob 42 herausgekommen ist.

## Welche Fälle du testen solltest

Gute Tests decken nicht nur den Normalfall ab. Am Beispiel einer Rabatt-Funktion:

| Art | Beispiel für eine Rabatt-Funktion |
| --- | --- |
| Normalfall | 10 % von 100 € ergibt 90 € |
| Grenzfälle | 0 %, genau 100 %, ein Preis von 0 € |
| Fehlerfälle | -5 % oder 150 % sollen einen Fehler werfen |

Die meisten Fehler sitzen an den **Grenzen**: `<` statt `<=`, eins zu viel oder eins zu wenig.

## Wie gut sind meine Tests?

Erfahrene Entwickler prüfen ihre Tests mit einem Trick. Sie bauen absichtlich Fehler in den Code ein und schauen, ob die Tests das merken. Solche absichtlich kaputten Fassungen nennt man **Mutanten**. Fällt ein Mutant nicht auf, fehlt ein Test. Genau so wird auch deine Aufgabe geprüft.

## So sieht es in echten Projekten aus

Dort benutzt man fertige Werkzeuge wie **Vitest**, **Jest** oder das eingebaute `node:test`. Die Form kennst du schon aus Codewerk:

```text
test("10 % Rabatt auf 100 €", () => {
  expect(preisMitRabatt(100, 10)).toBe(90);
});
```

Der Test hat einen Namen und eine Funktion. Darin sagt `expect(…).toBe(90)`: Ich erwarte, dass hier 90 herauskommt. Die Tests laufen dann mit einem Befehl wie `npm test`, oft automatisch bei jedem Hochladen des Codes.
