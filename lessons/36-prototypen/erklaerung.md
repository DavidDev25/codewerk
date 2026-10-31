## Wo die Methoden wohnen

Du hast mit `class` schon Baupläne geschrieben. Jetzt schaust du nach, was dabei im Hintergrund passiert. JavaScript hatte lange gar keine Klassen. `class` ist eine bequeme Schreibweise für etwas, das es schon immer gab: **Prototypen**.

:::alltag
In einer WG hat jeder ein eigenes Zimmer mit eigenen Sachen. Die Küche teilen sich alle. Suchst du etwas und findest es nicht in deinem Zimmer, schaust du in der Küche nach. Das eigene Zimmer sind die **eigenen Eigenschaften** eines Objekts. Die Küche ist sein **Prototyp**.
:::

Im Beispiel gibt es zwei Katzen. Du prüfst, was jeder Katze selbst gehört und was sie sich teilen:

```js
class Katze {
  constructor(name) {
    this.name = name;
  }
  miau() {
    return `${this.name} sagt Miau`;
  }
}

const minka = new Katze("Minka");
const felix = new Katze("Felix");

console.log(Object.keys(minka));
console.log(minka.miau === felix.miau);
console.log(Object.getPrototypeOf(minka) === Katze.prototype);
```

Die erste Zeile gibt `["name"]` aus. Nur der Name gehört `minka` selbst, die Methode `miau` nicht. Die zweite Zeile gibt `true` aus: Beide Katzen benutzen genau dieselbe Methode. Die dritte Zeile zeigt, wo diese Methode wohnt. Der Prototyp von `minka` ist `Katze.prototype`.

- `name` gehört jedem Objekt selbst. Das ist das eigene Zimmer.
- `miau` gibt es nur **einmal**, auf `Katze.prototype`. Das ist die Küche, die sich alle Katzen teilen.
- Schreibst du `minka.miau`, sucht JavaScript zuerst bei `minka`. Dort findet es nichts und schaut deshalb im Prototyp nach.

## Die Kette der Prototypen

Auch ein Prototyp hat wieder einen Prototyp. Ganz oben steht `Object.prototype`. Von dort kommen Methoden wie `toString`, die jedes Objekt kennt:

```js
const minka = { name: "Minka" };
console.log(minka.toString());
console.log(Object.hasOwn(minka, "name"));
console.log(Object.hasOwn(minka, "toString"));
```

`toString` gibt „[object Object]“ aus. Die Methode funktioniert, obwohl du sie nie geschrieben hast. `Object.hasOwn` fragt, ob eine Eigenschaft dem Objekt **selbst** gehört. Bei `name` ist das `true`, bei `toString` ist es `false`, weil `toString` aus dem Prototyp kommt.

Bei Vererbung mit `extends` wird die Kette einfach länger. Ein Hund sucht zuerst bei sich, dann bei `Hund`, dann bei `Tier` und zuletzt bei `Object`.

## Objekte direkt verketten

Mit `Object.create(vorlage)` baust du ein Objekt, dessen Prototyp `vorlage` ist. Dafür brauchst du gar keine Klasse:

```js
const tier = {
  vorstellen() {
    return `Ich bin ${this.name}.`;
  },
};

const bello = Object.create(tier);
bello.name = "Bello";
console.log(bello.vorstellen());
console.log(Object.hasOwn(bello, "vorstellen"));
```

Ausgegeben werden „Ich bin Bello.“ und `false`. `bello` hat selbst nur den Namen. `vorstellen` findet JavaScript in `tier`, dem Prototyp von `bello`.

## Klassen von früher

In älterem Code und in vielen Anleitungen siehst du statt `class` eine normale Funktion, die mit `new` aufgerufen wird. So eine Funktion heißt **Konstruktorfunktion**. Die Methoden legt man dort von Hand auf den Prototyp:

```js
function Kreis(radius) {
  this.radius = radius;
}

Kreis.prototype.flaeche = function () {
  return Math.round(Math.PI * this.radius ** 2);
};

const k = new Kreis(2);
console.log(k.flaeche());
```

Ausgegeben wird 13, also π · 2 · 2 gerundet. Genau das erledigt `class` heute für dich. Für neuen Code nimmst du `class`. Jetzt weißt du aber, was dabei passiert.

:::achtung
Ändere nie die Prototypen von eingebauten Typen wie `Array.prototype`. Das betrifft dann jedes Array im ganzen Programm, auch in fremden Bibliotheken.
:::
