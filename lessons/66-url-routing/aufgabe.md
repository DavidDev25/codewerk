## Aufgabe: Der Mini-Router

Zuerst baust du zwei Helfer, die Adressen lesen und bauen. Danach schreibst du einen kleinen Router für die Seite. Er zeigt je nach Hash eine andere Ansicht und markiert den passenden Link.

### Schritt 1: Suchangaben lesen

```js
parameter("https://shop.de/?q=tee&seite=2"); // { q: "tee", seite: "2" }
```

Mache aus `adresse` ein `new URL(adresse)` und gib `Object.fromEntries(url.searchParams)` zurück. Genau so steht es in der Erklärung.

### Schritt 2: Einen Suchlink bauen

```js
suchLink("https://shop.de/suche", { q: "rote schuhe", seite: 2 });
// "https://shop.de/suche?q=rote+schuhe&seite=2"
suchLink("https://shop.de/suche", { q: "Äpfel & Birnen" });
// "https://shop.de/suche?q=%C3%84pfel+%26+Birnen"
```

So gehst du vor:

1. Mache aus `basis` ein `new URL(basis)`.
2. Gehe mit `for (const [name, wert] of Object.entries(werte))` durch das Objekt.
3. Setze jeden Eintrag mit `url.searchParams.set(name, wert)`.
4. Gib `url.toString()` zurück.

Das Verpacken von Umlauten und `&` erledigt `URL` für dich.

### Schritt 3: Der Router

Das Objekt `seiten` steht schon im Editor. Es ordnet jedem Hash einen Text zu. `zeigen()` zeigt den passenden Text und markiert den passenden Link:

```js
// Hash ist leer oder "#/"
document.querySelector("#inhalt").textContent; // der Text für "#/"
// Hash ist "#/gibts-nicht"
document.querySelector("#inhalt").textContent; // "Seite nicht gefunden"
```

So gehst du vor:

1. Lies in `zeigen()` den Hash mit `location.hash || "#/"`.
2. Schreibe `seiten[ziel] ?? "Seite nicht gefunden"` in `#inhalt`.
3. Gehe durch alle Links der Navigation. Passt ihr `getAttribute("href")` zum Hash, setze `aria-current` auf `"page"`. Bei allen anderen entferne es mit `removeAttribute("aria-current")`.
4. Rufe `zeigen()` einmal beim Start auf.
5. Hänge `zeigen` mit `window.addEventListener("hashchange", zeigen)` an das Event.

Klicke danach in der **Vorschau** auf die Links und schau, wie sich der Inhalt ändert.
