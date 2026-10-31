const besuche = Number(localStorage.getItem("besuche") ?? 0) + 1;
localStorage.setItem("besuche", besuche);
document.querySelector("#besuche").textContent = besuche;

const notiz = document.querySelector("#notiz");
notiz.value = localStorage.getItem("notiz") ?? "";

document.querySelector("#speichern").addEventListener("click", () => {
  localStorage.setItem("notiz", notiz.value);
  document.querySelector("#status").textContent = "Gespeichert";
});

function einstellungenSpeichern(obj) {
  localStorage.setItem("einstellungen", JSON.stringify(obj));
}

function einstellungenLaden() {
  const text = localStorage.getItem("einstellungen");
  return text ? JSON.parse(text) : { thema: "hell" };
}
