# Resumen: Revisión de Columnas de Trazabilidad

## Estado Actual

### ✅ Tablas con TODAS las columnas de trazabilidad (12)
- agency
- company
- configuration_process
- customer_type
- document_by_file
- document_type
- file_extraordinary_reasons
- file_reasons
- file_share_token
- operation_type
- process
- user

### ⚠️ Tablas con ALGUNAS columnas de trazabilidad (8)

#### Faltan solo `Enabled`:
- client (tiene: RegistrationDate, UpdateDate, IdLastUserUpdate)
- file (tiene: RegistrationDate, UpdateDate, IdLastUserUpdate)
- file_pld (tiene: RegistrationDate, UpdateDate, IdLastUserUpdate)
- order_by_car (tiene: RegistrationDate, UpdateDate, IdLastUserUpdate)

#### Faltan varias columnas:
- file_pld_beneficial_owner (tiene: RegistrationDate | faltan: UpdateDate, IdLastUserUpdate, Enabled)
- file_pld_geo_log (tiene: RegistrationDate | faltan: UpdateDate, IdLastUserUpdate, Enabled)
- user_refresh_token (tiene: UpdateDate | faltan: RegistrationDate, IdLastUserUpdate, Enabled)
- user_role (tiene: RegistrationDate, UpdateDate, Enabled | falta: IdLastUserUpdate)

### ❌ Tablas SIN columnas de trazabilidad (13)
- activity_log
- agency_user
- client_total_relation
- configuration_process_document_type
- document_file_error
- document_file_status
- file_status
- file_sub_status
- files_to_correct
- header_client
- process_user
- user_activity_logs

**Nota:** La tabla `migrations` se omite intencionalmente ya que es una tabla del sistema de CodeIgniter.

## Columnas de Trazabilidad Estándar

Las columnas de trazabilidad que deben tener todas las tablas son:

1. **RegistrationDate** (TIMESTAMP) - Fecha de registro del registro
2. **UpdateDate** (TIMESTAMP) - Fecha de última actualización
3. **IdLastUserUpdate** (BIGINT) - ID del último usuario que actualizó el registro
4. **Enabled** (TINYINT(1)) - Indica si el registro está habilitado (1) o deshabilitado (0)

## Migración Creada

Se ha creado la migración `020_add_traceability_columns.sql` que agrega todas las columnas faltantes a las tablas correspondientes.

## Ejecución

Para ejecutar la migración:

```bash
php scripts/execute_traceability_migration.php
```

O ejecutar directamente el SQL:

```bash
mysql -u usuario -p base_de_datos < BE/DB/migrations/020_add_traceability_columns.sql
```
