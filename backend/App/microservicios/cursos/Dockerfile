FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY src ./src

RUN npm install

EXPOSE 3005

CMD ["npx", "tsx", "src/index.ts"]
