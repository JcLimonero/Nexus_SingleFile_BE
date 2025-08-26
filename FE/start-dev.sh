#!/bin/bash

echo "🚀 Iniciando SingleFile Development Environment..."

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Puerto $1 está en uso. Deteniendo proceso..."
        lsof -ti:$1 | xargs kill -9
        sleep 2
    fi
}

# Verificar y liberar puertos
echo "🔍 Verificando puertos..."
check_port 3500
check_port 3600

# Iniciar Backend en puerto 3500
echo "🔧 Iniciando Backend en puerto 3500..."
cd ../BE/singlefile-api
php spark serve --host=0.0.0.0 --port=3500 &
BACKEND_PID=$!
echo "✅ Backend iniciado con PID: $BACKEND_PID"

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
sleep 5

# Verificar que el backend esté funcionando
if curl -s http://localhost:3500/api/user > /dev/null; then
    echo "✅ Backend funcionando correctamente en puerto 3500"
else
    echo "❌ Error: Backend no responde en puerto 3500"
    exit 1
fi

# Iniciar Frontend en puerto 3600
echo "🎨 Iniciando Frontend en puerto 3600..."
cd ../../FE
ng serve --port 3600 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado con PID: $FRONTEND_PID"

echo ""
echo "🎉 SingleFile Development Environment iniciado exitosamente!"
echo ""
echo "📱 Frontend: http://localhost:3600"
echo "🔧 Backend:  http://localhost:3500"
echo "📡 API Proxy: http://localhost:3600/api -> http://localhost:3500/api"
echo ""
echo "Para detener ambos servicios, ejecuta: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Mantener el script corriendo
wait
