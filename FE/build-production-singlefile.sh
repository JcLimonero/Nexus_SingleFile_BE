#!/bin/bash

# Script para construir el frontend con la configuración correcta para /singlefile/

echo "🔨 Construyendo aplicación Angular para producción..."
echo "📍 Base href: /singlefile/"
echo ""

# Construir con baseHref correcto
ng build --configuration production --base-href /singlefile/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completado exitosamente!"
    echo "📦 Archivos generados en: dist/vex/"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Copiar los archivos de dist/vex/ al servidor en /singlefile/"
    echo "2. Verificar que el servidor web esté configurado correctamente"
    echo "3. Verificar que el backend esté accesible en https://apisvanguardia.com:400/api/"
else
    echo ""
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi
