# Resumen: Corrección de Nombres de Columnas a snake_case

## ✅ Cambios Realizados

### 1. Migración SQL Creada
- **Archivo**: `BE/DB/migrations/038_convert_columns_to_snake_case.sql`
- **Descripción**: Migración completa para convertir todas las columnas de PascalCase a snake_case en todas las tablas principales

### 2. Modelos Actualizados

#### DocumentTypeModel.php
- ✅ `allowedFields` actualizado a snake_case
- ✅ Métodos `getActiveDocumentTypes()` y `getDocumentTypeByName()` corregidos
- ✅ Método `getConfigurationsByDocumentType()`: SELECT y JOINs corregidos
- ✅ Método `getDocumentTypesWithRelations()`: SELECT, JOINs, WHEREs y ordenamiento corregidos
- ✅ Método `countDocumentTypesWithRelations()`: JOINs y WHEREs corregidos
- ✅ Método `findWithRelations()`: SELECT y JOINs corregidos
- ✅ Mapeo de campos de ordenamiento agregado para compatibilidad con PascalCase

#### DocumentoRequeridoModel.php
- ✅ `allowedFields` actualizado a snake_case
- ✅ Método `getDocumentosRequeridos()`: SELECT, JOINs, WHEREs y ordenamiento corregidos
- ✅ Método `countDocumentosRequeridos()`: JOINs y WHEREs corregidos
- ✅ Método `findWithRelations()`: SELECT y JOINs corregidos
- ✅ Método `documentoRequeridoExists()`: WHEREs corregidos
- ✅ Método `createDocumentoRequerido()`: INSERT corregido con mapeo
- ✅ Método `updateDocumentoRequerido()`: UPDATE corregido con mapeo
- ✅ Método `getDocumentosRequeridosStats()`: WHEREs y SELECTs corregidos
- ✅ Mapeo de campos de ordenamiento agregado para compatibilidad con PascalCase

#### ConfigurationProcessModel.php
- ✅ `allowedFields` actualizado a snake_case

#### DocumentModel.php
- ✅ `allowedFields` actualizado a snake_case
- ✅ Método `getDocumentsWithRelations()`: SELECT, JOINs, WHEREs y ordenamiento corregidos
- ✅ Método `countDocumentsWithRelations()`: JOINs y WHEREs corregidos
- ✅ Mapeo de campos de ordenamiento agregado para compatibilidad con PascalCase

### 3. Mapeo de Columnas Principales

#### Columnas de Identificación
- `Id` → `id`
- `IdProcess` → `id_process`
- `IdAgency` → `id_agency`
- `IdClient` → `id_client`
- `IdCustomerType` → `id_customer_type`
- `IdOperationType` → `id_operation_type`
- `IdDocumentType` → `id_document_type`
- `IdFile` → `id_file`
- `IdCurrentState` → `id_current_state`
- `IdCurrentStatus` → `id_current_status`
- `IdLastUserUpdate` → `id_last_user_update`
- `IdProcessType` → `id_process_type`
- `IdSubProcess` → `id_sub_process`
- `IdConfigurationProcess` → `id_configuration_process`

#### Columnas de Fechas
- `RegistrationDate` → `registration_date`
- `UpdateDate` → `update_date`
- `ExpirationDate` → `expiration_date`

#### Columnas de Estado y Configuración
- `Enabled` → `enabled`
- `Required` → `required`
- `ReqExpiration` → `req_expiration`
- `AvailableToClient` → `available_to_client`

#### Columnas de Texto
- `Name` → `name`
- `Description` → `description`
- `Comment` → `comment`
- `PathDocument` → `path_document`
- `ServerPath` → `server_path`

## ⚠️ Pendiente

### Controladores y Servicios
Los siguientes archivos aún necesitan corrección:
- `BE/app/Controllers/Api/DocumentType.php`
- `BE/app/Controllers/Api/DocumentoRequerido.php`
- `BE/app/Controllers/Api/Files.php`
- `BE/app/Services/FileService.php`
- `BE/app/Services/ConfigurationService.php`
- Otros controladores que usen queries SQL directas

### Migración de Base de Datos
**IMPORTANTE**: La migración SQL (`038_convert_columns_to_snake_case.sql`) debe ejecutarse en la base de datos antes de que el código actualizado funcione correctamente.

## 📝 Notas

1. **Compatibilidad con PascalCase**: Se agregaron mapeos en los métodos de ordenamiento para mantener compatibilidad con parámetros que vengan en PascalCase desde el frontend.

2. **Mapeo en INSERT/UPDATE**: Los métodos `createDocumentoRequerido()` y `updateDocumentoRequerido()` mapean automáticamente los datos que vengan en PascalCase a snake_case.

3. **Próximos Pasos**:
   - Ejecutar migración SQL en ambiente de desarrollo
   - Actualizar controladores y servicios
   - Probar exhaustivamente todas las APIs
   - Ejecutar migración en producción con backup completo
