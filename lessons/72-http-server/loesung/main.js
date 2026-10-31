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
  const einzeln = /^\/api\/produkte\/(\d+)$/.exec(url.pathname);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Willkommen im Laden-Server");
  } else if (req.method === "GET" && url.pathname === "/api/produkte") {
    const max = url.searchParams.get("max");
    json(res, 200, max === null ? produkte : produkte.filter((p) => p.preis <= Number(max)));
  } else if (req.method === "GET" && einzeln) {
    const produkt = produkte.find((p) => p.id === Number(einzeln[1]));
    if (produkt) json(res, 200, produkt);
    else json(res, 404, { fehler: "Produkt nicht gefunden" });
  } else {
    json(res, 404, { fehler: "Seite nicht gefunden" });
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
