FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./

RUN npm install

RUN npx playwright install --with-deps chromium

COPY backend/ .

EXPOSE 3001

CMD ["node", "server.js"]
