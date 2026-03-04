# 🏢 API CRUD de Agencias

## 📋 Descripción

API completo para la gestión de agencias que incluye todas las operaciones CRUD (Create, Read, Update, Delete) con funcionalidades avanzadas como búsqueda, filtrado, paginación y estadísticas.

## 🚀 Endpoints Disponibles

### **GET** `/api/agency`
Obtiene todas las agencias con filtros y paginación.

**Parámetros de consulta:**
- `enabled` (string): Filtrar por estado
  - `enabled=true`: Solo agencias habilitadas (Enabled = 1)
  - `enabled=false`: Solo agencias deshabilitadas (Enabled = 0)
  - Sin parámetro: Todas las agencias (habilitadas y deshabilitadas)
- `search` (string): Búsqueda por nombre
- `region` (string): Filtrar por región (SubFix)
- `limit` (number): Número de registros por página
- `offset` (number): Desplazamiento para paginación
- `sort_by` (string): Campo para ordenar (Name, SubFix, RegistrationDate, UpdateDate)
- `sort_order` (string): Orden ASC o DESC

**Ejemplos de uso:**
```bash
# Obtener todas las agencias (habilitadas y deshabilitadas)
GET /api/agency

# Obtener solo agencias habilitadas
GET /api/agency?enabled=true

# Obtener solo agencias deshabilitadas
GET /api/agency?enabled=false

# Obtener agencias habilitadas con paginación
GET /api/agency?enabled=true&limit=10&offset=0&sort_by=Name&sort_order=ASC

# Obtener agencias deshabilitadas de una región específica
GET /api/agency?enabled=false&region=NORTE
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Agencias obtenidas exitosamente",
  "data": {
    "agencies": [...],
    "total": 25,
    "limit": 10,
    "offset": 0,
    "count": 10,
    "sort_by": "Name",
    "sort_order": "ASC",
    "filter_enabled": "true"
  }
}
```

### **POST** `/api/agency`
Crea una nueva agencia.

**Body:**
```json
{
  "Name": "Nombre de la Agencia",
  "SubFix": "REGION",
  "IdAgency": "AG001",
  "Enabled": 1
}
```

**Campos requeridos:**
- `Name`: Nombre de la agencia (3-600 caracteres)

**Campos opcionales:**
- `SubFix`: Código de región (máximo 50 caracteres)
- `IdAgency`: Identificador interno (máximo 50 caracteres)
- `Enabled`: Estado (0 o 1, por defecto 1)

**Respuesta:**
```json
{
  "success": true,
  "message": "Agencia creada exitosamente",
  "data": {
    "Id": 123,
    "Name": "Nombre de la Agencia",
    "SubFix": "REGION",
    "IdAgency": "AG001",
    "Enabled": 1,
    "RegistrationDate": "2025-01-06 10:30:00",
    "UpdateDate": "2025-01-06 10:30:00"
  }
}
```

### **GET** `/api/agency/{id}`
Obtiene una agencia específica por ID.

**Ejemplo:**
```bash
GET /api/agency/123
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Agencia obtenida exitosamente",
  "data": {
    "Id": 123,
    "Name": "Nombre de la Agencia",
    "SubFix": "REGION",
    "IdAgency": "AG001",
    "Enabled": 1,
    "RegistrationDate": "2025-01-06 10:30:00",
    "UpdateDate": "2025-01-06 10:30:00"
  }
}
```

### **PUT** `/api/agency/{id}`
Actualiza una agencia existente.

**Body:**
```json
{
  "Name": "Nuevo Nombre de la Agencia",
  "SubFix": "NUEVA_REGION",
  "Enabled": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Agencia actualizada exitosamente",
  "data": {
    "Id": 123,
    "Name": "Nuevo Nombre de la Agencia",
    "SubFix": "NUEVA_REGION",
    "IdAgency": "AG001",
    "Enabled": 1,
    "UpdateDate": "2025-01-06 11:00:00"
  }
}
```

### **DELETE** `/api/agency/{id}`
Elimina una agencia (soft delete por defecto).

**Parámetros de consulta:**
- `force` (boolean): Si es `true`, elimina permanentemente

**Ejemplos:**
```bash
# Soft delete (deshabilitar)
DELETE /api/agency/123

# Hard delete (eliminar permanentemente)
DELETE /api/agency/123?force=true
```

**Respuesta (soft delete):**
```json
{
  "success": true,
  "message": "Agencia deshabilitada exitosamente"
}
```

