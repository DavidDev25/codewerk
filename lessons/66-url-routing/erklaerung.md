## Eine Adresse besteht aus Teilen

```text
https://shop.de:443/suche?q=rote+schuhe&seite=2#bewertungen
└─┬─┘   └──┬──┘    └─┬─┘ └──────────┬─────────┘ └────┬────┘
protocol  host   pathname        search            hash
```

Statt Adressen mühsam mit `split` zu zerlegen, gibt es das Werkzeug `URL`:

```js
const url = new URL("https://shop.de/suche?q=rote+schuhe&seite=2#bewertungen");
console.log(url.hostname, url.pathname, url.hash);
console.log(url.searchParams.get("q"), url.searchParams.get("seite"));
console.log(Object.fromEntries(url.searchParams));
```

Auch zum **Bauen** ist es ideal, denn es kodiert Leerzeichen und Umlaute automatisch richtig:

```js
const link = new URL("https://shop.de/suche");
link.searchParams.set("q", "Äpfel & Birnen");
link.searchParams.set("seite", 1);
console.log(link.toString());
```

## Routing: mehrere Ansichten, eine Seite

Moderne Web-Apps („Single Page Apps“) laden die Seite nur einmal und tauschen danach nur noch Inhalte aus. Damit Zurück-Knopf, Lesezeichen und geteilte Links trotzdem funktionieren, steht die aktuelle Ansicht in der **Adresse**. Das Umschalten anhand der Adresse heißt **Routing**.

:::alltag
Ein Einkaufszentrum mit Wegweisern: Das Gebäude bleibt dasselbe, aber die Adresse „Ebene 2, Laden 14“ sagt genau, wo du bist, und jeder kann dich dorthin schicken.
:::

Die einfachste Form nutzt den **Hash** (alles nach `#`). Ändert er sich, lädt der Browser die Seite nicht neu, sondern feuert das Event `hashchange`:

```js
const seiten = { "#/": "Willkommen!", "#/hilfe": "Hier hilft man dir." };

function zeigen() {
  const ziel = location.hash || "#/";
  console.log("Ansicht:", seiten[ziel] ?? "Nicht gefunden");
}

window.addEventListener("hashchange", zeigen);
zeigen();
location.hash = "#/hilfe";
```

## Ohne # : die History-API

Viele Router (auch der von React) nutzen statt des Hashs „echte“ Pfade wie `/produkte`. Dafür gibt es `history.pushState(daten, "", "/produkte")`, das die Adresse ändert, ohne neu zu laden, und das Event `popstate` für den Zurück-Knopf. Das braucht aber einen Server, der für jeden Pfad dieselbe Seite ausliefert. In der Codewerk-Vorschau übst du deshalb das Hash-Routing. Das Prinzip ist dasselbe.

## Barrierefreie Navigation

Markiere den aktiven Link mit `aria-current="page"`. Screenreader sagen dann „aktuelle Seite“, und du kannst ihn per CSS hervorheben.
