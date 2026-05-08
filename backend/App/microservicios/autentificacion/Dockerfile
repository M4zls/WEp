FROM node:24-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY src ./src

# Instalar dependencias
RUN npm install



# Crear directorio de datos
RUN mkdir -p ./data

# Exponer el puerto
EXPOSE 3002

# Iniciar el servicio con npx tsx
CMD ["npx", "tsx", "src/index.ts"]