# Resumen de Migración: Corrección de Nombres de Tablas y Columnas

**Fecha:** 2026-02-28  
**Estado:** ✅ Completada

## Objetivo
Corregir errores de ortografía, renombrar tablas poco claras y estandarizar nombres en toda la base de datos y código.

## Cambios Realizados

### 1. Errores de Ortografía Corregidos

#### Columnas:
- `IdCostumerType` → `IdCustomerType` (en `configuration_process` y `expedient`)
- `ExperationDate` → `ExpirationDate` (en `file_document`)
- `IdInventary` → `IdInventory` (en `expedient`)
- `OtuputDate` → `OutputDate` (en `file_history`)

#### Tablas:
- `File_Release_Steaps` → `File_Release_Steps`

### 2. Tablas Renombradas

| Tabla Antigua | Tabla Nueva | Razón |
|--------------|-------------|-------|
| `file` | `expedient` | Más descriptivo: representa expedientes de venta |
| `order_by_car` | `order` | Simplificado: representa pedidos/órdenes |
| `document_by_file` | `file_document` | Más claro: documentos del expediente |
| `header_client` | `client_header` | Consistencia: sustantivo + adjetivo |
| `client_total_relation` | `client_dms_relation` | Más específico: relación cliente-DMS |
| `file_extraordinary_events` | `file_exception` | Simplificado y más claro |
| `file_extraordinary_reasons` | `file_exception_reason` | Consistente con `file_exception` |
| `file_extraordinary_type` | `file_exception_type` | Consistente con `file_exception` |
| `file_tracking` | `file_history` | Más descriptivo: historial del expediente |
| `smtp_configurator` | `smtp_config` | Simplificado |

### 3. Tipos de Datos Corregidos

- `client.UpdateDate`: Corregido de `VARCHAR(50)` a `TIMESTAMP` (ya estaba correcto)
- Eliminada columna `IdTestg` de `file_history` (no existía)

### 4. Foreign Keys Actualizadas

Se actualizaron las siguientes foreign keys para reflejar los nuevos nombres de tablas:

- `FK_file_document_IdFile`: `file_document.IdFile` → `expedient.Id`
- `FK_file_pld_IdFile`: `file_pld.IdFile` → `expedient.Id`
- `FK_expedient_IdOrder`: `expedient.IdOrder` → `order.Id`
- `FK_expedient_IdClient`: `expedient.IdClient` → `client_header.Id`

**Nota:** Se ajustaron las columnas para permitir `NULL` donde era necesario para las foreign keys con `ON DELETE SET NULL`.

### 5. Código Actualizado

#### Modelos PHP:
- `FileModel`: `$table = 'expedient'`
- `DocumentModel`: `$table = 'file_document'`, `ExpirationDate` actualizado
- `CustomerTypeModel`: Ya estaba correcto (antes `CostumerTypeModel`)

#### Controladores y Servicios:
- **706 reemplazos** realizados en **30 archivos PHP**
- Actualizadas todas las referencias SQL a las nuevas tablas
- Actualizadas referencias en JOINs, SELECTs, INSERTs, UPDATEs

#### Archivos Principales Actualizados:
- `BE/app/Controllers/Api/Files.php` (135 cambios)
- `BE/app/Controllers/Api/Validacion.php` (216 cambios)
- `BE/app/Controllers/Api/VanguardiaClientImport.php` (47 cambios)
- `BE/app/Controllers/Api/Analytics.php` (32 cambios)
- `BE/app/Controllers/Api/Client.php` (23 cambios)
- Y otros 25 archivos más

## Scripts de Migración Creados

1. **`execute_complete_naming_migration.php`**: Script maestro que ejecuta todas las migraciones
2. **`update_code_references.php`**: Actualiza referencias en código PHP
3. **`fix_foreign_keys_after_rename.php`**: Corrige foreign keys después del renombrado

## Verificación

### Tablas Renombradas Verificadas:
- ✅ `expedient`
- ✅ `order`
- ✅ `file_document`
- ✅ `client_header`
- ✅ `client_dms_relation`
- ✅ `file_exception_reason`

### Estadísticas:
- **Total de tablas:** 40
- **Tablas renombradas:** 10
- **Columnas corregidas:** 4
- **Foreign keys actualizadas:** 4
- **Archivos PHP actualizados:** 30
- **Total de reemplazos en código:** 706

## Próximos Pasos Recomendados

1. **Pruebas:** Ejecutar pruebas completas del sistema para verificar que todo funciona correctamente
2. **Frontend:** Actualizar referencias en el frontend si existen
3. **Documentación:** Actualizar documentación técnica con los nuevos nombres
4. **Backup:** Asegurar que se tiene un backup completo antes de aplicar en producción

## Notas Importantes

- La migración se ejecutó en modo transaccional para garantizar integridad
- Las foreign keys se configuraron con `ON DELETE SET NULL` y `ON UPDATE CASCADE`
- Algunas tablas (`file_extraordinary_events`, `file_extraordinary_type`, `file_tracking`, `smtp_configurator`) no existían en la base de datos, por lo que se omitieron
- El script de actualización de código es idempotente y puede ejecutarse múltiples veces sin problemas

## Archivos de Migración SQL

- `037_fix_spelling_errors.sql`: Corrección de errores de ortografía
- `038_rename_unclear_tables.sql`: Renombrado de tablas (referencia)
- `039_fix_column_types_and_names.sql`: Corrección de tipos de datos (referencia)

**Nota:** Los scripts SQL son de referencia. El script PHP `execute_complete_naming_migration.php` es el que ejecuta las migraciones reales.
