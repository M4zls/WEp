# Script para desplegar el backend en Kubernetes

$files = @(
    "backend/k8s/config/namespace.yaml",
    "backend/k8s/config/secret.yaml",
    "backend/k8s/config/configmap.yaml",
    "backend/k8s/database/postgres-deployment.yaml",
    "backend/k8s/microservices/autentificacion-deployment.yaml",
    "backend/k8s/microservices/estudiantes-deployment.yaml",
    "backend/k8s/microservices/profesores-deployment.yaml",
    "backend/k8s/microservices/notificaciones-deployment.yaml",
    "backend/k8s/microservices/cursos-deployment.yaml",
    "backend/k8s/microservices/bff-deployment.yaml"
)

foreach ($file in $files) {
    Write-Host "Aplicando $file..." -ForegroundColor Green
    kubectl apply -f $file
}

Write-Host "Despliegue del backend completado!" -ForegroundColor Green
Write-Host "Verificar pods: kubectl get pods -n wep" -ForegroundColor Yellow