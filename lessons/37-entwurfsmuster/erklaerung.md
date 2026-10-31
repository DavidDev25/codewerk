## Bewährte Lösungen für wiederkehrende Probleme

Viele Programmierprobleme tauchen immer wieder auf. Für die häufigsten gibt es **Entwurfsmuster**: erprobte Bauanleitungen mit festen Namen. Wer die Namen kennt, versteht fremden Code schneller und kann sich im Team kurz verständigen („Mach das als Observer“).

## Observer: Bescheid sagen statt nachfragen

:::alltag
Ein Zeitungsabo: Du rufst nicht jeden Morgen beim Verlag an und fragst, ob es etwas Neues gibt. Du **abonnierst** einmal, und der Verlag schickt dir jede neue Ausgabe. Abbestellen geht jederzeit.
:::

Beim **Observer**-Muster (auch Publish/Subscribe genannt) melden sich Funktionen für ein Ereignis an. Tritt das Ereignis ein, werden alle aufgerufen:

```js
class Nachrichten {
  #abos = new Map();

  on(name, fn) {
    const liste = this.#abos.get(name) ?? [];
    this.#abos.set(name, [...liste, fn]);
  }

  emit(name, daten) {
    for (const fn of this.#abos.get(name) ?? []) {
      fn(daten);
    }
  }
}

const shop = new Nachrichten();
shop.on("bestellung", (b) => console.log("Lager: packe", b.artikel));
shop.on("bestellung", (b) => console.log("Mail an", b.kunde));
shop.emit("bestellung", { artikel: "Buch", kunde: "Lea" });
```

Der Vorteil: Wer das Ereignis auslöst, muss nicht wissen, wer alles zuhört. Lager und Mail-Versand lassen sich unabhängig hinzufügen oder entfernen. Genau so funktionieren `addEventListener` im Browser und Ereignisse in Node.js.

## Factory: Objekte zentral erzeugen

Eine **Factory** ist eine Funktion, die entscheidet, **welche** Klasse gebaut wird. Wer sie benutzt, braucht die einzelnen Klassen nicht zu kennen:

```js
class Pdf { endung() { return "pdf"; } }
class Bild { endung() { return "png"; } }

function dateiErstellen(art) {
  if (art === "dokument") return new Pdf();
  if (art === "foto") return new Bild();
  return null;
}

console.log(dateiErstellen("foto").endung());
```

Kommt später eine neue Dateiart dazu, änderst du nur die Factory. Der restliche Code bleibt gleich.

## Weitere Muster, die dir begegnen

| Muster | Idee |
| --- | --- |
| Singleton | Es gibt genau **ein** Objekt, z. B. eine Konfiguration |
| Strategy | Austauschbares Verhalten als übergebene Funktion (wie `sort((a, b) => …)`) |
| Decorator | Eine Funktion umhüllt eine andere und ergänzt etwas (wie `merken` in Lektion 25) |
| Komposition | Objekte aus kleinen Teilen zusammensetzen (Lektion 35) |
