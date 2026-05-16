FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN bun install

EXPOSE 3000

CMD ["bun", "src/index.ts"]