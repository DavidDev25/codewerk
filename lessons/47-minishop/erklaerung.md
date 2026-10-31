## Alles zusammen: ein kleiner Online-Shop

Du kennst jetzt **Objekte und Klassen** aus Teil 2 und **asynchronen Code** aus Teil 3. Im Abschlussprojekt baust du daraus einen kleinen Shop.

:::alltag
Beim Online-Einkauf passiert dreierlei: Der **Shop lädt sein Sortiment** (das dauert einen Moment). Dein **Warenkorb** merkt sich, was du hineinlegst, und rechnet die Summe aus. An der **Kasse** kann etwas schiefgehen, z. B. wenn das Kartenlimit überschritten ist – dann bekommst du eine verständliche Meldung statt eines Absturzes.
:::

Jedes Teil hat **eine** Aufgabe:

| Teil | Aufgabe | Werkzeuge |
| --- | --- | --- |
| `Warenkorb` | Artikel merken und zusammenrechnen | Klasse, `#private`, Getter, `reduce`, `map`, `throw` |
| `einkaufen(namen)` | Sortiment laden, Produkte finden, Korb füllen | `async`, `await`, `find`, `throw` |
| `kasse(korb)` | Bezahlen und Fehler abfangen | `async`, `await`, `try … catch` |

Ein kleines Beispiel für dieses Zusammenspiel – eine Playlist, deren Lieder erst geladen werden:

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

Im **Diagramm** siehst du am Ende die Klasse `Warenkorb`. Den Korb selbst siehst du dort nicht: Er entsteht **innerhalb** von `start()`, und Variablen in einer Funktion gibt es nur, solange die Funktion läuft.
