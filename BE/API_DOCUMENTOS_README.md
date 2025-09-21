# API de Documentos - Mesa de Control

## Descripción

Esta API permite obtener los documentos asociados a un cliente y pedido específico en el sistema de validación de la Mesa de Control.

## Endpoints

### 1. Obtener Documentos de Cliente/Pedido

**URL:** `GET /api/clients-validation/documentos`

**Parámetros de Query:**
- `clienteId` (requerido): ID del cliente en la tabla File
- `pedidoId` (requerido): ID del pedido en la tabla File

**Ejemplo de Request:**
```bash
GET /api/clients-validation/documentos?clienteId=123&pedidoId=456
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Documentos obtenidos exitosamente",
  "data": [
    {
      "proceso": "Nombre del Proceso",
      "fase": "Nombre de la Fase",
      "documento": "Nombre del Documento",
      "comentario": "Comentario del documento",
      "fecha": "2024-01-01 00:00:00",
      "asignado": "Nombre del Usuario",
      "requerido": 1,
      "idEstatus": 1
    }
  ]
}
```

**Respuesta de Error (400):**
```json
{
  "success": false,
  "message": "Los parámetros clienteId y pedidoId son requeridos",
  "data": null
}
```

**Respuesta de Error (500):**
```json
{
  "success": false,
  "message": "Error interno del servidor: [descripción del error]",
  "data": null
}
```

## Estructura de la Base de Datos

### Tablas Principales

1. **File**: Contiene la información del cliente y pedido
   - `Id`: ID del cliente
   - `IdOrder`: ID del pedido
   - `IdAgency`: ID de la agencia
   - `IdProcess`: ID del proceso

2. **DocumentByFile**: Contiene los documentos asociados
   - `IdFile`: Referencia a File.Id
   - `IdDocumentType`: Tipo de documento
   - `IdCurrentStatus`: Estatus actual del documento
   - `Comment`: Comentarios del documento
   - `RegistrationDate`: Fecha de registro

3. **DocumentType**: Tipos de documentos disponibles
4. **File_Status**: Estados posibles de los documentos
5. **Process**: Procesos del sistema
6. **User**: Usuarios del sistema

### Query SQL Utilizado

```sql
SELECT 
    p.Name as proceso,
    fs.Name as fase,
    dt.Name as documento,
    dbf.Comment as comentario,
    dbf.RegistrationDate as fecha,
    u.Name as asignado,
    CASE WHEN dbf.Enabled = 1 THEN 1 ELSE 0 END as requerido,
    dbf.IdCurrentStatus as idEstatus
FROM DocumentByFile dbf
JOIN File f ON dbf.IdFile = f.Id
JOIN Process p ON f.IdProcess = p.Id
JOIN DocumentType dt ON dbf.IdDocumentType = dt.Id
JOIN File_Status fs ON dbf.IdCurrentStatus = fs.Id
LEFT JOIN User u ON dbf.IdLastUserUpdate = u.Id
WHERE f.Id = :clienteId
  AND f.IdOrder = :pedidoId
ORDER BY dbf.RegistrationDate DESC
```

## Instalación y Configuración

### 1. Verificar Dependencias

- CodeIgniter 4
- MySQL/MariaDB
- PHP 7.4+

### 2. Configurar Base de Datos

Editar el archivo `app/Config/Database.php` con las credenciales de tu base de datos.

### 3. Ejecutar Migraciones

```bash
php spark migrate
```

### 4. Insertar Datos de Prueba (Opcional)

```bash
mysql -u username -p database_name < scripts/insert_test_data.sql
```

## Pruebas

### Script de Prueba PHP

```bash
cd scripts
php test_documentos_api.php
```

### Script de Prueba cURL

```bash
cd scripts
chmod +x test_api_curl.sh
./test_api_curl.sh
```

### Pruebas Manuales

1. **Caso Exitoso:**
   ```bash
   curl "http://localhost:3500/api/clients-validation/documentos?clienteId=999&pedidoId=999"
   ```

2. **Caso de Error (sin parámetros):**
   ```bash
   curl "http://localhost:3500/api/clients-validation/documentos"
   ```

3. **Caso de Error (solo clienteId):**
   ```bash
   curl "http://localhost:3500/api/clients-validation/documentos?clienteId=999"
   ```

## Flujo de Uso

1. **Selección de Cliente/Pedido**: El usuario selecciona un cliente de la tabla superior
2. **Carga de Documentos**: Se envía request a la API con `clienteId` y `pedidoId`
3. **Filtrado**: La API filtra documentos por ambos parámetros
4. **Respuesta**: Se devuelven los documentos filtrados con toda la información necesaria
5. **Visualización**: Los documentos se muestran en la tabla inferior

## Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `proceso` | string | Nombre del proceso asociado |
| `fase` | string | Nombre de la fase del documento |
| `documento` | string | Nombre del tipo de documento |
| `comentario` | string | Comentarios adicionales |
| `fecha` | string | Fecha de registro del documento |
| `asignado` | string | Usuario asignado al documento |
| `requerido` | integer | 1 si es requerido, 0 si no |
| `idEstatus` | integer | ID del estatus actual del documento |

## Manejo de Errores

- **400 Bad Request**: Parámetros faltantes o inválidos
- **500 Internal Server Error**: Errores del servidor o base de datos
- **Logs**: Todos los errores se registran en el log del sistema

## Seguridad

- Validación de parámetros de entrada
- Sanitización de datos
- Logs de auditoría para operaciones críticas
- Control de acceso basado en roles (si se implementa)

## Mantenimiento

### Logs

Los logs se encuentran en `writable/logs/` y contienen:
- Errores de la API
- Operaciones exitosas
- Información de depuración

### Monitoreo

- Verificar logs regularmente
- Monitorear rendimiento de queries
- Revisar uso de memoria y CPU

## Soporte

Para reportar problemas o solicitar mejoras:
1. Revisar logs del sistema
2. Verificar configuración de base de datos
3. Probar con datos de prueba
4. Contactar al equipo de desarrollo

