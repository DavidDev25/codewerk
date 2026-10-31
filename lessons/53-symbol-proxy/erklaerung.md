## Code, der Code beeinflusst

Diese Lektion zeigt Werkzeuge, mit denen Bibliotheken wie Vue oder Datenbank-Tools arbeiten. Man nennt das **Metaprogrammierung**: Code, der das Verhalten von anderem Code verändert.

## Symbol: einzigartige Schlüssel

Ein `Symbol` ist ein Wert, der garantiert einmalig ist. Als Schlüssel in einem Objekt kollidiert er nie mit anderen Eigenschaften und ist bei normaler Aufzählung unsichtbar:

```js
const ID = Symbol("id");
const nutzer = { name: "Lea", [ID]: 4711 };

console.log(nutzer[ID]);
console.log(Object.keys(nutzer));
console.log(JSON.stringify(nutzer));
console.log(Symbol("id") === Symbol("id"));
```

Eingebaute Symbole hast du schon benutzt: `Symbol.iterator` (Lektion 49) macht Objekte durchlaufbar.

## Proxy: ein Torwächter vor dem Objekt

:::alltag
Ein Empfang im Bürogebäude: Wer zu einer Abteilung will, geht erst am Empfang vorbei. Der Empfang kann Besucher durchlassen, umleiten, abweisen oder ins Besucherbuch eintragen. Ein **Proxy** ist so ein Empfang vor einem Objekt.
:::

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

- Das zweite Objekt heißt **Handler**. Seine Methoden (`get`, `set`, `has`, `deleteProperty` …) heißen **Fallen** (Traps).
- Jede Falle fängt eine Aktion ab und entscheidet, was passiert.

## Reflect: das normale Verhalten

`Reflect` hat für jede Falle eine passende Funktion, die genau das tut, was ohne Proxy passiert wäre. Am Ende einer Falle rufst du deshalb meist `Reflect.get(…)` oder `Reflect.set(…)` auf. `set` muss `true` zurückgeben, wenn es geklappt hat, und `Reflect.set` erledigt das für dich.

## Wofür Proxys gut sind

- Prüfen von Werten beim Setzen (Validierung)
- Standardwerte für fehlende Eigenschaften
- Änderungen mitschreiben, zum Beispiel um eine Oberfläche neu zu zeichnen. So funktioniert die „Reaktivität“ in Vue.

Proxys sind mächtig, aber langsamer und schwerer zu durchschauen als normale Objekte. Nutze sie gezielt.
