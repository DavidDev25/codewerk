## Deine erste echte Web-App

Zum Abschluss baust du eine App, wie sie oft in Bewerbungsgesprächen als Übung verlangt wird: eine **To-do-Liste**. Sie braucht alles aus Teil 6: Elemente erzeugen, Events, ein Formular und `localStorage`.

## Das wichtigste Prinzip: erst die Daten

Anfänger ändern bei jeder Aktion direkt die Seite: hier ein `<li>` dazu, dort eins weg. Das wird schnell unübersichtlich. Erfahrene Entwickler trennen zwei Dinge:

1. **Die Daten:** ein Array mit Objekten, zum Beispiel `{ text: "Einkaufen", erledigt: false }`. Nur was hier steht, gilt.
2. **Die Anzeige:** Eine Funktion `zeichnen()` baut die Liste auf der Seite **jedes Mal komplett neu** aus dem Array.

Jede Aktion läuft dann gleich ab: **Daten ändern, speichern, zeichnen.**

:::alltag
Denk an ein Videospiel. Das Spiel ändert nie direkt einzelne Bildpunkte. Es ändert den Spielstand, also Leben, Position und so weiter. Der Bildschirm wird daraus 60-mal pro Sekunde neu gezeichnet. Genau diese Idee steckt auch hinter **React**, das du später kennenlernst.
:::

Im Beispiel zeichnet `zeichnen()` zwei Einträge aus dem Array auf die Seite:

```js
const daten = [{ text: "Brot", erledigt: false }, { text: "Milch", erledigt: true }];

function zeichnen() {
  const liste = document.querySelector("#aufgaben");
  liste.replaceChildren();
  daten.forEach((eintrag, index) => {
    const li = document.createElement("li");
    li.textContent = (eintrag.erledigt ? "✓ " : "") + eintrag.text;
    li.dataset.index = index;
    liste.append(li);
  });
}

zeichnen();
console.log(document.querySelectorAll("#aufgaben li").length);
```

Ausgegeben wird 2. In der Vorschau stehen „Brot“ und „✓ Milch“, denn die Milch ist erledigt.

- `replaceChildren()` ohne Werte leert ein Element. So fängt jedes Zeichnen bei einer leeren Liste an.
- `data-index` merkt sich auf jedem `<li>`, zu welchem Eintrag im Array es gehört. Damit findest du beim Klick den richtigen Eintrag.

## Bausteine aus den letzten Lektionen

| Baustein | Lektion |
| --- | --- |
| `createElement`, `append`, `textContent` | 60 |
| Event-Delegation mit `closest` | 61 |
| `submit` und `preventDefault` | 64 |
| `localStorage` mit JSON | 65 |
| `filter` zum Löschen und Zählen | 17 |
