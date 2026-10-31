## JavaScript trifft die Webseite

Bis jetzt hat dein Code nur gerechnet und mit `console.log` ausgegeben. Im Browser kann JavaScript aber noch viel mehr: Es kann die **Seite selbst** verändern. Ab dieser Lektion gibt es dafür rechts den Reiter **Vorschau**. Dort siehst du die Seite, auf der dein Code läuft.

:::alltag
Eine Webseite ist wie ein Haus aus Legosteinen. Der Browser baut aus dem HTML einen **Baum** aus Bausteinen: das Dokument enthält den `body`, der enthält eine Überschrift, eine Liste, die Liste enthält Einträge … Diesen Baum nennt man **DOM** (Document Object Model). Mit JavaScript kannst du jeden Stein finden, umfärben, beschriften oder austauschen.
:::

Die Seite dieser Lektion sieht so aus:

```html
<h1 id="titel">Mein Laden</h1>
<p class="hinweis">Heute geöffnet bis 18 Uhr</p>
<ul id="angebote">
  <li>Äpfel</li>
  <li>Birnen</li>
  <li>Kirschen</li>
</ul>
<button id="knopf">Bestellen</button>
```

## Elemente finden

`document` ist der Eingang zum ganzen Baum. Mit `querySelector` findest du ein Element über einen **CSS-Selektor**:

```js
const titel = document.querySelector("#titel");
console.log(titel.textContent);

const hinweis = document.querySelector(".hinweis");
console.log(hinweis.textContent);

const ersterEintrag = document.querySelector("li");
console.log(ersterEintrag.textContent);
```

| Selektor | findet |
| --- | --- |
| `"#titel"` | das Element mit `id="titel"` |
| `".hinweis"` | Elemente mit `class="hinweis"` |
| `"li"` | Elemente vom Typ `<li>` |
| `"#angebote li"` | `<li>` innerhalb von `#angebote` |

`querySelector` liefert das **erste** passende Element oder `null`. Für **alle** passenden nimmst du `querySelectorAll`:

```js
const eintraege = document.querySelectorAll("#angebote li");
console.log(eintraege.length);
for (const li of eintraege) {
  console.log(li.textContent);
}
```

## Elemente ändern

```js
const titel = document.querySelector("#titel");
titel.textContent = "Willkommen!";

const hinweis = document.querySelector(".hinweis");
hinweis.classList.add("wichtig");

const knopf = document.querySelector("#knopf");
knopf.disabled = true;
knopf.title = "Gerade geschlossen";
knopf.dataset.produkt = "obst";
```

| Was | Wie |
| --- | --- |
| Text | `element.textContent = "…"` |
| CSS-Klasse | `element.classList.add("…")`, `.remove(…)`, `.toggle(…)`, `.contains(…)` |
| Attribut | `element.title = "…"` oder `element.setAttribute("title", "…")` |
| `data-…`-Attribut | `element.dataset.produkt = "…"` wird zu `data-produkt="…"` |
| Aussehen direkt | `element.style.color = "red"` (meist besser: eine Klasse) |

Drücke **Ausführen** und schau in den Reiter **Vorschau**: Die Änderungen siehst du sofort. Im **Diagramm** erscheinen Elemente als kleine Kästchen wie `<h1#titel>`.
