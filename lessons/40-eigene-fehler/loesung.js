class EingabeFehler extends Error {
  constructor(feld, nachricht) {
    super(nachricht);
    this.name = "EingabeFehler";
    this.feld = feld;
  }
}

function alterPruefen(text) {
  const alter = Number(text);
  if (Number.isNaN(alter)) {
    throw new EingabeFehler("alter", "Bitte eine Zahl eingeben.");
  }
  if (alter < 0) {
    throw new EingabeFehler("alter", "Das Alter kann nicht negativ sein.");
  }
  return alter;
}

function profilLesen(json) {
  try {
    return JSON.parse(json);
  } catch (fehler) {
    throw new Error("Profil beschädigt", { cause: fehler });
  }
}

function sicher(fn) {
  try {
    return { ok: true, wert: fn() };
  } catch (fehler) {
    if (fehler instanceof EingabeFehler) {
      return { ok: false, feld: fehler.feld, nachricht: fehler.message };
    }
    throw fehler;
  }
}
