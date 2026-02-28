# Resumen: Inserción de Motivos de Corrección de Expediente

## Motivos Insertados

Se insertaron exitosamente los siguientes motivos en la tabla `file_reasons`:

1. **DOCUMENTO VENCIDO** (ID: 1)
2. **DOCUMENTO NO LEGIBLE** (ID: 2)
3. **DCTO. VENCIDO Y NO LEGIBLE** (ID: 3)
4. **DCTO. NO CORRESPONDIENTE** (ID: 4)
5. **INFORMACION NO CORRESPONDE** (ID: 5)
6. **DOCUMENTO INCOMPLETO** (ID: 6)
7. **FIRMA NO COINCIDE** (ID: 7)
8. **CORRECCIÓN DE EXPEDIENTE** (ID: 8)

## Resultados

- **Total insertados:** 8
- **Omitidos (ya existían):** 0
- **Errores:** 0

## Estructura de la Tabla

La tabla `file_reasons` tiene la siguiente estructura:
- `Id` (INT, PRIMARY KEY) - Identificador único
- `Name` (VARCHAR(500), NOT NULL) - Nombre del motivo
- `IdTypeReason` (BIGINT) - ID del tipo de motivo (0 por defecto)
- `Enabled` (TINYINT) - Estado habilitado/deshabilitado (1 = habilitado)
- `RegistrationDate` (TIMESTAMP) - Fecha de registro
- `UpdateDate` (TIMESTAMP) - Fecha de última actualización
- `IdLastUserUpdate` (BIGINT) - ID del último usuario que actualizó

## Configuración de los Motivos

Todos los motivos fueron insertados con:
- `IdTypeReason = 0` (sin tipo específico asignado)
- `Enabled = 1` (habilitados)
- `IdLastUserUpdate = 1` (Administrador Sistema)
- `RegistrationDate` y `UpdateDate` = NOW()

## Uso de los Motivos

Estos motivos se utilizan para indicar por qué un expediente necesita corrección:
- **DOCUMENTO VENCIDO** - El documento ha expirado
- **DOCUMENTO NO LEGIBLE** - El documento no se puede leer claramente
- **DCTO. VENCIDO Y NO LEGIBLE** - Combinación de ambos problemas
- **DCTO. NO CORRESPONDIENTE** - El documento no corresponde al expediente
- **INFORMACION NO CORRESPONDE** - La información no coincide
- **DOCUMENTO INCOMPLETO** - Falta información en el documento
- **FIRMA NO COINCIDE** - La firma no coincide con la registrada
- **CORRECCIÓN DE EXPEDIENTE** - Motivo general de corrección

## Archivos Creados

- `BE/DB/migrations/031_insert_file_reasons.sql` - Migración SQL
- `BE/scripts/insert_file_reasons.php` - Script de inserción
- `BE/scripts/check_file_reasons_structure.php` - Script de verificación
- `BE/scripts/file_reasons_insertion_summary.md` - Este documento

## Notas

- Los motivos están habilitados por defecto (`Enabled = 1`)
- El campo `IdTypeReason` se estableció en 0 (puede ser actualizado posteriormente si se requiere categorización)
- Todos los motivos tienen trazabilidad completa con `IdLastUserUpdate = 1`
