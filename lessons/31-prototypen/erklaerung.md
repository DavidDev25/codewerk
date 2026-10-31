## Wo wohnen die Methoden?

Du hast mit `class` Baupläne geschrieben. Jetzt schauen wir unter die Motorhaube. JavaScript hatte lange gar keine Klassen. `class` ist eine bequeme Schreibweise für etwas, das es schon immer gab: **Prototypen**.

:::alltag
In einer WG hat jeder sein eigenes Zimmer mit eigenen Sachen. Die Küche teilen sich alle. Suchst du etwas und findest es nicht in deinem Zimmer, schaust du in der Küche nach. Das eigene Zimmer sind die **eigenen Eigenschaften** eines Objekts, die Küche ist sein **Prototyp**.
:::

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

- `name` gehört jedem Objekt selbst (eigenes Zimmer).
- `miau` gibt es nur **einmal**, auf `Katze.prototype` (Küche). Alle Katzen teilen sie.
- Fragst du `minka.miau`, sucht JavaScript erst bei `minka`, findet nichts und schaut dann im Prototyp nach.

## Die Prototyp-Kette

Auch der Prototyp hat wieder einen Prototyp. Ganz oben steht `Object.prototype`. Daher kommen Methoden wie `toString` oder `hasOwnProperty`, die jedes Objekt kennt:

```js
const minka = { name: "Minka" };
console.log(minka.toString());
console.log(Object.hasOwn(minka, "name"));
console.log(Object.hasOwn(minka, "toString"));
```

Bei Vererbung mit `extends` wird die Kette einfach länger: `Hund` → `Tier` → `Object`.

## Objekte direkt verketten

Mit `Object.create(vorlage)` baust du ein Objekt, dessen Prototyp `vorlage` ist, ganz ohne Klasse:

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

## Klassen von früher: Konstruktorfunktionen

In älterem Code und in vielen Anleitungen siehst du statt `class` eine normale Funktion mit `new`. Methoden werden dann von Hand auf den Prototyp gelegt:

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

Das ist genau das, was `class` heute für dich erledigt. Für neuen Code nimmst du `class`. Aber jetzt weißt du, was dabei passiert.

:::alltag
Ändere nie die Prototypen von eingebauten Typen wie `Array.prototype`. Das betrifft dann jedes Array im ganzen Programm, auch in fremden Bibliotheken.
:::
