## Deine erste echte Web-App

Zum Abschluss baust du eine App, wie sie in vielen Bewerbungsgesprächen als Übung verlangt wird: eine **To-do-Liste**. Sie braucht alles aus Teil 5: Elemente erzeugen, Events, ein Formular und `localStorage`.

## Das wichtigste Prinzip: Daten zuerst

Anfänger ändern bei jeder Aktion direkt die Seite: hier ein `<li>` dazu, dort eins weg. Das wird schnell chaotisch. Profis trennen zwei Dinge:

1. **Die Daten:** ein Array mit Objekten, zum Beispiel `{ text: "Einkaufen", erledigt: false }`. Das ist die einzige Wahrheit.
2. **Die Anzeige:** Eine Funktion `zeichnen()` baut die Liste auf der Seite **jedes Mal komplett neu** aus dem Array.

Jede Aktion läuft dann gleich ab: **Daten ändern → speichern → zeichnen.**

:::alltag
Wie ein Spielstand und der Bildschirm im Videospiel: Das Spiel ändert nie direkt Pixel. Es ändert den Spielstand (Leben, Position …), und der Bildschirm wird daraus 60-mal pro Sekunde neu gezeichnet. Genau dieses Prinzip steckt auch hinter **React**, das du später kennenlernst.
:::

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

- `replaceChildren()` ohne Werte leert ein Element.
- `data-index` merkt sich auf jedem `<li>`, zu welchem Eintrag im Array es gehört. Damit findest du beim Klick den richtigen Eintrag.

## Bausteine aus den letzten Lektionen

| Baustein | Lektion |
| --- | --- |
| `createElement`, `append`, `textContent` | 60 |
| Event-Delegation mit `closest` | 61 |
| `submit` und `preventDefault` | 64 |
| `localStorage` mit JSON | 65 |
| `filter` zum Löschen und Zählen | 17 |
