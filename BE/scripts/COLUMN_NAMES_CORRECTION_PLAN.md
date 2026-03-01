# Plan de Corrección de Nombres de Columnas

## ⚠️ ADVERTENCIA IMPORTANTE

**ANTES DE PROCEDER**: Es necesario verificar si la base de datos tiene las columnas en **PascalCase** o en **snake_case**.

### Situación Actual

Según el esquema SQL original (`DB/sql 2`), las columnas están en **PascalCase**:
- `Id`, `IdProcess`, `IdAgency`, `RegistrationDate`, `UpdateDate`, etc.

Sin embargo, el código puede estar usando ambos estándares de manera inconsistente.

### Opciones

#### Opción 1: Mantener PascalCase en BD y Código
- **Ventaja**: No requiere cambios en BD
- **Desventaja**: Inconsistente con nombres de tablas en snake_case

#### Opción 2: Convertir todo a snake_case
- **Ventaja**: Consistente con nombres de tablas
- **Desventaja**: Requiere migración masiva de BD y cambios en todo el código

### Recomendación

Dado que:
1. Las tablas ya están en snake_case
2. El usuario pidió homologar nombres de columnas también
3. snake_case es más estándar en bases de datos modernas

**Recomendación**: Convertir columnas a snake_case, pero hacerlo en fases:

### Fase 1: Verificación
1. Verificar nombres reales de columnas en BD actual
2. Crear script de verificación
3. Documentar todas las diferencias

### Fase 2: Migración de BD
1. Crear migración SQL para renombrar columnas
2. Probar en ambiente de desarrollo
3. Ejecutar en producción con backup

### Fase 3: Actualización de Código
1. Actualizar modelos (allowedFields, SELECTs, WHEREs)
2. Actualizar controladores (queries SQL, arrays)
3. Actualizar servicios
4. Probar exhaustivamente

## Mapeo de Columnas Críticas

### Columnas de Identificación (más usadas)
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

### Columnas de Fechas
- `RegistrationDate` → `registration_date`
- `UpdateDate` → `update_date`
- `ExpirationDate` → `expiration_date`

### Columnas de Estado
- `Enabled` → `enabled`
- `Required` → `required`
- `Name` → `name`

## Archivos Prioritarios para Corregir

1. **Modelos** (alta prioridad):
   - `DocumentTypeModel.php`
   - `DocumentoRequeridoModel.php`
   - `ConfigurationProcessModel.php`
   - `DocumentModel.php`
   - `FileModel.php`

2. **Controladores** (alta prioridad):
   - `DocumentType.php`
   - `DocumentoRequerido.php`
   - `Files.php`
   - `Validacion.php`

3. **Servicios**:
   - `FileService.php`
   - `ConfigurationService.php`

## Próximos Pasos

1. ✅ Crear mapeo completo de columnas
2. ⏳ Verificar estado real de BD
3. ⏳ Crear script de migración SQL
4. ⏳ Actualizar código sistemáticamente
5. ⏳ Probar exhaustivamente
