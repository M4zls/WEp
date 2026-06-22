# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
RUN bun install

COPY . .

RUN bun run build

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN bun add serve

EXPOSE 8080

CMD ["node_modules/.bin/serve", "-s", "dist", "-p", "8080"]