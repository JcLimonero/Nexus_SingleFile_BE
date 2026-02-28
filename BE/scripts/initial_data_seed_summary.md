# Script de Inserción Inicial de Datos (Catálogos)

## Descripción

Este script maestro (`initial_data_seed.php`) ejecuta todos los scripts de inserción de catálogos en el orden correcto para preparar la base de datos para la inserción de clientes.

## Catálogos Incluidos

El script ejecuta los siguientes scripts en orden:

### 1. Roles de Usuario (`insert_user_roles.php`)
- **Descripción**: Inserta los roles del sistema
- **Datos**: Asesor, Operador Integración, Operador Liquidación, Operador Liberación, Coordinador de Operación, Gerente, Administrador, Soporte, Auditoría
- **Total**: 9 roles

### 2. Empresas y Agencias (`reset_and_create_companies_agencies.php` o `create_companies_and_agencies.php`)
- **Descripción**: Crea empresas y agencias iniciales
- **Datos**: 3 empresas con sus respectivas agencias
- **Total**: 4 empresas, 8 agencias

### 3. Procesos (`insert_processes.php`)
- **Descripción**: Inserta procesos de venta
- **Datos**: Autos Nuevos, Autos Seminuevos, Motos Nuevos
- **Total**: 3 procesos

### 4. Tipos de Cliente (`insert_customer_types.php`)
- **Descripción**: Inserta tipos de cliente
- **Datos**: Persona Física, Persona Moral
- **Total**: 2 tipos

### 5. Tipos de Operación (`insert_operation_types.php`)
- **Descripción**: Inserta tipos de operación
- **Datos**: Contado, Financiamiento, Arrendamiento, Autofinanciamiento, Crédito Interno
- **Total**: 5 tipos

### 6. Estados de Archivo (`insert_file_status.php`)
- **Descripción**: Inserta estados de archivo
- **Datos**: Integración, Liquidación, Liberación, Liberado, Cancelado, Liberado por Excepción
- **Total**: 6 estados

### 7. Sub-Estados de Archivo (`insert_file_sub_status.php`)
- **Descripción**: Inserta sub-estados relacionados con Liberación
- **Datos**: Placas, Seguro, Accesorio, PDI, Detallado, Entrega Unidad
- **Total**: 6 sub-estados

### 8. Motivos de Archivo (`insert_file_reasons.php`)
- **Descripción**: Inserta motivos de corrección de archivos
- **Datos**: 8 motivos (Documento Vencido, Documento No Legible, etc.)
- **Total**: 8 motivos

### 9. Motivos Extraordinarios (`insert_file_extraordinary_reasons.php`)
- **Descripción**: Inserta motivos extraordinarios para excepciones y cancelaciones
- **Datos**: 18 motivos (Error Datos Cliente, Error en Fecha, etc.)
- **Total**: 18 motivos

### 10. Estados de Documento (`insert_document_file_status.php`)
- **Descripción**: Inserta estados de documentos
- **Datos**: Documento Nuevo, Documento Cargado, Documento en Revisión, Documento Aprobado, Documento Rechazado, Documento Caduco
- **Total**: 6 estados

### 11. Errores de Documento (`insert_document_file_error.php`)
- **Descripción**: Inserta motivos de error de documentos
- **Datos**: 8 motivos (mismos que file_reasons)
- **Total**: 8 motivos

### 12. Usuarios de Prueba (`create_test_users.php`) - Opcional
- **Descripción**: Crea usuarios de prueba con diferentes roles y permisos
- **Datos**: Varios usuarios con diferentes configuraciones
- **Total**: Variable

## Uso

### Ejecutar todos los scripts:

```bash
cd BE
php scripts/initial_data_seed.php
```

### Ejecutar scripts individuales:

Cada script puede ejecutarse de forma independiente:

```bash
php scripts/insert_user_roles.php
php scripts/insert_processes.php
php scripts/insert_customer_types.php
# etc...
```

## Estado Actual de Catálogos

Según la última verificación:

✅ **Todos los catálogos principales están poblados:**
- ✅ Empresas: 4 registros
- ✅ Agencias: 8 registros
- ✅ Tipos de Cliente: 2 registros
- ✅ Tipos de Operación: 5 registros
- ✅ Procesos: 3 registros
- ✅ Roles de Usuario: 9 registros
- ✅ Estados de Archivo: 6 registros
- ✅ Sub-Estados de Archivo: 6 registros
- ✅ Motivos de Archivo: 8 registros
- ✅ Motivos Extraordinarios: 18 registros
- ✅ Tipos de Documento: 62 registros
- ✅ Estados de Documento: 6 registros
- ✅ Errores de Documento: 8 registros

⚠️ **Catálogos adicionales (no críticos para inserción inicial):**
- ⚠️ Configuraciones de Proceso: 0 registros (tabla de configuración)
- ⚠️ Configuración Proceso-Documento: 0 registros (tabla de configuración)

## Notas Importantes

1. **Orden de ejecución**: Los scripts están ordenados para respetar dependencias entre tablas
2. **Idempotencia**: La mayoría de los scripts son idempotentes (pueden ejecutarse múltiples veces sin duplicar datos)
3. **Formato Title Case**: Todos los nombres se insertan en formato Title Case usando el helper `toTitleCase()`
4. **Trazabilidad**: Todos los registros incluyen campos de trazabilidad (`RegistrationDate`, `UpdateDate`, `IdLastUserUpdate`, `Enabled`)

## Verificación Post-Ejecución

Después de ejecutar el script maestro, puedes verificar el estado de los catálogos:

```bash
php scripts/check_all_catalogs_status.php
```

## Archivos Relacionados

- `BE/scripts/initial_data_seed.php` - Script maestro
- `BE/scripts/check_all_catalogs_status.php` - Script de verificación
- `BE/scripts/helpers/title_case_helper.php` - Helper para Title Case
- `BE/DB/migrations/` - Migraciones SQL individuales

## Próximos Pasos

Una vez ejecutado el script de inserción inicial, la base de datos estará lista para:
1. ✅ Insertar clientes
2. ✅ Crear archivos (files)
3. ✅ Asignar documentos a archivos
4. ✅ Gestionar estados y motivos
