## Objekte, die etwas können

Bisher haben deine Objekte nur Daten gespeichert. Jetzt bekommen sie auch **Fähigkeiten**. Eine Funktion, die zu einem Objekt gehört, nennt man **Methode**.

:::alltag
Eine Kaffeemaschine hat Daten, zum Beispiel Wasserstand und Bohnen. Sie hat auch Knöpfe, zum Beispiel „Kaffee machen“ und „Entkalken“. Drückst du „Kaffee machen“, benutzt die Maschine **ihr eigenes** Wasser, nicht das der Nachbarmaschine. In JavaScript schreibst du für „mein eigenes“ das Wort `this`.
:::

Im Beispiel hat die Maschine 500 ml Wasser und eine Methode, die bei jedem Kaffee 150 ml verbraucht:

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

Beim ersten Kaffee sind noch 350 ml übrig, beim zweiten 200 ml. Die Methode hat jedes Mal das Wasser von `maschine` verringert.

- `kaffeeMachen() { … }` ist die kurze Schreibweise für eine Methode.
- `this` ist das Objekt, das beim Aufruf **vor dem Punkt** steht. Bei `maschine.kaffeeMachen()` ist `this` also `maschine`.

## Warum nicht einfach den Namen schreiben?

Du könntest auch `maschine.wasser` statt `this.wasser` schreiben. Dann funktioniert die Methode aber nur für genau dieses eine Objekt. Mit `this` funktioniert sie für **jedes** Objekt, das sie benutzt. Im Beispiel teilen sich zwei Objekte dieselbe Funktion:

```js
function vorstellen() {
  return `Ich bin ${this.name}.`;
}

const lea = { name: "Lea", vorstellen };
const tom = { name: "Tom", vorstellen };
console.log(lea.vorstellen());
console.log(tom.vorstellen());
```

Ausgegeben werden „Ich bin Lea.“ und „Ich bin Tom.“. Es ist dieselbe Funktion, aber `this` ist jedes Mal ein anderes Objekt. Genau darauf bauen gleich die **Klassen** auf.

## Die Falle: eine Methode ohne Objekt

`this` wird erst **beim Aufruf** festgelegt. Rufst du eine Methode ohne Objekt davor auf, ist `this` leer. Das Beispiel zeigt den Fehler und wie du ihn vermeidest:

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

`losgeloest()` hat kein Objekt vor dem Punkt. `this` ist deshalb `undefined`, und `this.farbe` führt zu einem Fehler. `gebunden()` klappt dagegen und gibt „Die Lampe leuchtet gelb.“ aus.

`bind(objekt)` liefert eine neue Funktion, deren `this` fest an das Objekt gebunden ist. Das brauchst du, wenn du eine Methode weitergibst, zum Beispiel an einen Timer.

## Arrow-Funktionen haben kein eigenes this

Eine Arrow-Funktion übernimmt das `this` aus ihrer Umgebung. Als Methode taugt sie deshalb nicht. **Innerhalb** einer Methode ist sie aber praktisch:

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

Heraus kommt `["Lea (Team Blau)", "Tom (Team Blau)"]`. Die Arrow-Funktion in `map` sieht das `this` von `liste`, also `team`. Deshalb kennt sie den Teamnamen.
