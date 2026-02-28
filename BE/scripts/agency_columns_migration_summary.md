# Resumen: Migración de Columnas de Agency

## Operación Realizada

Se realizaron dos cambios en la estructura de la base de datos:

1. **Renombrar `IdAgency` a `IdAgencyDMS`** en la tabla `agency`
2. **Mover `AgencyConnection`** de la tabla `agency` a la tabla `company`

## Cambios en la Base de Datos

### Tabla `agency`
- ✅ Columna `IdAgency` renombrada a `IdAgencyDMS`
- ✅ Columna `AgencyConnection` eliminada

### Tabla `company`
- ✅ Columna `AgencyConnection` agregada

## Archivos Actualizados

### Modelos
- ✅ `BE/app/Models/AgencyModel.php`
  - Actualizado `allowedFields`: removido `AgencyConnection`, cambiado `IdAgency` a `IdAgencyDMS`
  - Actualizado `validationRules`: cambiado `IdAgency` a `IdAgencyDMS`
  - Actualizado `validationMessages`: cambiado `IdAgency` a `IdAgencyDMS`
  - Actualizado métodos `getAgenciesByRegion()` y `getAgenciesByRegionWithUser()`: cambiado `IdAgency` a `IdAgencyDMS`

- ✅ `BE/app/Models/CompanyModel.php`
  - Actualizado `allowedFields`: agregado `AgencyConnection`

### Servicios
- ✅ `BE/app/Services/AgencyService.php`
  - Actualizado `getAgencyInternalId()`: cambiado `IdAgency` a `IdAgencyDMS`
  - Actualizado `getAgencyByExternalId()`: cambiado `IdAgency` a `IdAgencyDMS`

### Controladores
- ✅ `BE/app/Controllers/Api/Agency.php`
  - Actualizado `allowedSortFields`: cambiado `IdAgency` a `IdAgencyDMS`

- ✅ `BE/app/Controllers/Api/Files.php`
  - Actualizado referencias a `a.IdAgency` a `a.IdAgencyDMS` en queries SQL
  - Actualizado alias `AgencyIdAgency` a `AgencyIdAgencyDMS`
  - Actualizado método `getAgencyByExternalId()`: cambiado `IdAgency` a `IdAgencyDMS`
  - Actualizado comentarios y logs

- ✅ `BE/app/Controllers/Api/VanguardiaClientImport.php`
  - Actualizado método `getAgencyIdFromIdAgency()`: cambiado `IdAgency` a `IdAgencyDMS`
  - Actualizado logs

### Migraciones
- ✅ `BE/DB/migrations/036_rename_idagency_and_move_agencyconnection.sql` - Migración SQL

### Scripts
- ✅ `BE/scripts/migrate_agency_columns.php` - Script de migración ejecutado
- ✅ `BE/scripts/check_agency_company_structure.php` - Script de verificación

## Notas Importantes

⚠️ **IMPORTANTE**: Las siguientes referencias NO deben cambiar porque son foreign keys a otras tablas:
- `file.IdAgency` - Foreign key a `agency.Id` (NO cambiar)
- `agency_user.IdAgency` - Foreign key a `agency.Id` (NO cambiar)
- `client_total_relation.IdAgency` - Foreign key a `agency.Id` (NO cambiar)
- `configuration_process.IdAgency` - Foreign key a `agency.Id` (NO cambiar)

Solo la columna `IdAgency` de la tabla `agency` cambió a `IdAgencyDMS`.

## Frontend (Pendiente)

Los siguientes archivos del frontend necesitan actualización:

- `FE/src/app/core/services/agency.service.ts` - Interface `Agency` tiene `IdAgency?` que debe cambiar a `IdAgencyDMS?`
- `FE/src/app/core/interfaces/user-access.interface.ts` - Interface `Agency` tiene `IdAgency?` que debe cambiar a `IdAgencyDMS?`

## Verificación

Para verificar que los cambios se aplicaron correctamente:

```sql
-- Verificar estructura de agency
DESCRIBE agency;

-- Verificar estructura de company
DESCRIBE company;

-- Verificar que no existe IdAgency en agency
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'agency' 
AND COLUMN_NAME = 'IdAgency';

-- Verificar que existe IdAgencyDMS en agency
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'agency' 
AND COLUMN_NAME = 'IdAgencyDMS';

-- Verificar que existe AgencyConnection en company
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'company' 
AND COLUMN_NAME = 'AgencyConnection';
```
