## Bescheid sagen statt nachfragen

Im Browser kennst du Events schon, zum Beispiel `button.addEventListener("click", …)`. Node benutzt dasselbe Prinzip für alles, was irgendwann passiert: Ein Server bekommt eine Anfrage, eine Datei ist fertig gelesen, ein Programm wird beendet. Die Grundlage dafür ist die Klasse `EventEmitter` aus `node:events`.

:::alltag
Denk an einen Paketdienst. Du meldest dich einmal für die Nachricht „Paket zugestellt“ an, das ist `on`. Der Dienst schickt die Nachricht, sobald es so weit ist, das ist `emit`. Du musst nicht alle fünf Minuten an der Tür nachsehen.
:::

## on und emit

Im Beispiel klingelt es zweimal an einer Tür:

```js
const { EventEmitter } = require("node:events");

const tuer = new EventEmitter();

tuer.on("klingeln", (name) => {
  console.log(`${name} steht vor der Tür`);
});

tuer.emit("klingeln", "Mara");
tuer.emit("klingeln", "Ali");
```

Ausgegeben werden „Mara steht vor der Tür“ und „Ali steht vor der Tür“. Jedes `emit` ruft den Listener mit dem mitgegebenen Namen auf.

- `on(name, funktion)` meldet einen **Listener** an. Es dürfen beliebig viele sein.
- `emit(name, …werte)` ruft alle Listener **sofort und der Reihe nach** auf. Es wartet also nicht wie ein Timer. Es gibt `true` zurück, wenn es mindestens einen Listener gab.
- Die Namen der Events darfst du frei wählen.

## Nur einmal hören und abmelden

Im Beispiel spielt ein Radio drei Lieder. Ein Listener hört immer zu, ein anderer nur beim ersten Lied:

```js
const { EventEmitter } = require("node:events");
const radio = new EventEmitter();

const melden = (lied) => console.log("läuft:", lied);
radio.on("lied", melden);
radio.once("lied", () => console.log("Das erste Lied heute!"));

radio.emit("lied", "Song A");
radio.emit("lied", "Song B");
radio.off("lied", melden);
console.log(radio.emit("lied", "Song C"), radio.listenerCount("lied"));
```

Bei Song A erscheinen „läuft: Song A“ und „Das erste Lied heute!“. Bei Song B erscheint nur noch „läuft: Song B“. Danach meldet `off` auch `melden` ab. Bei Song C hört niemand mehr zu, deshalb gibt die letzte Zeile `false` und `0` aus.

- `once` hört nur auf das **nächste** Event und meldet sich danach selbst ab.
- `off` braucht **dieselbe** Funktion wie `on`. Deshalb speichert man sie vorher in einer Variable wie `melden`. Mit einer neuen Arrow-Funktion klappt das Abmelden nicht.

## Eigene Klassen, die Bescheid sagen

Meistens erbt eine Klasse von `EventEmitter`. Dann kann sie selbst mit `this.emit` Bescheid sagen. Im Beispiel meldet ein Timer jede Sekunde und das Ende:

```js
const { EventEmitter } = require("node:events");

class Timer extends EventEmitter {
  constructor() {
    super();
    this.sekunden = 0;
  }
  tick() {
    this.sekunden++;
    this.emit("tick", this.sekunden);
    if (this.sekunden === 3) this.emit("fertig");
  }
}

const t = new Timer();
t.on("tick", (s) => console.log("Sekunde", s));
t.on("fertig", () => console.log("Zeit ist um!"));
t.tick(); t.tick(); t.tick();
```

Ausgegeben werden „Sekunde 1“, „Sekunde 2“, „Sekunde 3“ und „Zeit ist um!“. Beim dritten `tick` löst der Timer zusätzlich `"fertig"` aus.

Genau so funktioniert der HTTP-Server in der nächsten Lektion. Er ist ein `EventEmitter`, der bei jeder Anfrage das Event `"request"` auslöst.

## Das besondere error-Event

Ein `"error"`-Event, für das es keinen Listener gibt, **wirft** den Fehler. Das Programm stürzt also ab, wenn niemand zuhört. Das ist Absicht, denn Fehler sollen nicht unbemerkt verschwinden. Im Beispiel hört jemand zu:

```js
const { EventEmitter } = require("node:events");
const leitung = new EventEmitter();

leitung.on("error", (fehler) => console.log("Abgefangen:", fehler.message));
leitung.emit("error", new Error("Verbindung weg"));
```

Ausgegeben wird „Abgefangen: Verbindung weg“. Ohne den Listener würde das Programm hier abbrechen.

Eine Faustregel: Jeder Emitter, der `"error"` auslösen kann, bekommt einen Listener für `"error"`.

## Auf ein Event warten

Mit der Funktion `once` aus `node:events` wird ein Event zu einem Promise. Im Beispiel ist der Ofen nach 50 Millisekunden fertig:

```js
const { EventEmitter, once } = require("node:events");
const ofen = new EventEmitter();

setTimeout(() => ofen.emit("fertig", "Pizza"), 50);

once(ofen, "fertig").then(([gericht]) => console.log(gericht, "ist fertig"));
```

Ausgegeben wird „Pizza ist fertig“. Das Promise liefert alle Werte des Events als Array. Deshalb packt `[gericht]` den ersten Wert aus.
