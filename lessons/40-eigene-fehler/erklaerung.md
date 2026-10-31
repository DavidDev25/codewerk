## Fehler sind nicht gleich Fehler

In Lektion 39 hast du Fehler mit `throw` ausgelöst und mit `try` und `catch` aufgefangen. In echten Programmen gibt es aber sehr verschiedene Fehler. Eine falsche Eingabe soll dem Nutzer freundlich erklärt werden. Ein Programmierfehler soll dagegen laut auffallen, damit man ihn behebt.

:::alltag
In einer Werkstatt kommen Reklamationen an. Ein lockerer Knopf geht an die Näherei, ein kaputter Motor an die Elektrik. Damit das klappt, braucht jede Reklamation eine **Art**, nicht nur eine Beschreibung.
:::

## Eigene Fehlerarten bauen

Mit Vererbung aus Lektion 32 baust du eigene Fehlerarten. Sie erben alles von `Error` und können zusätzliche Angaben tragen. Im Beispiel merkt sich der Fehler, in welchem Feld eines Formulars etwas falsch ist:

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

Die erste Zeile gibt „EingabeFehler email Da fehlt das @.“ aus. Die zweite gibt zweimal `true` aus. Der Fehler ist also ein `EingabeFehler` und gleichzeitig ein ganz normaler `Error`.

- `super(nachricht)` übergibt die Meldung an `Error`. Dort landet sie in `message`.
- `this.name` sorgt dafür, dass der Fehler in Meldungen richtig heißt.
- `this.feld` ist eine zusätzliche Angabe, die nur dieser Fehler hat.

## Nur fangen, was du behandeln kannst

Fange nur die Fehler, mit denen du etwas anfangen kannst. Alle anderen wirfst du mit `throw` weiter. Im Beispiel kümmert sich `verarbeiten` nur um Eingabefehler:

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

Beim ersten Aufruf kommt „Bitte Eingabe prüfen“ heraus. Beim zweiten Aufruf entsteht ein ganz anderer Fehler, denn `null.wert` geht nicht. Das ist ein `TypeError`. Ihn wirft `verarbeiten` weiter, und erst der äußere `catch` gibt „Weitergereicht: TypeError“ aus.

Ein leerer `catch`-Block, der alle Fehler verschluckt, ist einer der häufigsten Gründe für Fehler, die niemand findet.

## Die Ursache mitgeben

Oft fängt man einen technischen Fehler und wirft stattdessen einen verständlicheren. Damit die eigentliche Ursache nicht verloren geht, gibst du sie als `cause` mit:

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

Ausgegeben werden „Die Konfiguration ist beschädigt.“ und „Ursache: SyntaxError“. Wer den Fehler fängt, sieht also die verständliche Meldung und kann trotzdem nachsehen, was technisch passiert ist.

## Aufräumen mit finally

Nach `try` und `catch` kannst du noch einen `finally`-Block anhängen. Er läuft **immer**, egal ob ein Fehler kam oder nicht. Damit räumst du auf, zum Beispiel blendest du einen Ladekreisel wieder aus.
