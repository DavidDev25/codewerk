import http from "node:http";
import path from "node:path";
import { Speicher } from "./speicher.js";

const speicher = new Speicher(path.join(import.meta.dirname, "daten", "notizen.json"));

// 5. Bei "gespeichert" ausgeben: Gespeichert: 3 Notizen


function json(res, status, daten) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(daten));
}

// 3. Den Body der Anfrage als Text lesen
async function bodyLesen(req) {
  return "";
}

async function bearbeiten(req, res) {
  const url = new URL(req.url, "http://localhost");
  const einzeln = /^\/notizen\/(\d+)$/.exec(url.pathname);

  // 4. Routen

  json(res, 404, { fehler: "Nicht gefunden" });
}

const server = http.createServer(async (req, res) => {
  try {
    await bearbeiten(req, res);
  } catch (fehler) {
    console.error(fehler);
    json(res, 500, { fehler: "Interner Fehler" });
  }
});

// 6. Server starten