**Respuesta (hard delete):**
```json
{
  "success": true,
  "message": "Agencia eliminada permanentemente"
}
```

### **PATCH** `/api/agency/{id}/toggle-status`
Cambia el estado de habilitación de una agencia.

**Ejemplo:**
```bash
PATCH /api/agency/123/toggle-status
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Agencia habilitada exitosamente",
  "data": {
    "id": 123,
    "enabled": 1,
    "status_text": "habilitada"
  }
}
```

### **GET** `/api/agency/search`
Busca agencias por nombre.

**Parámetros de consulta:**
- `q` (string): Término de búsqueda (mínimo 2 caracteres)

**Ejemplo:**
```bash
GET /api/agency/search?q=agencia
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Búsqueda completada",
  "data": {
    "agencies": [...],
    "search_term": "agencia",
    "count": 5
  }
}
```

### **GET** `/api/agency/regions`
Obtiene todas las regiones disponibles.

**Ejemplo:**
```bash
GET /api/agency/regions
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Regiones obtenidas exitosamente",
  "data": {
    "regions": ["NORTE", "SUR", "ESTE", "OESTE"],
    "count": 4
  }
}
```

### **GET** `/api/agency/stats`
Obtiene estadísticas de agencias.

**Ejemplo:**
```bash
GET /api/agency/stats
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 25,
    "enabled": 20,
    "disabled": 5,
    "regions": [
      {
        "SubFix": "NORTE",
        "count": 8
      },
      {
        "SubFix": "SUR",
        "count": 6
      }
    ]
  }
}
```

## 🔒 Validaciones

### **Nombre de Agencia**
- **Requerido**: Sí
- **Longitud mínima**: 3 caracteres
- **Longitud máxima**: 600 caracteres
- **Único**: Sí (no puede haber dos agencias con el mismo nombre)

### **SubFix (Región)**
- **Requerido**: No
- **Longitud máxima**: 50 caracteres

### **IdAgency**
- **Requerido**: No
- **Longitud máxima**: 50 caracteres

### **Enabled**
- **Requerido**: No
- **Valores permitidos**: 0 o 1
- **Por defecto**: 1 (habilitada)

## 🚫 Manejo de Agencias Deshabilitadas

### **Comportamiento del Parámetro `enabled`**

El API de agencias ahora maneja correctamente las agencias deshabilitadas con el parámetro `enabled`:

#### **`enabled=true`**
- ✅ Solo retorna agencias con `Enabled = 1`
- ✅ Útil para mostrar solo agencias activas en formularios
- ✅ Filtra automáticamente por estado habilitado

#### **`enabled=false`**
- ✅ Solo retorna agencias con `Enabled = 0`
- ✅ Útil para administración y auditoría
- ✅ Permite ver agencias que han sido deshabilitadas

#### **Sin parámetro `enabled`**
- ✅ Retorna **TODAS** las agencias (habilitadas y deshabilitadas)
- ✅ Comportamiento por defecto para máxima flexibilidad
- ✅ Útil para reportes completos y administración

### **Casos de Uso Comunes**

#### **1. Formularios de Selección**
```bash
# Solo agencias habilitadas para formularios
GET /api/agency?enabled=true&sort_by=Name&sort_order=ASC
```

#### **2. Administración de Agencias**
```bash
# Ver todas las agencias para administración
GET /api/agency?sort_by=Name&sort_order=ASC
```

#### **3. Auditoría de Agencias Deshabilitadas**
```bash
# Solo agencias deshabilitadas para auditoría
GET /api/agency?enabled=false&sort_by=UpdateDate&sort_order=DESC
```

#### **4. Reportes por Región**
```bash
# Todas las agencias de una región (habilitadas y deshabilitadas)
GET /api/agency?region=NORTE

# Solo agencias habilitadas de una región
GET /api/agency?region=NORTE&enabled=true

# Solo agencias deshabilitadas de una región
GET /api/agency?region=NORTE&enabled=false
```

### **Búsqueda Incluyendo Agencias Deshabilitadas**

La búsqueda por nombre (`/api/agency/search`) **siempre incluye** agencias habilitadas y deshabilitadas para proporcionar resultados completos:

```bash
# Búsqueda que incluye agencias habilitadas y deshabilitadas
GET /api/agency/search?q=agencia
```

### **Estadísticas Completas**

El endpoint de estadísticas (`/api/agency/stats`) proporciona conteos separados:

