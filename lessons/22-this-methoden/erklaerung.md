## Objekte, die etwas können

Bisher haben deine Objekte nur Daten gespeichert. Jetzt bekommen sie **Fähigkeiten**: Funktionen, die zu einem Objekt gehören, heißen **Methoden**.

:::alltag
Eine Kaffeemaschine hat Daten (Wasserstand, Bohnen) und Knöpfe (Kaffee machen, entkalken). Drückst du „Kaffee machen“, benutzt die Maschine **ihr eigenes** Wasser, nicht das der Nachbarmaschine. In JavaScript heißt „mein eigenes“ `this`.
:::

```js
const maschine = {
  wasser: 500,
  kaffeeMachen() {
    this.wasser -= 150;
    return `Kaffee fertig, noch ${this.wasser} ml Wasser.`;
  },
};

console.log(maschine.kaffeeMachen());
console.log(maschine.kaffeeMachen());
```

- `kaffeeMachen() { … }` ist die Kurzschreibweise für eine Methode.
- `this` ist das Objekt **vor dem Punkt** beim Aufruf. Bei `maschine.kaffeeMachen()` ist `this` also `maschine`.

## Warum nicht einfach den Namen schreiben?

Du könntest `maschine.wasser` statt `this.wasser` schreiben. Dann funktioniert die Methode aber nur für genau dieses eine Objekt. Mit `this` funktioniert sie für **jedes** Objekt, das sie benutzt:

```js
function vorstellen() {
  return `Ich bin ${this.name}.`;
}

const lea = { name: "Lea", vorstellen };
const tom = { name: "Tom", vorstellen };
console.log(lea.vorstellen());
console.log(tom.vorstellen());
```

Dieselbe Funktion, zwei Objekte, zwei Ergebnisse. Genau darauf bauen gleich die **Klassen** auf.

## Die Falle: Methode ohne Objekt

`this` wird erst **beim Aufruf** festgelegt. Rufst du eine Methode ohne Objekt davor auf, ist `this` leer:

```js
const lampe = {
  farbe: "gelb",
  zeigen() {
    return `Die Lampe leuchtet ${this.farbe}.`;
  },
};

const losgeloest = lampe.zeigen;
try {
  console.log(losgeloest());
} catch (fehler) {
  console.log("Fehler:", fehler.message);
}

const gebunden = lampe.zeigen.bind(lampe);
console.log(gebunden());
```

Mit `bind(objekt)` bekommst du eine Funktion, deren `this` fest an das Objekt gebunden ist. Das brauchst du, wenn du eine Methode weitergibst, zum Beispiel an einen Timer.

## Arrow-Funktionen haben kein eigenes this

Eine Arrow-Funktion übernimmt das `this` ihrer Umgebung. Als Methode taugt sie deshalb nicht, **innerhalb** einer Methode ist sie aber praktisch:

```js
const team = {
  name: "Blau",
  mitglieder: ["Lea", "Tom"],
  liste() {
    return this.mitglieder.map((person) => `${person} (Team ${this.name})`);
  },
};

console.log(team.liste());
```

Die Arrow-Funktion in `map` sieht das `this` von `liste`, also `team`.
