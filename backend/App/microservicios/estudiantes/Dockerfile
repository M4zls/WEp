FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY src ./src

RUN bun install

EXPOSE 3001

CMD ["bun", "src/index.ts"]