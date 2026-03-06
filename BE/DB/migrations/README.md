# Migraciones de Base de Datos - Mejoras de Estructura

## 📋 Descripción

Este directorio contiene scripts SQL para mejorar la estructura de la base de datos según las recomendaciones de optimización.

## 🎯 Mejoras Implementadas

### Migración 001: Corrección de Consistencia en Nombres
- Renombra `customertype` → `CustomerType`
- Corrige `IdCostumerType` → `IdCustomerType` en `ConfigurationProcess` y `File`
- Corrige `Company.name` → `Company.Name`
- Actualiza índices relacionados

### Migración 002: Agregar Constraints NOT NULL
- Agrega NOT NULL a columnas críticas en `File`
- Agrega NOT NULL a columnas críticas en `ConfigurationProcess`
- Agrega NOT NULL a columnas críticas en `Client_Total_Relation`
- Corrige tipo de `Client.UpdateDate` de VARCHAR a TIMESTAMP

### Migración 003: Agregar Foreign Keys
- Agrega FK `File.IdCustomerType` → `CustomerType.Id`
- Agrega FK `ConfigurationProcess.IdCustomerType` → `CustomerType.Id`
- Agrega FK `ConfigurationProcess.IdAgency` → `Agency.Id`
- Agrega FK `ConfigurationProcess.IdProcess` → `Process.Id`
- Agrega FK `ConfigurationProcess.IdOperationType` → `OperationType.Id`
- Agrega FK `Client_Total_Relation.idHeaderClient` → `HeaderClient.Id`
- Agrega FK `Client_Total_Relation.IdAgency` → `Agency.Id`

### Migración 004: Agregar Índices Compuestos
- `IDX_File_Agency_State_Date`: Para búsquedas por agencia + estado + fecha
- `IDX_File_Client_Process`: Para búsquedas por cliente + proceso
- `IDX_File_Client_Agency_State`: Para búsquedas por cliente + agencia + estado
- `IDX_Config_Unique`: Índice único para evitar duplicados en ConfigurationProcess
- `IDX_DocumentByFile_File_Status`: Para búsquedas por file + estado
- `IDX_DocumentByFile_Type_Status`: Para búsquedas por tipo + estado
- `IDX_DocumentByFile_File_Type`: Para búsquedas por file + tipo
- `IDX_File_OrderTotal`: Para JOINs con OrderByCar
- `IDX_File_Date_State`: Para analytics y reportes

## ⚠️ IMPORTANTE: Antes de Ejecutar

1. **HACER BACKUP DE LA BASE DE DATOS**
   ```bash
   mysqldump -u usuario -p nombre_bd > backup_antes_migracion.sql
   ```

2. **Verificar datos NULL y huérfanos**
   - Ejecutar las queries de verificación incluidas en cada script
   - Corregir datos inconsistentes antes de aplicar constraints

3. **Ejecutar en entorno de pruebas primero**
   - Probar en una copia de la BD de producción
   - Verificar que todas las aplicaciones funcionen correctamente

## 🚀 Formas de Ejecutar

### Opción 1: Script SQL Individual (Recomendado)

Ejecutar cada migración en orden:

```bash
mysql -u usuario -p nombre_bd < 001_fix_naming_consistency.sql
mysql -u usuario -p nombre_bd < 002_add_not_null_constraints.sql
mysql -u usuario -p nombre_bd < 003_add_foreign_keys.sql
mysql -u usuario -p nombre_bd < 004_add_composite_indexes.sql
```

### Opción 2: Script Maestro

```bash
mysql -u usuario -p nombre_bd < 000_run_all_migrations.sql
```

**Nota:** El script maestro usa `SOURCE`, que requiere ejecutarse desde dentro de MySQL:
```sql
mysql -u usuario -p nombre_bd
mysql> source /ruta/completa/000_run_all_migrations.sql
```

### Opción 3: Script PHP (Más Seguro)

```bash
php run_migrations.php
```

El script PHP verifica cada paso y permite rollback si hay errores.

## ✅ Verificación Post-Migración

Después de ejecutar las migraciones, ejecutar el script de verificación:

```bash
mysql -u usuario -p nombre_bd < 005_verify_migrations.sql
```

O desde PHP:
```bash
php verify_migrations.php
```

## 🔄 Rollback

Si necesitas revertir los cambios:

1. Restaurar desde backup:
   ```bash
   mysql -u usuario -p nombre_bd < backup_antes_migracion.sql
   ```

2. O ejecutar scripts de rollback individuales (si existen)

## 📝 Notas

- Los scripts incluyen verificaciones para evitar errores si los cambios ya están aplicados
- Los foreign keys usan `ON DELETE RESTRICT` para proteger la integridad de datos
- Los índices compuestos mejoran significativamente el performance de queries frecuentes
- Los constraints NOT NULL aseguran la integridad de datos críticos

## 🐛 Troubleshooting

### Error: "Cannot add foreign key constraint"
- Verificar que no existan datos huérfanos
- Ejecutar las queries de verificación incluidas en el script
- Corregir datos inconsistentes antes de agregar FKs

### Error: "Cannot add NOT NULL constraint"
- Verificar que no existan registros con NULL en esas columnas
- Actualizar registros NULL con valores por defecto o eliminar registros inválidos

### Error: "Duplicate key name"
- El índice ya existe, es seguro continuar
- Los scripts verifican existencia antes de crear

## 📞 Soporte

Si encuentras problemas durante la migración:
1. Revisar los logs de MySQL
2. Ejecutar el script de verificación para identificar problemas
3. Restaurar desde backup si es necesario
