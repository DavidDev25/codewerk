## Bescheid sagen statt nachfragen

Im Browser kennst du Events schon: `button.addEventListener("click", …)`. Node hat dasselbe Prinzip für alles, was „irgendwann“ passiert: Ein Server bekommt eine Anfrage, eine Datei ist fertig gelesen, ein Programm wird beendet. Die Grundlage dafür ist die Klasse `EventEmitter` aus `node:events`.

:::alltag
Ein Paketdienst: Du meldest dich einmal für „Paket zugestellt“ an (`on`). Der Dienst schickt die Nachricht (`emit`), sobald es so weit ist. Du musst nicht alle fünf Minuten an der Tür nachsehen.
:::

## on und emit

```js
const { EventEmitter } = require("node:events");

const tuer = new EventEmitter();

tuer.on("klingeln", (name) => {
  console.log(`${name} steht vor der Tür`);
});

tuer.emit("klingeln", "Mara");
tuer.emit("klingeln", "Ali");
```

- `on(name, funktion)` meldet einen **Listener** an. Es dürfen beliebig viele sein.
- `emit(name, …werte)` ruft alle Listener **sofort und der Reihe nach** auf (synchron!) und gibt `true` zurück, wenn es mindestens einen gab.
- Event-Namen sind frei wählbare Texte.

## once und off

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

- `once` hört nur auf das **nächste** Event und meldet sich danach selbst ab.
- `off` braucht **dieselbe** Funktion wie `on`. Deshalb speichert man sie vorher in einer Variablen. Mit einer neuen Arrow-Funktion klappt das Abmelden nicht.

## Eigene Klassen, die Events auslösen

Meist erbt man von `EventEmitter`. Dann kann die Klasse selbst mit `this.emit` Bescheid sagen:

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

So funktioniert `http.Server` in der nächsten Lektion: ein `EventEmitter`, der bei jeder Anfrage `"request"` auslöst.

## Das besondere error-Event

Ein `"error"`-Event ohne Listener **wirft** den Fehler. Das Programm stürzt also ab, wenn niemand zuhört. Das ist Absicht: Fehler sollen nicht unbemerkt verschwinden.

```js
const { EventEmitter } = require("node:events");
const leitung = new EventEmitter();

leitung.on("error", (fehler) => console.log("Abgefangen:", fehler.message));
leitung.emit("error", new Error("Verbindung weg"));
```

Faustregel: Jeder Emitter, der `"error"` auslösen kann, bekommt einen `"error"`-Listener.

## Auf ein Event warten

Mit `once` aus `node:events` wird ein Event zu einem Promise:

```js
const { EventEmitter, once } = require("node:events");
const ofen = new EventEmitter();

setTimeout(() => ofen.emit("fertig", "Pizza"), 50);

once(ofen, "fertig").then(([gericht]) => console.log(gericht, "ist fertig"));
```
