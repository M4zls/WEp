FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY src ./src

RUN bun install

EXPOSE 3011

CMD ["bun", "src/index.ts"]
