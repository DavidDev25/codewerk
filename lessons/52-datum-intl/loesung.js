const MS_PRO_TAG = 24 * 60 * 60 * 1000;

function tageBis(von, bis) {
  return Math.round((new Date(bis) - new Date(von)) / MS_PRO_TAG);
}

function datumLang(iso) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));
}

function wochentag(iso) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "long", timeZone: "UTC" }).format(new Date(iso));
}

function preis(betrag) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(betrag);
}
