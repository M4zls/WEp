# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

RUN bun run build

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["bun", "x", "serve", "-s", "dist", "-p", "8080"]