```json
{
  "success": true,
  "data": {
    "total": 25,        // Total de agencias
    "enabled": 20,      // Agencias habilitadas
    "disabled": 5,      // Agencias deshabilitadas
    "regions": [...]
  }
}
```

## 📊 Códigos de Estado HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos o faltantes
- **404**: Not Found - Agencia no encontrada
- **500**: Internal Server Error - Error interno del servidor

## 🚨 Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error (solo en desarrollo)"
}
```

### **Errores comunes:**

1. **Campo requerido faltante:**
   ```json
   {
     "success": false,
     "message": "El campo 'Name' es requerido"
   }
   ```

2. **Nombre duplicado:**
   ```json
   {
     "success": false,
     "message": "Ya existe una agencia con ese nombre"
   }
   ```

3. **Agencia no encontrada:**
   ```json
   {
     "success": false,
     "message": "Agencia no encontrada"
   }
   ```

## 🔧 Características Técnicas

### **Paginación**
- Soporte completo para paginación con `limit` y `offset`
- Información de paginación en la respuesta

### **Ordenamiento**
- Múltiples campos de ordenamiento
- Orden ascendente y descendente
- Validación de campos de ordenamiento

### **Filtrado**
- Por estado (habilitada/deshabilitada)
- Por nombre (búsqueda parcial)
- Por región
- Por fechas de registro/actualización

### **Búsqueda**
- Búsqueda por nombre con término mínimo de 2 caracteres
- Resultados ordenados alfabéticamente

### **Estadísticas**
- Conteo total de agencias
- Conteo por estado
- Conteo por región
- Información para dashboards

## 📝 Ejemplos de Uso

### **Crear una nueva agencia:**
```bash
curl -X POST http://localhost:8080/api/agency \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "Agencia del Norte",
    "SubFix": "NORTE",
    "IdAgency": "N001"
  }'
```

### **Obtener agencias con filtros:**
```bash
# Obtener todas las agencias (habilitadas y deshabilitadas)
curl "http://localhost:8080/api/agency?sort_by=Name&sort_order=ASC"

# Obtener solo agencias habilitadas
curl "http://localhost:8080/api/agency?enabled=true&sort_by=Name&sort_order=ASC"

# Obtener solo agencias deshabilitadas
curl "http://localhost:8080/api/agency?enabled=false&sort_by=UpdateDate&sort_order=DESC"

# Obtener agencias habilitadas de una región específica
curl "http://localhost:8080/api/agency?enabled=true&region=NORTE&sort_by=Name&sort_order=ASC"

# Obtener agencias deshabilitadas de una región específica
curl "http://localhost:8080/api/agency?enabled=false&region=NORTE&sort_by=Name&sort_order=ASC"
```

### **Actualizar una agencia:**
```bash
curl -X PUT http://localhost:8080/api/agency/123 \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "Agencia del Norte Actualizada",
    "SubFix": "NORTE_ACTUALIZADO"
  }'
```

### **Cambiar estado de agencia:**
```bash
curl -X PATCH http://localhost:8080/api/agency/123/toggle-status
```

### **Eliminar agencia (soft delete):**
```bash
curl -X DELETE http://localhost:8080/api/agency/123
```

### **Eliminar agencia permanentemente:**
```bash
curl -X DELETE "http://localhost:8080/api/agency/123?force=true"
```

## 🧪 Pruebas

Para probar el API completo, ejecuta el script de pruebas:

```bash
cd BE/NexFile-api
php scripts/test_agency_crud.php
```

Este script verifica todas las operaciones CRUD y valida el funcionamiento correcto del API.

## 📚 Notas de Implementación

- **Soft Delete**: Por defecto, las eliminaciones son suaves (solo deshabilitan)
- **Timestamps**: Se actualizan automáticamente al crear y modificar
- **IDs**: Se generan automáticamente si no se proporcionan
- **Validaciones**: Se aplican tanto en el frontend como en el backend
- **Auditoría**: Se registra el usuario que realiza las modificaciones

## 🔮 Futuras Mejoras

- [ ] Autenticación JWT para endpoints sensibles
- [ ] Logs de auditoría detallados
- [ ] Cache para consultas frecuentes
- [ ] Exportación a CSV/Excel
- [ ] Importación masiva de agencias
- [ ] Notificaciones en tiempo real
- [ ] Historial de cambios
- [ ] Backup automático antes de eliminaciones
