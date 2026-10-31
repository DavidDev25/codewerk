const seiten = {
  "#/": "Willkommen im Laden!",
  "#/produkte": "Unsere Produkte: Tee, Kaffee, Kakao.",
  "#/kontakt": "Schreib uns: hallo@laden.example",
};

function parameter(adresse) {
  return Object.fromEntries(new URL(adresse).searchParams);
}

function suchLink(basis, werte) {
  const url = new URL(basis);
  for (const [name, wert] of Object.entries(werte)) {
    url.searchParams.set(name, wert);
  }
  return url.toString();
}

function zeigen() {
  const ziel = location.hash || "#/";
  document.querySelector("#inhalt").textContent = seiten[ziel] ?? "Seite nicht gefunden";
  for (const link of document.querySelectorAll("nav a")) {
    if (link.getAttribute("href") === ziel) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

window.addEventListener("hashchange", zeigen);
zeigen();
