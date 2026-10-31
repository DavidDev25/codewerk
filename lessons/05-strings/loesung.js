function initialen(vorname, nachname) {
  return `${vorname[0].toUpperCase()}.${nachname[0].toUpperCase()}.`;
}

function bereinigen(text) {
  return text.trim().toLowerCase();
}

function istBild(dateiname) {
  const klein = dateiname.toLowerCase();
  return klein.endsWith(".png") || klein.endsWith(".jpg");
}

function kuerzen(text, max) {
  if (text.length <= max) {
    return text;
  }
  return text.slice(0, max) + "…";
}

console.log(initialen("mara", "schulz"));
