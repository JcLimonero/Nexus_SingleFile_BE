#!/bin/bash

#--------------------------------------------------------------------
# SCRIPT PARA INICIAR EL SERVIDOR DWH API EN PUERTO 8101
#--------------------------------------------------------------------

echo "🚀 Iniciando DWH API (Nexfile) en puerto 8101..."

# Verificar que PHP esté instalado
if ! command -v php &> /dev/null; then
    echo "❌ Error: PHP no está instalado"
    exit 1
fi

# Verificar que el archivo de configuración existe
if [ ! -f ".env" ]; then
    if [ -f "env" ]; then
        echo "📋 Copiando env a .env..."
        cp env .env
    else
        echo "⚠️  Advertencia: No existe .env. Creando desde plantilla env..."
        cp env .env 2>/dev/null || echo "Crea el archivo .env manualmente"
    fi
fi

# Verificar database-config.json
if [ ! -f "app/Config/database-config.json" ]; then
    echo "❌ Error: app/Config/database-config.json no encontrado"
    echo "   Configura hostname, database, username, password para conectar a vgd_dwh_prod o dwh"
    exit 1
fi

# Verificar permisos del directorio writable
chmod -R 755 writable/ 2>/dev/null || true

# Instalar dependencias si es necesario
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependencias de Composer..."
    composer install --no-dev --optimize-autoloader
fi

# Iniciar servidor en puerto 8101
echo "🌐 DWH API iniciada en: http://localhost:8101/"
echo "📡 Endpoints Nexfile:"
echo "   - GET /nexfile/customers"
echo "   - GET /nexfile/orders"
echo "   - GET /nexfile/invoices"
echo ""
echo "Presiona Ctrl+C para detener el servidor"

php spark serve --host=0.0.0.0 --port=8101
