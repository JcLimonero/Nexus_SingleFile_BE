# Optimización de Queries de Analytics

## Problemas Identificados

### 1. getAgencyMetrics() - 5 queries separadas
**Problema**: Ejecuta 5 queries COUNT separadas cuando podría hacer una sola query con agregaciones condicionales.

**Impacto**: 5x más lento de lo necesario, especialmente con tablas grandes.

### 2. getTrendData() - 36 queries en loop
**Problema**: Ejecuta 36 queries (12 meses × 3 estados) en un loop.

**Impacto**: MUY LENTO - 36 queries secuenciales es extremadamente ineficiente.

### 3. Uso de funciones de fecha en WHERE
**Problema**: `YEAR(RegistrationDate)`, `MONTH(RegistrationDate)`, `DATE(RegistrationDate)` en WHERE no pueden usar índices.

**Impacto**: Full table scan en lugar de usar índices.

### 4. Falta de índices compuestos
**Problema**: No hay índices compuestos en (RegistrationDate, IdAgency, IdCurrentState).

**Impacto**: Las queries no pueden usar índices eficientemente.

## Optimizaciones a Implementar

### 1. Optimizar getAgencyMetrics()
- Combinar las 5 queries en una sola con CASE WHEN
- Usar rangos de fechas en lugar de funciones de fecha

### 2. Optimizar getTrendData()
- Reemplazar el loop de 36 queries con una sola query usando GROUP BY
- Usar rangos de fechas en lugar de funciones de fecha

### 3. Optimizar getCurrentMonthStatusDistribution()
- Usar rangos de fechas en lugar de YEAR() y MONTH()

### 4. Optimizar getWeeklyData()
- Usar rangos de fechas en lugar de DATE()

### 5. Crear índices compuestos
- Índice en (RegistrationDate, IdAgency)
- Índice en (RegistrationDate, IdAgency, IdCurrentState)
