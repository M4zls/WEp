# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilar React (Create React App generará la carpeta 'build')
RUN npm run build

# Runtime stage
FROM node:24-alpine

WORKDIR /app

# Instalamos 'serve' de manera global
RUN npm install -g serve

# Copiamos la carpeta 'build' desde la fase anterior
COPY --from=builder /app/build ./build

# Exponemos el puerto
EXPOSE 8080

# Servimos la carpeta 'build' con soporte para Single Page Application (-s)
CMD ["serve", "-s", "build", "-p", "8080"]