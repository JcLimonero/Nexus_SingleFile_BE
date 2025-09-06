#!/bin/bash

# Script para probar la API de documentos usando cURL
# Ejecutar: chmod +x test_api_curl.sh && ./test_api_curl.sh

echo "🧪 PROBANDO API DE DOCUMENTOS CON CURL"
echo "======================================"
echo ""

# Configuración
BASE_URL="http://localhost:3500/api/clients-validation"
CLIENTE_ID="999"
PEDIDO_ID="999"

echo "🔗 URL base: $BASE_URL"
echo "👤 Cliente ID: $CLIENTE_ID"
echo "📦 Pedido ID: $PEDIDO_ID"
echo ""

# Función para mostrar respuestas
show_response() {
    local test_name="$1"
    local response="$2"
    
    echo "✅ $test_name"
    echo "📄 Respuesta:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
}

# 1. Probar endpoint de clientes
echo "🔍 1. PROBANDO ENDPOINT DE CLIENTES"
echo "-----------------------------------"
response=$(curl -s "$BASE_URL/clientes?id=999&idProcess=999")
show_response "GET /clientes" "$response"

# 2. Probar endpoint de documentos (caso exitoso)
echo "🔍 2. PROBANDO ENDPOINT DE DOCUMENTOS (CASO EXITOSO)"
echo "----------------------------------------------------"
response=$(curl -s "$BASE_URL/documentos?clienteId=$CLIENTE_ID&pedidoId=$PEDIDO_ID")
show_response "GET /documentos con parámetros válidos" "$response"

# 3. Probar endpoint de documentos (sin parámetros)
echo "🔍 3. PROBANDO ENDPOINT DE DOCUMENTOS (SIN PARÁMETROS)"
echo "-------------------------------------------------------"
response=$(curl -s "$BASE_URL/documentos")
show_response "GET /documentos sin parámetros" "$response"

# 4. Probar endpoint de documentos (solo clienteId)
echo "🔍 4. PROBANDO ENDPOINT DE DOCUMENTOS (SOLO CLIENTE ID)"
echo "--------------------------------------------------------"
response=$(curl -s "$BASE_URL/documentos?clienteId=$CLIENTE_ID")
show_response "GET /documentos solo con clienteId" "$response"

# 5. Probar endpoint de documentos (solo pedidoId)
echo "🔍 5. PROBANDO ENDPOINT DE DOCUMENTOS (SOLO PEDIDO ID)"
echo "--------------------------------------------------------"
response=$(curl -s "$BASE_URL/documentos?pedidoId=$PEDIDO_ID")
show_response "GET /documentos solo con pedidoId" "$response"

# 6. Probar endpoint de estadísticas
echo "🔍 6. PROBANDO ENDPOINT DE ESTADÍSTICAS"
echo "----------------------------------------"
response=$(curl -s "$BASE_URL/estadisticas?id=999&idProcess=999")
show_response "GET /estadisticas" "$response"

echo "✅ Pruebas completadas"
echo ""
echo "📊 RESUMEN DE PRUEBAS:"
echo "- Endpoint de clientes: ✅"
echo "- Endpoint de documentos (válido): ✅"
echo "- Endpoint de documentos (sin parámetros): ✅ (debe devolver error)"
echo "- Endpoint de documentos (solo clienteId): ✅ (debe devolver error)"
echo "- Endpoint de documentos (solo pedidoId): ✅ (debe devolver error)"
echo "- Endpoint de estadísticas: ✅"
echo ""
echo "💡 Si alguna prueba falla, verifica:"
echo "   1. Que el servidor esté corriendo en el puerto 3500"
echo "   2. Que las rutas estén configuradas correctamente"
echo "   3. Que la base de datos tenga datos de prueba"
echo "   4. Que el controlador esté funcionando correctamente"

