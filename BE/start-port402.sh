#!/bin/bash

#--------------------------------------------------------------------
# SCRIPT PARA INICIAR EL SERVIDOR EN PUERTO 402
#--------------------------------------------------------------------

echo "🚀 Iniciando NexFile API en puerto 402..."

# Verificar que PHP esté instalado
if ! command -v php &> /dev/null; then
    echo "❌ Error: PHP no está instalado"
    exit 1
fi

# Verificar que el archivo de configuración existe
if [ ! -f "env.port402" ]; then
    echo "❌ Error: Archivo env.port402 no encontrado"
    exit 1
fi

# Copiar configuración para puerto 402
cp env.port402 .env

# Verificar permisos del directorio writable
chmod -R 755 writable/

# Instalar dependencias si es necesario
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependencias de Composer..."
    composer install --no-dev --optimize-autoloader
fi

# Iniciar servidor en puerto 402
echo "🌐 Servidor iniciado en: http://localhost:402/"
echo "📱 Frontend disponible en: http://localhost:402/index.html"
echo "🔗 API disponible en: http://localhost:402/api/"
echo ""
echo "Presiona Ctrl+C para detener el servidor"

php spark serve --host=0.0.0.0 --port=402
