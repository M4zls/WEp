FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY drizzle ./drizzle
COPY src ./src

RUN bun install

EXPOSE 3009

CMD ["bun", "src/index.ts"]
