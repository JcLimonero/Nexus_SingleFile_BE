#!/bin/bash

# Script para construir el frontend con la configuración correcta para /NexFile/

echo "🔨 Construyendo aplicación Angular para producción..."
echo "📍 Base href: /NexFile/"
echo ""

# Construir con baseHref correcto
ng build --configuration production --base-href /NexFile/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completado exitosamente!"
    echo "📦 Archivos generados en: dist/vex/"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Copiar los archivos de dist/vex/ al servidor en /NexFile/"
    echo "2. Verificar que el servidor web esté configurado correctamente"
    echo "3. Verificar que el backend esté accesible en https://localhost:8080/api/"
else
    echo ""
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi
