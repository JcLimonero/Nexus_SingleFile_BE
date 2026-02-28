# Resumen: Relación entre file_sub_status y file_status

## Cambios Realizados

### Columna Agregada
- **Tabla:** `file_sub_status`
- **Columna:** `IdFileStatus` (INT, NULL)
- **Posición:** Después de `Id`
- **Descripción:** Referencia al estado principal (`file_status`)

### Índice Creado
- **Nombre:** `IDX_file_sub_status_IdFileStatus`
- **Tabla:** `file_sub_status`
- **Columna:** `IdFileStatus`
- **Propósito:** Mejorar el rendimiento de las consultas JOIN

### Foreign Key Constraint
- **Nombre:** `FK_file_sub_status_file_status`
- **Tabla origen:** `file_sub_status`
- **Columna origen:** `IdFileStatus`
- **Tabla destino:** `file_status`
- **Columna destino:** `Id`
- **ON DELETE:** SET NULL (si se elimina un file_status, el IdFileStatus se pone en NULL)
- **ON UPDATE:** CASCADE (si se actualiza el Id de file_status, se actualiza automáticamente)

## Estructura Final

### Tabla file_sub_status
```
Id (BIGINT, PRIMARY KEY)
IdFileStatus (INT, NULL, FOREIGN KEY -> file_status.Id)
Name (VARCHAR(500))
RegistrationDate (TIMESTAMP)
UpdateDate (TIMESTAMP)
IdLastUserUpdate (BIGINT)
Enabled (TINYINT(1))
```

## Uso

Ahora puedes relacionar sub-estados con estados principales:

```sql
-- Insertar un sub-estado relacionado con un estado
INSERT INTO file_sub_status (Id, IdFileStatus, Name, Enabled)
VALUES (1, 1, 'Sub-estado de Integración', 1);

-- Consultar sub-estados con su estado principal
SELECT 
    fss.Id,
    fss.Name AS SubStatusName,
    fs.Name AS StatusName
FROM file_sub_status fss
LEFT JOIN file_status fs ON fss.IdFileStatus = fs.Id;
```

## Archivos Creados

- `BE/DB/migrations/021_add_file_status_relation.sql` - Migración SQL
- `BE/scripts/execute_file_status_relation.php` - Script de ejecución
- `BE/scripts/check_file_status_tables.php` - Script de verificación

## Notas

- La relación permite que un sub-estado pertenezca a un estado principal
- Si se elimina un `file_status`, los `file_sub_status` relacionados tendrán `IdFileStatus = NULL`
- Si se actualiza el `Id` de un `file_status`, los `IdFileStatus` relacionados se actualizan automáticamente
- La columna `IdFileStatus` permite NULL, por lo que los sub-estados pueden existir sin estar relacionados a un estado principal
