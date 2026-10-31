function debounce(fn, ms) {
  let id;
  return (...werte) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...werte), ms);
  };
}

function throttle(fn, ms) {
  let zuletzt = -Infinity;
  return (...werte) => {
    const jetzt = Date.now();
    if (jetzt - zuletzt >= ms) {
      zuletzt = jetzt;
      fn(...werte);
    }
  };
}

const anzahl = document.querySelector("#anzahl");
let suchen = 0;

const suchen150 = debounce((text) => {
  const begriff = text.trim().toLowerCase();
  for (const li of document.querySelectorAll("#liste li")) {
    li.hidden = !li.textContent.toLowerCase().includes(begriff);
  }
  suchen++;
  anzahl.textContent = suchen;
}, 150);

document.querySelector("#suche").addEventListener("input", (event) => suchen150(event.target.value));
