# Script para desplegar el frontend en Kubernetes

Write-Host "Construyendo imagen del frontend..." -ForegroundColor Green
docker build -t wep-frontend:latest ./frontend

Write-Host "Aplicando configuración del frontend..." -ForegroundColor Green
kubectl apply -f frontend/k8s/frontend-deployment.yaml

Write-Host "Despliegue del frontend completado!" -ForegroundColor Green
Write-Host "Verificar pods: kubectl get pods -n wep" -ForegroundColor Yellow