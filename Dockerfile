# Codewerk – Container-Image
# Node 24 (LTS): bringt process.loadEnvFile, fetch-Streaming und SQLite (node:sqlite,
# für die Konten) mit – ohne zusätzliche Pakete
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# Zuerst nur die Paketlisten kopieren: So wird der (große) npm-Schritt
# bei Code-Änderungen aus dem Cache genommen.
# "npm ci" installiert exakt die Versionen aus package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server
COPY public ./public
COPY lessons ./lessons
COPY scripts ./scripts

# Ordner für den gespeicherten Fortschritt (wird in docker-compose.yml als Volume eingebunden)
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/healthz >/dev/null || exit 1

CMD ["node", "server/index.js"]
