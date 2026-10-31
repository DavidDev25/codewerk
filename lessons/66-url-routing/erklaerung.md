## Eine Adresse besteht aus Teilen

Jede Adresse im Internet ist aus festen Teilen zusammengesetzt. Jeder Teil hat einen englischen Namen:

```text
https://shop.de:443/suche?q=rote+schuhe&seite=2#bewertungen
└─┬─┘   └──┬──┘    └─┬─┘ └──────────┬─────────┘ └────┬────┘
protocol  host   pathname        search            hash
```

Vorne steht das Protokoll, dann der Server. Nach dem Schrägstrich kommt der Pfad. Hinter `?` stehen Suchangaben, hinter `#` eine Stelle auf der Seite.

Statt Adressen mühsam mit `split` zu zerlegen, gibt es das Werkzeug `URL`. Im Beispiel holst du die einzelnen Teile heraus:

```js
const url = new URL("https://shop.de/suche?q=rote+schuhe&seite=2#bewertungen");
console.log(url.hostname, url.pathname, url.hash);
console.log(url.searchParams.get("q"), url.searchParams.get("seite"));
console.log(Object.fromEntries(url.searchParams));
```

Die erste Zeile zeigt „shop.de /suche #bewertungen“. Die zweite zeigt „rote schuhe 2“. Das Plus in der Adresse ist dabei wieder zu einem Leerzeichen geworden. Die letzte Zeile macht aus allen Suchangaben ein Objekt: `{ q: "rote schuhe", seite: "2" }`. Die 2 ist dabei ein Text, denn in einer Adresse ist alles Text.

`URL` hilft auch beim **Bauen** von Adressen. Es verpackt Leerzeichen und Umlaute automatisch richtig:

```js
const link = new URL("https://shop.de/suche");
link.searchParams.set("q", "Äpfel & Birnen");
link.searchParams.set("seite", 1);
console.log(link.toString());
```

Heraus kommt `https://shop.de/suche?q=%C3%84pfel+%26+Birnen&seite=1`. Aus dem Ä wird `%C3%84`, aus dem Leerzeichen ein Plus und aus `&` die Folge `%26`. Sonst würde der Server das `&` als Trenner zwischen zwei Angaben lesen.

## Mehrere Ansichten auf einer Seite

Moderne Web-Apps laden die Seite nur einmal und tauschen danach nur noch Inhalte aus. Man nennt sie **Single Page Apps**. Damit der Zurück-Knopf, Lesezeichen und geteilte Links trotzdem funktionieren, steht die aktuelle Ansicht in der **Adresse**. Das Umschalten anhand der Adresse nennt man **Routing**.

:::alltag
Denk an ein Einkaufszentrum mit Wegweisern. Das Gebäude bleibt dasselbe. Aber die Angabe „Ebene 2, Laden 14“ sagt genau, wo du bist, und jeder kann dich dorthin schicken.
:::

Die einfachste Form benutzt den **Hash**, also alles ab `#`. Ändert er sich, lädt der Browser die Seite nicht neu. Stattdessen kommt das Event `hashchange`. Im Beispiel gibt es zwei Ansichten:

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

Zuerst erscheint „Ansicht: Willkommen!“. Am Anfang ist der Hash leer, und `|| "#/"` macht daraus die Startseite. Danach setzt die letzte Zeile den Hash auf `#/hilfe`. Das löst `hashchange` aus, und es erscheint „Ansicht: Hier hilft man dir.“.

## Adressen ohne #

Viele Router, auch der von React, benutzen statt des Hashs echte Pfade wie `/produkte`. Dafür gibt es `history.pushState(daten, "", "/produkte")`. Es ändert die Adresse, ohne die Seite neu zu laden. Für den Zurück-Knopf gibt es dann das Event `popstate`. Das braucht aber einen Server, der für jeden Pfad dieselbe Seite ausliefert. In der Codewerk-Vorschau übst du deshalb mit dem Hash. Die Idee ist dieselbe.

## Barrierefreie Navigation

Markiere den Link zur aktuellen Ansicht mit `aria-current="page"`. Screenreader sagen dann „aktuelle Seite“, und du kannst den Link per CSS hervorheben.
