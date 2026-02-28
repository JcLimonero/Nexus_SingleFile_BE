# Resumen: Inserción de Motivos Extraordinarios

## Operación Realizada

Se insertaron 18 motivos extraordinarios en la tabla `file_extraordinary_reasons`. Todos los nombres fueron convertidos automáticamente a formato Title Case usando la función helper `toTitleCase()`.

## Motivos Insertados

Los siguientes 18 motivos fueron insertados:

| ID | Nombre Original | Nombre en Title Case |
|----|----------------|---------------------|
| 1 | ERROR DATOS CLIENTE | Error Datos Cliente |
| 2 | Error en Fecha | Error en Fecha |
| 3 | Error en Domicilio | Error en Domicilio |
| 4 | Error en Precio | Error en Precio |
| 5 | ERROR EN RFC | Error en RFC |
| 6 | ERROR EN DATOS VEHICULO | Error en Datos Vehiculo |
| 7 | Error en el Sistema | Error en el Sistema |
| 8 | ERROR EN USO CFDI | Error en Uso CFDI |
| 9 | Error por Adenda | Error por Adenda |
| 10 | Venta Caida | Venta Caida |
| 11 | CREDITO NO AUTORIZADO | Credito No Autorizado |
| 12 | No Pago | No Pago |
| 13 | Cambio de Opini?n de Cliente | Cambio de Opinión de Cliente |
| 14 | No Llego la Unidad | No Llego la Unidad |
| 15 | AUTORIZACION DE DIRECCION | Autorizacion de Direccion |
| 16 | VENTA DE SOCIO | Venta de Socio |
| 17 | CIERRE DE MES | Cierre de Mes |
| 18 | AUTORIZACION DIR. MARCA | Autorizacion Dir. Marca |

## Estructura de la Tabla

La tabla `file_extraordinary_reasons` tiene las siguientes columnas:
- `Id` (int, PRIMARY KEY, AUTO_INCREMENT)
- `Name` (varchar(500), NOT NULL) - Almacena el nombre del motivo
- `IdTypeReason` (bigint, NULL) - Tipo de razón (NULL por defecto)
- `Enabled` (tinyint(1)) - Por defecto 1
- `RegistrationDate` (timestamp) - Fecha de registro
- `UpdateDate` (timestamp) - Fecha de actualización
- `IdLastUserUpdate` (bigint) - FK a `user.Id`, valor por defecto 1

## Resultados

- **Total insertados:** 18
- **Omitidos (ya existían):** 0
- **Errores:** 0

## Correcciones Realizadas

- **"Opini?n" → "Opinión"**: Se corrigió el carácter especial en "Cambio de Opinión de Cliente"
- **Title Case**: Todos los nombres fueron convertidos automáticamente a formato Title Case
- **Acrónimos preservados**: Acrónimos como "RFC", "CFDI", "DCTO" se mantienen en mayúsculas

## Archivos Creados

- `BE/scripts/check_file_extraordinary_reasons_structure.php` - Script para verificar estructura
- `BE/scripts/insert_file_extraordinary_reasons.php` - Script de inserción con Title Case automático
- `BE/DB/migrations/034_insert_file_extraordinary_reasons.sql` - Migración SQL
- `BE/scripts/file_extraordinary_reasons_insertion_summary.md` - Este documento

## Notas

- Los nombres fueron convertidos automáticamente a Title Case usando el helper `toTitleCase()`
- Todos los registros tienen `IdLastUserUpdate = 1` (Administrador Sistema)
- Todos los registros tienen `Enabled = 1` por defecto
- Todos los registros tienen `IdTypeReason = NULL` (puede ser asignado posteriormente)
- El script verifica duplicados antes de insertar (usando `INSERT IGNORE` en SQL)
- Los IDs se asignan automáticamente de forma consecutiva del 1 al 18
