const quadrat = (x) => x * x;

const istVolljaehrig = (alter) => alter >= 18;

const begruessen = (name = "Gast") => `Hallo ${name}!`;

const zweimal = (fn, wert) => fn(fn(wert));

console.log(zweimal(quadrat, 3));
