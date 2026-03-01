# Resumen de Corrección de Nombres de Tablas

## Fecha: 2026-02-28

## Objetivo
Homologar todos los nombres de tablas en el código con los nombres reales en la base de datos, usando el estándar **snake_case**.

## Cambios Realizados

### 1. DocumentModel.php
**Archivo:** `BE/app/Models/DocumentModel.php`

**Correcciones:**
- `DocumentType` → `document_type` (3 ocurrencias)
- `DocumentFileStatus` → `document_file_status` (3 ocurrencias)
- `DocumentFile_Error` → `document_file_error` (2 ocurrencias)
- `FileStatus` → `file_status` (2 ocurrencias)
- `FileSubStatus` → `file_sub_status` (3 ocurrencias)

**Líneas afectadas:** 105-112, 172-174, 248-253, 353, 376

### 2. DocumentoRequeridoModel.php
**Archivo:** `BE/app/Models/DocumentoRequeridoModel.php`

**Correcciones:**
- `DocumentType` → `document_type` (1 ocurrencia)
- `FileStatus` → `file_status` (1 ocurrencia)
- `FileSubStatus` → `file_sub_status` (1 ocurrencia)
- `$this->builder()` → `$this->db->table()` para mejor control de alias

**Líneas afectadas:** 126-128

### 3. Files.php (Controller)
**Archivo:** `BE/app/Controllers/Api/Files.php`

**Correcciones:**
- `configuration_processDocumentType` → `configuration_process_document_type` (1 ocurrencia)
- `order` → `order_by_car` (2 ocurrencias)

**Líneas afectadas:** 57, 423, 936

### 4. DocumentType.php (Controller)
**Archivo:** `BE/app/Controllers/Api/DocumentType.php`

**Correcciones:**
- `configuration_processDocumentType` → `configuration_process_document_type` (1 ocurrencia)

**Líneas afectadas:** 711

### 5. FileService.php
**Archivo:** `BE/app/Services/FileService.php`

**Correcciones:**
- `process_document_type` → `configuration_process_document_type` (1 ocurrencia)
- Ajustada la consulta SQL para usar las columnas correctas de `configuration_process`

**Líneas afectadas:** 242-250

## Estándar Aplicado

Todos los nombres de tablas ahora siguen el estándar **snake_case** (minúsculas con guiones bajos), que es consistente con:
- Los nombres definidos en `protected $table` de los modelos
- El estándar de CodeIgniter
- Las migraciones de base de datos que usan snake_case

## Tablas Verificadas y Corregidas

| Nombre Incorrecto | Nombre Correcto | Estado |
|-------------------|-----------------|--------|
| `DocumentType` | `document_type` | ✅ Corregido |
| `FileStatus` | `file_status` | ✅ Corregido |
| `FileSubStatus` | `file_sub_status` | ✅ Corregido |
| `DocumentFileStatus` | `document_file_status` | ✅ Corregido |
| `DocumentFile_Error` | `document_file_error` | ✅ Corregido |
| `configuration_processDocumentType` | `configuration_process_document_type` | ✅ Corregido |
| `process_document_type` | `configuration_process_document_type` | ✅ Corregido |
| `order` | `order_by_car` | ✅ Corregido |

## Archivos Modificados

1. `BE/app/Models/DocumentModel.php`
2. `BE/app/Models/DocumentoRequeridoModel.php`
3. `BE/app/Controllers/Api/Files.php`
4. `BE/app/Controllers/Api/DocumentType.php`
5. `BE/app/Services/FileService.php`

## Verificación Pendiente

Las siguientes tablas fueron verificadas y están correctas (ya usan snake_case):
- `user`
- `agency`
- `process`
- `company`
- `client`
- `customer_type`
- `operation_type`
- `file_reasons`
- `file_extraordinary_reasons`
- `file_share_token`
- `file_pld`
- `file_pld_geo_log`
- `file_pld_beneficial_owner`
- `user_activity_logs`
- `user_refresh_token`
- `user_role`
- `document_type`
- `file_document`
- `configuration_process`
- `configuration_process_document_type`
- `agency_user`
- `process_user`
- `client_total_relation`
- `header_client`
- `client_dms_relation`
- `expedientes_corregir`

## Notas Importantes

1. **MySQL Case Sensitivity**: MySQL en Windows con `lower_case_table_names=1` es case-insensitive, pero es mejor práctica usar nombres consistentes en el código.

2. **Columnas vs Tablas**: Los nombres de columnas como `Idconfiguration_processDocumentType` son correctos (son nombres de columnas, no de tablas).

3. **Vistas**: Las vistas como `view_client_relations` y `view_document_name` mantienen el prefijo `view_` y están correctas.

## Próximos Pasos Recomendados

1. Ejecutar pruebas para verificar que todas las consultas funcionan correctamente
2. Revisar logs del servidor para detectar cualquier error relacionado con nombres de tablas
3. Verificar que no haya más referencias a nombres de tablas en PascalCase en otros archivos
