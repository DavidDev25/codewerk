let zaehler = 0;
const anzeige = document.querySelector("#stand");

document.querySelector("#plus").addEventListener("click", () => {
  zaehler++;
  anzeige.textContent = zaehler;
});

document.querySelector("#reset").addEventListener("click", () => {
  zaehler = 0;
  anzeige.textContent = zaehler;
});

document.querySelector("#name").addEventListener("input", (event) => {
  const name = event.target.value.trim();
  document.querySelector("#gruss").textContent = name ? `Hallo ${name}!` : "";
});

document.querySelector("#farben").addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  document.querySelector("#auswahl").textContent = `Gewählt: ${li.dataset.farbe}`;
});
