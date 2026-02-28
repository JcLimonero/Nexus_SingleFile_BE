# Resumen: Copia de Datos de documenttype

## Operación Realizada

Se copiaron exitosamente los datos de la tabla `documenttype` de la base de datos `single_file` a la tabla `document_type` de la base de datos `nexfile`.

## Resultados

- **Total de registros copiados:** 81
- **Insertados:** 81
- **Actualizados:** 0
- **Omitidos:** 0
- **Errores:** 0

## Normalización de IdSubProcess

Se aplicó normalización al campo `IdSubProcess`:
- Valores NULL → 0
- Valores vacíos → 0
- Valores > 1,000,000 → 0 (valores inválidos como 9223372036854775807)
- Valores < 0 → 0
- Valores válidos se mantienen

### Distribución de IdSubProcess

- **Registros con IdSubProcess = 0:** 56
- **Registros con IdSubProcess válido (> 0 y <= 1000000):** 25

## Ejemplos de Registros con IdSubProcess Normalizado

| ID | Nombre | IdProcessType | IdSubProcess | Enabled |
|----|--------|---------------|--------------|---------|
| 5 | LEY ANTILAVADO | 3 | 6 | 1 |
| 22 | CARTA DE ADJUDICACION LIBERACION | 3 | 4 | 1 |
| 23 | SEGURO | 3 | 2 | 1 |
| 24 | ACCESORIOS | 1 | 3 | 1 |
| 25 | POLIZA VGD | 1 | 2 | 1 |

## Campos Copiados

Todos los campos de la tabla origen se copiaron a la tabla destino:

1. `Id` - Identificador único
2. `Name` - Nombre del tipo de documento
3. `RegistrationDate` - Fecha de registro
4. `UpdateDate` - Fecha de última actualización
5. `Enabled` - Estado habilitado/deshabilitado
6. `IdLastUserUpdate` - ID del último usuario que actualizó
7. `ReqExpiration` - Requiere expiración
8. `IdProcessType` - ID del tipo de proceso
9. `Required` - Requerido
10. `IdSubProcess` - ID del sub-proceso (normalizado)
11. `DocumentAutoUpload` - Auto-subida de documento
12. `AvailableToClient` - Disponible para cliente

## Archivos Creados

- `BE/DB/migrations/023_copy_document_type_data.sql` - Migración SQL (referencia)
- `BE/scripts/copy_document_type_data.php` - Script de ejecución
- `BE/scripts/check_document_type_tables.php` - Script de verificación
- `BE/scripts/document_type_copy_summary.md` - Este documento

## Notas Importantes

- La copia se realizó preservando los IDs originales
- Los valores de `IdSubProcess` inválidos fueron normalizados a 0
- Si un registro ya existía (por ID), se actualizó con los nuevos datos
- La tabla destino estaba vacía antes de la copia, por lo que todos fueron inserts

## Verificación

Para verificar la copia:

```sql
-- Contar registros
SELECT COUNT(*) FROM nexfile.document_type;

-- Ver registros con IdSubProcess normalizado
SELECT Id, Name, IdProcessType, IdSubProcess, Enabled 
FROM nexfile.document_type 
WHERE IdSubProcess > 0 
ORDER BY IdSubProcess, Id;

-- Ver registros con IdSubProcess = 0
SELECT COUNT(*) FROM nexfile.document_type WHERE IdSubProcess = 0;
```
