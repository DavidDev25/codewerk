import http from "node:http";
import path from "node:path";
import { Speicher } from "./speicher.js";

const speicher = new Speicher(path.join(import.meta.dirname, "daten", "notizen.json"));

speicher.on("gespeichert", (anzahl) => console.log(`Gespeichert: ${anzahl} Notizen`));

function json(res, status, daten) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(daten));
}

async function bodyLesen(req) {
  let text = "";
  for await (const teil of req) text += teil;
  return text;
}

function jsonLesen(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function bearbeiten(req, res) {
  const url = new URL(req.url, "http://localhost");
  const einzeln = /^\/notizen\/(\d+)$/.exec(url.pathname);

  if (url.pathname === "/notizen" && req.method === "GET") {
    const suche = url.searchParams.get("suche");
    const alle = speicher.alle();
    json(res, 200, suche ? alle.filter((n) => n.text.toLowerCase().includes(suche.toLowerCase())) : alle);
    return;
  }

  if (url.pathname === "/notizen" && req.method === "POST") {
    const daten = jsonLesen(await bodyLesen(req));
    if (!daten || typeof daten.text !== "string" || !daten.text.trim()) {
      json(res, 400, { fehler: "Text fehlt" });
      return;
    }
    json(res, 201, speicher.hinzufuegen(daten.text.trim()));
    return;
  }

  if (einzeln && req.method === "PATCH") {
    const daten = jsonLesen(await bodyLesen(req)) ?? {};
    const notiz = speicher.aendern(Number(einzeln[1]), daten);
    if (notiz) json(res, 200, notiz);
    else json(res, 404, { fehler: "Notiz nicht gefunden" });
    return;
  }

  if (einzeln && req.method === "DELETE") {
    if (speicher.loeschen(Number(einzeln[1]))) {
      res.writeHead(204);
      res.end();
    } else {
      json(res, 404, { fehler: "Notiz nicht gefunden" });
    }
    return;
  }

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

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Notiz-API läuft auf Port ${port}`));
