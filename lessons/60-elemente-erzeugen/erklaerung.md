## Neue Bausteine einsetzen

In der letzten Lektion hast du vorhandene Elemente verändert. Oft brauchst du aber **neue** Elemente: einen neuen Eintrag in einer Liste, eine neue Nachricht im Chat oder ein neues Produkt im Warenkorb.

:::alltag
Es ist wie beim Lego-Bauen. Erst nimmst du einen neuen Stein aus der Kiste, das ist `createElement`. Dann beschriftest du ihn mit `textContent`. Zuletzt steckst du ihn mit `append` an die richtige Stelle.
:::

Im Beispiel kommt „Milch“ auf die leere Einkaufsliste:

```js
const liste = document.querySelector("#liste");

const eintrag = document.createElement("li");
eintrag.textContent = "Milch";
liste.append(eintrag);

console.log(liste.children.length);
```

Ausgegeben wird 1. Die Liste hat jetzt genau ein Kind, den neuen Eintrag. In der Vorschau steht „Milch“ auf der Liste.

- `document.createElement("li")` baut ein neues Element. Es ist noch nirgends zu sehen.
- `append(…)` hängt es **am Ende** an. `prepend(…)` setzt es an den Anfang.
- Erst nach dem Einfügen erscheint es auf der Seite.

## Viele Elemente aus einem Array

Mit einer Schleife baust du für jeden Eintrag eines Arrays ein Element:

```js
const liste = document.querySelector("#liste");
const artikel = ["Brot", "Käse", "Tomaten"];

for (const name of artikel) {
  const li = document.createElement("li");
  li.textContent = name;
  liste.append(li);
}
```

In der Vorschau stehen danach drei Einträge untereinander, in der Reihenfolge des Arrays.

## Entfernen

Ein Element entfernst du mit `remove()`:

```js
const hinweis = document.querySelector("#leer");
hinweis.remove();
console.log(document.querySelector("#leer"));
```

Ausgegeben wird `null`. Der Absatz „Noch nichts auf der Liste.“ ist von der Seite verschwunden, deshalb findet `querySelector` ihn nicht mehr.

## Vorsicht mit innerHTML

Es gibt eine Abkürzung: `element.innerHTML = "<li>Milch</li>"`. Dabei wird der Text als **HTML gelesen**. Bei festen Texten in deinem eigenen Code ist das in Ordnung. Bei Texten, die von **Nutzern** kommen, ist es gefährlich. Im Beispiel tippt jemand statt eines Artikels HTML-Code ein:

```js
const eingabe = '<img src="x" onerror="console.log(\'Ich bin fremder Code!\')">';

const unsicher = document.createElement("li");
unsicher.innerHTML = eingabe;
document.querySelector("#liste").append(unsicher);

const sicher = document.createElement("li");
sicher.textContent = eingabe;
document.querySelector("#liste").append(sicher);
```

Mit `innerHTML` wird aus der Eingabe ein echtes Bild. Das Bild lässt sich nicht laden, und deshalb läuft der Code in `onerror`. So schleusen Angreifer fremden Code in Webseiten ein. Man nennt das **XSS**, kurz für Cross-Site-Scripting. Mit `textContent` erscheint dieselbe Eingabe einfach als harmloser Text.

:::achtung
Merksatz: Alles, was ein Mensch eintippen kann, kommt mit `textContent` auf die Seite.
:::
