#!/bin/bash

# Script de despliegue para servidor de producción
# Uso: ./deploy.sh

echo "🚀 Iniciando despliegue del backend..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "composer.json" ]; then
    show_error "No se encontró composer.json. Ejecuta este script desde el directorio del backend."
    exit 1
fi

# Instalar dependencias de producción
show_message "Instalando dependencias de producción..."
composer install --no-dev --optimize-autoloader

# Crear directorios necesarios si no existen
show_message "Creando directorios necesarios..."
mkdir -p writable/cache
mkdir -p writable/logs
mkdir -p writable/session
mkdir -p writable/uploads

# Establecer permisos correctos
show_message "Estableciendo permisos..."
chmod -R 755 writable/
chmod 644 public/index.php

# Copiar archivo de configuración de producción
if [ -f "env.production" ]; then
    show_message "Configurando entorno de producción..."
    cp env.production .env
    show_warning "Recuerda actualizar las variables en el archivo .env con tus datos reales"
else
    show_warning "No se encontró env.production. Configura manualmente el archivo .env"
fi

# Optimizar autoloader
show_message "Optimizando autoloader..."
composer dump-autoload --optimize

show_message "Despliegue completado! 🎉"
echo ""
echo "📋 Próximos pasos:"
echo "1. Sube todos los archivos al servidor"
echo "2. Configura la base de datos"
echo "3. Actualiza las variables en .env"
echo "4. Configura el servidor web (Apache/Nginx)"
echo "5. Prueba la API"

