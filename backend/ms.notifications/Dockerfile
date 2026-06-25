FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY drizzle ./drizzle
COPY src ./src

RUN bun install

EXPOSE 3003

CMD ["bun", "src/index.ts"]