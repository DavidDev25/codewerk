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

async function begruessung(id) {
  const person = await ladeBenutzer(id);
  return "Hallo " + person.name + "!";
}

async function bestellAnzahl(id) {
  const person = await ladeBenutzer(id);
  const liste = await ladeBestellungen(person.name);
  return liste.length;
}

async function sicherBegruessen(id) {
  try {
    return await begruessung(id);
  } catch (fehler) {
    return "Unbekannter Benutzer";
  }
}

async function start() {
  console.log(await begruessung(1));
}

start();
