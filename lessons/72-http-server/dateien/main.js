const http = require("node:http");

const produkte = [
  { id: 1, name: "Tee", preis: 4.5 },
  { id: 2, name: "Kaffee", preis: 6 },
  { id: 3, name: "Kakao", preis: 5 },
];

function json(res, status, daten) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(daten));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  // 1. bis 5.: je nach req.method und url.pathname antworten

  json(res, 404, { fehler: "Seite nicht gefunden" });
});

// 6. Port aus process.env.PORT, listen mit Ausgabe

