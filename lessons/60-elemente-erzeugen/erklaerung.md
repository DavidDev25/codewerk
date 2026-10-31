## Neue Bausteine einsetzen

In der letzten Lektion hast du vorhandene Elemente verändert. Oft müssen aber **neue** Elemente her: ein neuer Eintrag in einer Liste, eine neue Nachricht im Chat, ein neues Produkt im Warenkorb.

:::alltag
Wie beim Lego-Bauen: Erst nimmst du einen neuen Stein aus der Kiste (`createElement`), dann beschriftest du ihn (`textContent`), und zuletzt steckst du ihn an die richtige Stelle (`append`).
:::

```js
const liste = document.querySelector("#liste");

const eintrag = document.createElement("li");
eintrag.textContent = "Milch";
liste.append(eintrag);

console.log(liste.children.length);
```

- `document.createElement("li")` baut ein neues, noch unsichtbares Element.
- `append(…)` hängt es **am Ende** an. `prepend(…)` setzt es an den Anfang.
- Erst nach dem Einfügen erscheint es auf der Seite.

## Viele Elemente aus einem Array

```js
const liste = document.querySelector("#liste");
const artikel = ["Brot", "Käse", "Tomaten"];

for (const name of artikel) {
  const li = document.createElement("li");
  li.textContent = name;
  liste.append(li);
}
```

## Entfernen

```js
const hinweis = document.querySelector("#leer");
hinweis.remove();
console.log(document.querySelector("#leer"));
```

## Vorsicht mit innerHTML

Es gibt eine Abkürzung: `element.innerHTML = "<li>Milch</li>"`. Der Text wird dabei als **HTML gelesen**. Bei festen Texten im eigenen Code ist das in Ordnung. Bei Texten, die von **Nutzern** kommen, ist es gefährlich:

```js
const eingabe = '<img src="x" onerror="console.log(\'Ich bin fremder Code!\')">';

const unsicher = document.createElement("li");
unsicher.innerHTML = eingabe;
document.querySelector("#liste").append(unsicher);

const sicher = document.createElement("li");
sicher.textContent = eingabe;
document.querySelector("#liste").append(sicher);
```

Mit `innerHTML` wird aus der Eingabe ein echtes Bild, und dessen `onerror`-Code läuft. So schleusen Angreifer fremden Code in Webseiten ein (das nennt man **XSS**, Cross-Site-Scripting). Mit `textContent` erscheint die Eingabe einfach als Text.

:::alltag
Merksatz: Alles, was ein Mensch eintippen kann, kommt mit `textContent` auf die Seite.
:::
