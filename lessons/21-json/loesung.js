const einstellungen = { thema: "dunkel", schrift: 18, sprachen: ["de", "en"] };

const gespeichert = JSON.stringify(einstellungen);
const geladen = JSON.parse(gespeichert);
const huebsch = JSON.stringify(einstellungen, null, 2);

function laden(text) {
  if (!text) {
    return { thema: "hell", schrift: 16 };
  }
  return JSON.parse(text);
}
