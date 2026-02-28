# Reporte de Tablas No Utilizadas en la Base de Datos

## 📊 Resumen Ejecutivo

- **Total de tablas en BD:** 51
- **Tablas en uso:** 37
- **Tablas no usadas:** 14

## ❌ Tablas No Utilizadas (14)

### 📁 Configuración Externa (5 tablas)
Estas tablas parecen ser catálogos o configuraciones que no están implementadas:

1. **appversion** - Control de versiones de aplicación
2. **bank** - Catálogo de bancos
3. **cfdi** - Catálogo CFDI
4. **insurancecarrier** - Catálogo de aseguradoras
5. **smtp_configurator** - Configuración SMTP (se usa configuración en archivos)

**Recomendación:** Mantener si pueden usarse en otros sistemas o futuras integraciones.

### 📁 Futuro/Planeado (4 tablas)
Funcionalidades que parecen estar planeadas pero no implementadas:

1. **file_extraordinary_events** - Eventos extraordinarios de expedientes
2. **file_extraordinary_type** - Tipos de eventos extraordinarios
3. **file_release_steps** - Pasos de liberación de expedientes
4. **file_tracking** - Tracking de archivos

**Recomendación:** Mantener si hay planes de implementar estas funcionalidades.

### 📁 Legacy/Deprecated (2 tablas)
Tablas que parecen ser legacy y posiblemente reemplazadas:

1. **tracking_file** - Tracking legacy
2. **tracking_operation** - Operaciones de tracking legacy

**Recomendación:** Considerar eliminación después de verificar que no hay datos importantes.

### 📁 Vistas No Implementadas (3 vistas)
Vistas creadas pero no utilizadas en el código:

1. **view_all_relations** - Vista de todas las relaciones
2. **view_files** - Vista de archivos
3. **view_files_by_client** - Vista de archivos por cliente

**Recomendación:** Evaluar si se necesitarán, si no, considerar eliminación.

## ✅ Tablas que SÍ se Usan (verificadas)

- **documentfile_error** - Usada en DocumentModel.php para JOINs
- **activitylog** - Usada en Routes.php
- **migrations** - Tabla del sistema CodeIgniter
- **view_client_company_amount** - Usada en Config/AML.php

## 🎯 Acciones Recomendadas

### 1. Eliminar (si no hay datos importantes)
- `tracking_file`
- `tracking_operation`
- `view_all_relations` (si no se planea usar)
- `view_files` (si no se planea usar)
- `view_files_by_client` (si no se planea usar)

### 2. Mantener (para futuro)
- `file_extraordinary_events`
- `file_extraordinary_type`
- `file_release_steps`
- `file_tracking`

### 3. Evaluar
- `appversion`, `bank`, `cfdi`, `insurancecarrier`, `smtp_configurator`
- Verificar si se usarán en otros sistemas o integraciones futuras

## 📝 Notas

- Este análisis se basa en búsqueda de referencias en el código PHP de la aplicación
- Algunas tablas pueden usarse en scripts externos o sistemas relacionados
- Se recomienda verificar manualmente antes de eliminar cualquier tabla
- Hacer backup antes de eliminar tablas
