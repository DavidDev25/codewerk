const karte = document.querySelector("#karte");
karte.addEventListener("click", () => karte.classList.toggle("offen"));

document.querySelector("#merken").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector("#gemerkt").textContent = "Gemerkt!";
});

const menueKnopf = document.querySelector("#menue-knopf");
const menue = document.querySelector("#menue");

function menueSetzen(offen) {
  menue.hidden = !offen;
  menueKnopf.setAttribute("aria-expanded", String(offen));
}

menueKnopf.addEventListener("click", () => menueSetzen(menue.hidden));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menueSetzen(false);
    menueKnopf.focus();
  }
});

document.querySelector("#auswahl").addEventListener("keydown", (event) => {
  const aktuell = event.target.closest("li");
  if (!aktuell) return;
  const ziel = event.key === "ArrowDown" ? aktuell.nextElementSibling
    : event.key === "ArrowUp" ? aktuell.previousElementSibling
    : null;
  if (ziel) {
    event.preventDefault();
    aktuell.tabIndex = -1;
    ziel.tabIndex = 0;
    ziel.focus();
  }
});
