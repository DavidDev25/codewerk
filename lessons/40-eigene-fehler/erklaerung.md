## Fehler sind nicht gleich Fehler

In Lektion 39 hast du Fehler mit `throw` ausgelöst und mit `try … catch` gefangen. In echten Programmen gibt es aber sehr verschiedene Fehler: Eine falsche Eingabe soll dem Nutzer freundlich erklärt werden, ein Programmierfehler soll dagegen laut auffallen.

:::alltag
In einer Werkstatt kommen Reklamationen an. Ein lockerer Knopf geht an die Näherei, ein kaputter Motor an die Elektrik. Damit das klappt, braucht jede Reklamation eine **Art**, nicht nur eine Beschreibung.
:::

## Eigene Fehlerklassen

Mit Vererbung (Lektion 32) baust du eigene Fehlerarten. Sie können zusätzliche Infos tragen:

```js
class EingabeFehler extends Error {
  constructor(feld, nachricht) {
    super(nachricht);
    this.name = "EingabeFehler";
    this.feld = feld;
  }
}

try {
  throw new EingabeFehler("email", "Da fehlt das @.");
} catch (fehler) {
  console.log(fehler.name, fehler.feld, fehler.message);
  console.log(fehler instanceof EingabeFehler, fehler instanceof Error);
}
```

- `super(nachricht)` setzt die normale Fehlermeldung.
- `this.name` sorgt dafür, dass der Fehler in Meldungen richtig heißt.

## Gezielt fangen

Fange nur, was du auch behandeln kannst. Alles andere wirfst du mit `throw` weiter:

```js
class EingabeFehler extends Error {}

function verarbeiten(aufgabe) {
  try {
    aufgabe();
  } catch (fehler) {
    if (fehler instanceof EingabeFehler) {
      return "Bitte Eingabe prüfen";
    }
    throw fehler;
  }
  return "ok";
}

console.log(verarbeiten(() => { throw new EingabeFehler(); }));
try {
  verarbeiten(() => null.wert);
} catch (fehler) {
  console.log("Weitergereicht:", fehler.name);
}
```

Ein leeres `catch`, das alles verschluckt, ist einer der häufigsten Gründe für Fehler, die niemand findet.

## Die Ursache mitgeben: cause

Oft fängt man einen technischen Fehler und wirft einen verständlicheren. Damit die eigentliche Ursache nicht verloren geht, gibst du sie als `cause` mit:

```js
function konfigLaden(text) {
  try {
    return JSON.parse(text);
  } catch (fehler) {
    throw new Error("Die Konfiguration ist beschädigt.", { cause: fehler });
  }
}

try {
  konfigLaden("{kaputt");
} catch (fehler) {
  console.log(fehler.message);
  console.log("Ursache:", fehler.cause.name);
}
```

## finally

Ein `finally`-Block läuft **immer**, egal ob ein Fehler kam oder nicht. Ideal zum Aufräumen, etwa um einen Ladekreisel wieder auszublenden.
