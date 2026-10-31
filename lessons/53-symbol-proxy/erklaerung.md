## Code, der Code beeinflusst

Diese Lektion zeigt Werkzeuge, mit denen Bibliotheken wie Vue oder Datenbank-Werkzeuge arbeiten. Mit ihnen verändert Code das Verhalten von anderem Code. Man nennt das **Metaprogrammierung**.

## Symbol: ein Schlüssel, den es nur einmal gibt

Ein `Symbol` ist ein Wert, der garantiert einmalig ist. Als Schlüssel in einem Objekt kommt er nie anderen Eigenschaften in die Quere. Bei einer normalen Aufzählung ist er unsichtbar. Im Beispiel bekommt ein Nutzer eine versteckte Nummer:

```js
const ID = Symbol("id");
const nutzer = { name: "Lea", [ID]: 4711 };

console.log(nutzer[ID]);
console.log(Object.keys(nutzer));
console.log(JSON.stringify(nutzer));
console.log(Symbol("id") === Symbol("id"));
```

Mit `nutzer[ID]` kommst du an die 4711 heran. `Object.keys` zeigt aber nur `["name"]`, und auch im JSON-Text fehlt die Nummer. Die letzte Zeile gibt `false` aus. Zwei Symbole sind nie gleich, auch wenn sie dieselbe Beschreibung haben.

Eingebaute Symbole hast du schon benutzt: `Symbol.iterator` aus Lektion 49 macht Objekte durchlaufbar.

## Proxy: ein Wächter vor dem Objekt

:::alltag
Denk an den Empfang in einem Bürogebäude. Wer zu einer Abteilung will, muss erst am Empfang vorbei. Der Empfang kann Besucher durchlassen, umleiten, abweisen oder ins Besucherbuch eintragen. Ein **Proxy** ist so ein Empfang vor einem Objekt.
:::

Im Beispiel steht ein Proxy vor einem Konto. Er schreibt jedes Lesen mit und verbietet einen negativen Kontostand:

```js
const konto = { stand: 100 };

const bewacht = new Proxy(konto, {
  get(ziel, name, empfaenger) {
    console.log("gelesen:", String(name));
    return Reflect.get(ziel, name, empfaenger);
  },
  set(ziel, name, wert, empfaenger) {
    if (name === "stand" && wert < 0) {
      throw new RangeError("Kein Dispo erlaubt");
    }
    return Reflect.set(ziel, name, wert, empfaenger);
  },
});

bewacht.stand = 50;
console.log(bewacht.stand);
try {
  bewacht.stand = -10;
} catch (fehler) {
  console.log(fehler.message);
}
```

Zuerst erscheint „gelesen: stand“ und dann 50. Das Setzen auf 50 war erlaubt, und beim Lesen hat der Proxy mitgeschrieben. Danach erscheint „Kein Dispo erlaubt“, denn -10 hat die `set`-Methode abgelehnt.

Am Ende siehst du noch ein paar weitere „gelesen:“-Zeilen. Die stammen von Codewerk selbst: Für das Diagramm schaut es sich nach dem Lauf alle Variablen an, und auch das geht durch den Proxy.

- Das zweite Objekt in `new Proxy(…)` heißt **Handler**. Seine Methoden wie `get`, `set`, `has` oder `deleteProperty` heißen **Fallen**.
- Jede Falle fängt eine Aktion ab und entscheidet, was passiert. `get` fängt das Lesen ab, `set` das Schreiben.

## Reflect: das normale Verhalten

`Reflect` hat für jede Falle eine passende Funktion. Sie tut genau das, was ohne Proxy passiert wäre. Am Ende einer Falle rufst du deshalb meistens `Reflect.get(…)` oder `Reflect.set(…)` auf. Die `set`-Falle muss `true` zurückgeben, wenn das Speichern geklappt hat. `Reflect.set` erledigt das für dich.

## Wofür Proxys gut sind

- Werte beim Setzen prüfen, wie beim Konto oben
- Standardwerte für fehlende Eigenschaften liefern
- Änderungen mitschreiben, zum Beispiel um eine Oberfläche neu zu zeichnen. So funktioniert die automatische Aktualisierung in Vue.

Proxys sind mächtig, aber langsamer und schwerer zu durchschauen als normale Objekte. Setze sie deshalb nur gezielt ein.
