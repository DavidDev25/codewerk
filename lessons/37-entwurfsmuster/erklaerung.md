## Bewährte Lösungen für wiederkehrende Probleme

Viele Probleme beim Programmieren tauchen immer wieder auf. Für die häufigsten gibt es erprobte Bauanleitungen mit festen Namen. Man nennt sie **Entwurfsmuster**. Wer die Namen kennt, versteht fremden Code schneller und kann sich im Team kurz verständigen, etwa mit „Mach das als Observer“.

## Observer: Bescheid sagen statt nachfragen

:::alltag
Denk an ein Zeitungsabo. Du rufst nicht jeden Morgen beim Verlag an und fragst, ob es etwas Neues gibt. Du **abonnierst** einmal, und der Verlag schickt dir jede neue Ausgabe. Abbestellen kannst du jederzeit.
:::

Beim Muster **Observer**, auf Deutsch „Beobachter“, melden sich Funktionen für ein Ereignis an. Tritt das Ereignis ein, werden alle angemeldeten Funktionen aufgerufen. Im Beispiel melden sich Lager und Mail-Versand für neue Bestellungen an:

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

Ausgegeben werden „Lager: packe Buch“ und „Mail an Lea“. So arbeiten die beiden Methoden:

- `on` legt eine Funktion in der Map ab, und zwar in der Liste für diesen Ereignisnamen.
- `emit` holt die Liste für den Namen und ruft jede Funktion darin mit den Daten auf. Gibt es noch keine Liste, sorgt `?? []` dafür, dass die Schleife einfach nichts tut.

Der Vorteil: Wer das Ereignis auslöst, muss nicht wissen, wer alles zuhört. Lager und Mail-Versand lassen sich unabhängig voneinander hinzufügen oder entfernen. Genau so funktionieren `addEventListener` im Browser und Ereignisse in Node.js, die du später kennenlernst.

## Factory: Objekte an einer Stelle bauen

Eine **Factory**, auf Deutsch „Fabrik“, ist eine Funktion, die entscheidet, **welche** Klasse gebaut wird. Wer sie benutzt, muss die einzelnen Klassen gar nicht kennen:

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

Ausgegeben wird „png“. Für die Art `"foto"` hat die Factory ein `Bild` gebaut. Kommt später eine neue Dateiart dazu, änderst du nur die Factory. Der restliche Code bleibt gleich.

## Weitere Muster, die dir begegnen

| Muster | Idee |
| --- | --- |
| Singleton | Es gibt genau **ein** Objekt dieser Art, zum Beispiel die Einstellungen |
| Strategy | Das Verhalten wird als Funktion übergeben und ist austauschbar, wie bei `sort((a, b) => …)` |
| Decorator | Eine Funktion umhüllt eine andere und ergänzt etwas, wie `merken` in Lektion 25 |
| Komposition | Objekte aus kleinen Teilen zusammensetzen, wie in Lektion 35 |
