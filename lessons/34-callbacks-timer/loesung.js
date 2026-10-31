function rechne(a, b, operation) {
  return operation(a, b);
}

const summe = rechne(3, 4, (x, y) => x + y);
const produkt = rechne(3, 4, (x, y) => x * y);

function erinnern(text, ms) {
  setTimeout(() => {
    console.log(text);
  }, ms);
}

erinnern("Tee ist fertig!", 300);
console.log("Wasser kocht …");
