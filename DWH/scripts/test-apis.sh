#!/bin/bash
# Pruebas de las APIs Nexfile (ejecutar con: php spark serve --port=8101 en otra terminal)
BASE="${1:-http://localhost:8082}"

echo "=== Pruebas APIs DWH (base: $BASE) ==="
echo ""

# 1. customers sin nd_cliente -> 400
echo "1. GET /nexfile/customers (sin nd_cliente) -> esperado 400"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/nexfile/customers")
echo "   HTTP $code"
if [ "$code" = "400" ]; then echo "   OK"; else echo "   FALLO (esperado 400)"; fi
echo ""

# 2. customers con nd_cliente
echo "2. GET /nexfile/customers?nd_cliente=10004"
code=$(curl -s -o /tmp/dwh_customers.json -w "%{http_code}" "$BASE/nexfile/customers?nd_cliente=10004")
echo "   HTTP $code"
if [ "$code" = "200" ]; then
  echo "   OK"; head -c 200 /tmp/dwh_customers.json; echo "..."
elif [ "$code" = "500" ]; then
  echo "   Error 500 (revisar schema BD o conexión):"
  cat /tmp/dwh_customers.json | head -c 300
  echo ""
else
  echo "   Respuesta inesperada"
fi
echo ""

# 3. orders sin customer_dms -> 400
echo "3. GET /nexfile/orders (sin customer_dms) -> esperado 400"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/nexfile/orders")
echo "   HTTP $code"
if [ "$code" = "400" ]; then echo "   OK"; else echo "   FALLO (esperado 400)"; fi
echo ""

# 4. orders con customer_dms
echo "4. GET /nexfile/orders?customer_dms=10004&perpage=5"
code=$(curl -s -o /tmp/dwh_orders.json -w "%{http_code}" "$BASE/nexfile/orders?customer_dms=10004&perpage=5")
echo "   HTTP $code"
if [ "$code" = "200" ]; then
  echo "   OK"; head -c 200 /tmp/dwh_orders.json; echo "..."
elif [ "$code" = "500" ]; then
  echo "   Error 500 (revisar schema BD o conexión)"
else
  echo "   Respuesta inesperada"
fi
echo ""

# 5. invoices sin id_agency -> 400
echo "5. GET /nexfile/invoices (sin id_agency) -> esperado 400"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/nexfile/invoices")
echo "   HTTP $code"
if [ "$code" = "400" ]; then echo "   OK"; else echo "   FALLO (esperado 400)"; fi
echo ""

# 6. invoices con id_agency
echo "6. GET /nexfile/invoices?id_agency=1&delivery_month=3&delivery_year=2025&perpage=5"
code=$(curl -s -o /tmp/dwh_invoices.json -w "%{http_code}" "$BASE/nexfile/invoices?id_agency=1&delivery_month=3&delivery_year=2025&perpage=5")
echo "   HTTP $code"
if [ "$code" = "200" ]; then
  echo "   OK"; head -c 200 /tmp/dwh_invoices.json; echo "..."
elif [ "$code" = "500" ]; then
  echo "   Error 500 (revisar schema BD o conexión)"
else
  echo "   Respuesta inesperada"
fi
echo ""

echo "=== Fin pruebas ==="
