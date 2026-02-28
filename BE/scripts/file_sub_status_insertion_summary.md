# Resumen: Inserción de Sub-Estados de Archivo

## Sub-Estados Insertados

Se insertaron exitosamente los siguientes sub-estados en la tabla `file_sub_status`, todos relacionados con el estado "Liberación" (ID: 3):

1. **Placas** (ID: 1)
2. **Seguro** (ID: 2)
3. **Accesorio** (ID: 3)
4. **PDI** (ID: 4)
5. **Detallado** (ID: 5)
6. **Entrega Unidad** (ID: 6)

## Relación con Estado Principal

Todos los sub-estados están relacionados con:
- **Estado Principal:** Liberación
- **IdFileStatus:** 3
- **Foreign Key:** `file_sub_status.IdFileStatus` → `file_status.Id`

## Estructura de Datos

Cada sub-estado tiene la siguiente estructura:
- `Id` - Identificador único
- `IdFileStatus` - Referencia al estado principal (3 = Liberación)
- `Name` - Nombre del sub-estado
- `RegistrationDate` - Fecha de registro
- `UpdateDate` - Fecha de última actualización
- `IdLastUserUpdate` - ID del último usuario que actualizó
- `Enabled` - Estado habilitado (1)

## Consultas Útiles

### Obtener todos los sub-estados de Liberación
```sql
SELECT 
    fss.Id,
    fss.Name AS SubStatusName,
    fs.Name AS StatusName
FROM file_sub_status fss
LEFT JOIN file_status fs ON fss.IdFileStatus = fs.Id
WHERE fss.IdFileStatus = 3
ORDER BY fss.Name;
```

### Obtener un sub-estado específico con su estado principal
```sql
SELECT 
    fss.*,
    fs.Name AS StatusName
FROM file_sub_status fss
LEFT JOIN file_status fs ON fss.IdFileStatus = fs.Id
WHERE fss.Id = [ID_DEL_SUB_ESTADO];
```

## Archivos Creados

- `BE/DB/migrations/022_insert_file_sub_status.sql` - Migración SQL
- `BE/scripts/insert_file_sub_status.php` - Script de inserción
- `BE/scripts/file_sub_status_insertion_summary.md` - Este documento

## Notas

- Todos los sub-estados están habilitados por defecto (`Enabled = 1`)
- La relación con el estado principal está garantizada por la foreign key `FK_file_sub_status_file_status`
- Si se elimina el estado "Liberación", los `IdFileStatus` de estos sub-estados se pondrán en NULL (ON DELETE SET NULL)
- Los sub-estados pueden ser utilizados para rastrear pasos específicos dentro del proceso de "Liberación"
