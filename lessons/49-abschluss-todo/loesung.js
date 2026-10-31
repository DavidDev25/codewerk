function laden() {
  const text = localStorage.getItem("aufgaben");
  return text ? JSON.parse(text) : [];
}

let aufgaben = laden();

function speichern() {
  localStorage.setItem("aufgaben", JSON.stringify(aufgaben));
}

function zeichnen() {
  const liste = document.querySelector("#aufgaben");
  liste.replaceChildren();
  aufgaben.forEach((aufgabe, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    if (aufgabe.erledigt) li.classList.add("erledigt");

    const text = document.createElement("span");
    text.textContent = aufgabe.text;

    const loeschen = document.createElement("button");
    loeschen.className = "loeschen";
    loeschen.textContent = "✕";
    loeschen.setAttribute("aria-label", `„${aufgabe.text}“ löschen`);

    li.append(text, loeschen);
    liste.append(li);
  });
  const offen = aufgaben.filter((a) => !a.erledigt).length;
  document.querySelector("#zaehler").textContent = `${offen} von ${aufgaben.length} offen`;
}

const form = document.querySelector("#neu");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = form.elements.text.value.trim();
  if (!text) return;
  aufgaben.push({ text, erledigt: false });
  form.reset();
  speichern();
  zeichnen();
});

document.querySelector("#aufgaben").addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const index = Number(li.dataset.index);
  if (event.target.closest(".loeschen")) {
    aufgaben.splice(index, 1);
  } else {
    aufgaben[index].erledigt = !aufgaben[index].erledigt;
  }
  speichern();
  zeichnen();
});

zeichnen();
