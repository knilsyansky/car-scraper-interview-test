FROM ://mcr.microsoft.com

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

RUN npx playwright install chromium

COPY backend/ .

EXPOSE 3001

CMD ["node", "server.js"]
