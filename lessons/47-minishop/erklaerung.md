## Alles zusammen: ein kleiner Online-Shop

Du kennst jetzt **Objekte und Klassen** aus Teil 2 und **asynchronen Code** aus Teil 3. Im Abschlussprojekt baust du daraus einen kleinen Shop.

:::alltag
Beim Online-Einkauf passieren drei Dinge. Der **Shop lädt sein Sortiment**, und das dauert einen Moment. Dein **Warenkorb** merkt sich, was du hineinlegst, und rechnet die Summe aus. An der **Kasse** kann etwas schiefgehen, zum Beispiel wenn das Kartenlimit überschritten ist. Dann bekommst du eine verständliche Meldung statt eines Absturzes.
:::

## Jedes Teil hat eine Aufgabe

Der Shop besteht aus drei Teilen. Jedes kümmert sich um genau **eine** Sache:

| Teil | Aufgabe | Werkzeuge |
| --- | --- | --- |
| `Warenkorb` | Artikel merken und zusammenrechnen | Klasse, `#private`, Getter, `reduce`, `map`, `throw` |
| `einkaufen(namen)` | Sortiment laden, Produkte finden, Korb füllen | `async`, `await`, `find`, `throw` |
| `kasse(korb)` | Bezahlen und Fehler abfangen | `async`, `await`, `try` und `catch` |

Das folgende Beispiel zeigt dasselbe Zusammenspiel im Kleinen. Eine Playlist ist eine Klasse mit privatem Feld. Ihre Lieder werden erst geladen und dann eingefügt:

```js
class Playlist {
  #lieder = [];

  hinzufuegen(titel, minuten) {
    if (minuten <= 0) throw new Error("Ein Lied braucht eine Länge.");
    this.#lieder.push({ titel, minuten });
  }

  get dauer() {
    return this.#lieder.reduce((summe, lied) => summe + lied.minuten, 0);
  }
}

function ladeLieder() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ titel: "Morgen", minuten: 3 }, { titel: "Abend", minuten: 4 }]), 200);
  });
}

async function playlistBauen() {
  const liste = new Playlist();
  const lieder = await ladeLieder();
  for (const lied of lieder) {
    liste.hinzufuegen(lied.titel, lied.minuten);
  }
  console.log("Dauer: " + liste.dauer + " Minuten");
}

playlistBauen();
```

Ausgegeben wird „Dauer: 7 Minuten“. `playlistBauen` wartet mit `await` auf die Lieder und legt sie dann einzeln in die Playlist. Der Getter `dauer` zählt mit `reduce` die Minuten zusammen: 3 + 4 ergibt 7. Dein Warenkorb funktioniert genauso, nur mit Preisen statt Minuten.

Im **Diagramm** siehst du am Ende die Klasse `Warenkorb`. Den Korb selbst siehst du dort nicht. Er entsteht **innerhalb** von `start()`, und Variablen in einer Funktion gibt es nur, solange die Funktion läuft.
