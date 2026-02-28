# Resumen: Inserción de Motivos en document_file_error

## Operación Realizada

Se insertaron los mismos motivos de error que se agregaron a `file_reasons` en la tabla `document_file_error`. Todos los nombres fueron convertidos automáticamente a formato Title Case usando la función helper `toTitleCase()`.

## Motivos Insertados

Los siguientes 8 motivos fueron insertados en `document_file_error`:

| ID | Description |
|----|-------------|
| 1 | Documento Vencido |
| 2 | Documento No Legible |
| 3 | Dcto. Vencido y No Legible |
| 4 | Dcto. No Correspondiente |
| 5 | Informacion No Corresponde |
| 6 | Documento Incompleto |
| 7 | Firma No Coincide |
| 8 | Corrección de Expediente |

## Estructura de la Tabla

La tabla `document_file_error` tiene las siguientes columnas:
- `Id` (int, PRIMARY KEY)
- `Description` (varchar(500)) - Almacena el nombre del motivo
- `RegistrationDate` (timestamp)
- `UpdateDate` (timestamp)
- `IdLastUserUpdate` (bigint) - FK a `user.Id`
- `Enabled` (tinyint(1)) - Por defecto 1

## Resultados

- **Total insertados:** 8
- **Omitidos (ya existían):** 0
- **Errores:** 0

## Diferencias con file_reasons

- **Columna de nombre:** `file_reasons` usa `Name`, mientras que `document_file_error` usa `Description`
- **Mismo contenido:** Ambos contienen los mismos motivos de error
- **Mismo formato:** Ambos usan Title Case para los nombres

## Archivos Creados

- `BE/scripts/check_document_file_error_structure.php` - Script para verificar estructura
- `BE/scripts/insert_document_file_error.php` - Script de inserción con Title Case automático
- `BE/DB/migrations/033_insert_document_file_error.sql` - Migración SQL
- `BE/scripts/document_file_error_insertion_summary.md` - Este documento

## Notas

- Los nombres fueron convertidos automáticamente a Title Case usando el helper `toTitleCase()`
- Todos los registros tienen `IdLastUserUpdate = 1` (Administrador Sistema)
- Todos los registros tienen `Enabled = 1` por defecto
- El script verifica duplicados antes de insertar (usando `INSERT IGNORE` en SQL)
- Los IDs se asignan automáticamente de forma consecutiva
