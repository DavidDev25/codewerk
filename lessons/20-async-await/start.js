// Lektion 20 – async & await
// Diese beiden Funktionen tun so, als würden sie Daten von einem Server laden.
// Ändere sie nicht.
const benutzer = {
  1: { name: "Mia" },
  2: { name: "Ben" },
};

const bestellungen = {
  Mia: ["Buch", "Lampe"],
  Ben: [],
};

function ladeBenutzer(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (benutzer[id]) resolve(benutzer[id]);
      else reject(new Error("Benutzer nicht gefunden"));
    }, 50);
  });
}

function ladeBestellungen(name) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(bestellungen[name] || []), 50);
  });
}

// 1. async function begruessung(id)


// 2. async function bestellAnzahl(id)


// 3. async function sicherBegruessen(id)


// 4. async function start() – und danach aufrufen
