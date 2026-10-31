const titel = document.querySelector("#titel");
titel.textContent = "Codewerk-Laden";

const eintraege = document.querySelectorAll("#angebote li");
const anzahl = eintraege.length;

document.querySelector(".hinweis").classList.add("wichtig");

for (const li of eintraege) {
  li.textContent = li.textContent.toUpperCase();
}

const knopf = document.querySelector("#knopf");
knopf.textContent = "In den Warenkorb";
knopf.dataset.produkt = "obst";
