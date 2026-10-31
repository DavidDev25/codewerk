const speisekarte = ["Pizza", "Pasta", "Salat"];

function warten(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function bestellen(gericht) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (speisekarte.includes(gericht)) {
        resolve(gericht + " ist fertig!");
      } else {
        reject(new Error(gericht + " gibt es heute nicht."));
      }
    }, 100);
  });
}

bestellen("Pizza").then((text) => console.log(text));

bestellen("Sushi").catch((fehler) => console.log(fehler.message));
