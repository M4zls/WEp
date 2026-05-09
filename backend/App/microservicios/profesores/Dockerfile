FROM node:24-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY src ./src

# Instalar dependencias
RUN npm install

# Exponer el puerto
EXPOSE 3004

# Iniciar el servicio con npx tsx
CMD ["npx", "tsx", "src/index.ts"]