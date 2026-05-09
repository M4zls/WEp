FROM node:24-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Instalar dependencias
RUN npm install

# Exponer el puerto
EXPOSE 3000

# Iniciar el servicio con npx tsx
CMD ["npx", "tsx", "src/index.ts"]