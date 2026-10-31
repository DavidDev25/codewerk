const form = document.querySelector("#anmeldung");
const meldung = document.querySelector("#meldung");

function melden(text, art) {
  meldung.textContent = text;
  meldung.classList.remove("ok", "fehler");
  meldung.classList.add(art);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const kurs = form.elements.kurs.value;

  if (!name) {
    melden("Bitte gib einen Namen ein.", "fehler");
    return;
  }
  if (!email.includes("@")) {
    melden("Bitte gib eine gültige E-Mail ein.", "fehler");
    return;
  }

  const li = document.createElement("li");
  li.textContent = `${name} (${kurs})`;
  document.querySelector("#teilnehmer").append(li);
  melden(`Angemeldet: ${name}`, "ok");
  form.reset();
});
