const log = [
  "2026-10-31 02:14 INFO Sicherung gestartet",
  "2026-10-31 02:15 FEHLER Datenbank nicht erreichbar",
  "2026-10-31 02:16 WARNUNG Wiederholung 1 von 3",
  "kaputte Zeile ohne Format",
  "2026-10-31 02:20 INFO Datenbank wieder erreichbar",
  "",
  "2026-10-31 02:40 FEHLER Speicher voll",
  "2026-10-31 02:41 DEBUG zu viele Details",
  "2026-10-31 03:00 INFO Sicherung beendet",
];

function zeileLesen(zeile) {
  const treffer = zeile.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) (INFO|WARNUNG|FEHLER) (.+)$/);
  if (!treffer) {
    return null;
  }
  const [, datum, zeit, stufe, text] = treffer;
  return { datum, zeit, stufe, text };
}

function* nurFehler(zeilen) {
  for (const zeile of zeilen) {
    const eintrag = zeileLesen(zeile);
    if (eintrag && eintrag.stufe === "FEHLER") {
      yield eintrag;
    }
  }
}

function zaehleStufen(zeilen) {
  const anzahl = {};
  for (const zeile of zeilen) {
    const eintrag = zeileLesen(zeile);
    if (eintrag) {
      anzahl[eintrag.stufe] = (anzahl[eintrag.stufe] ?? 0) + 1;
    }
  }
  return anzahl;
}

function bericht(zeilen) {
  const fehler = [...nurFehler(zeilen)];
  if (fehler.length === 0) {
    return "Keine Fehler";
  }
  const letzter = fehler[fehler.length - 1];
  const datum = new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "UTC" }).format(new Date(letzter.datum));
  return `${fehler.length} Fehler, zuletzt am ${datum} um ${letzter.zeit}: ${letzter.text}`;
}
