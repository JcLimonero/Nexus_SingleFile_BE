# Resumen de Revisión de Referencias a Tablas Renombradas

## Fecha: 2026-02-27

## Tablas Renombradas Verificadas

### ✅ Tablas Corregidas Correctamente

1. **`file` → `expedient`**
   - ✅ Todas las referencias corregidas
   - Archivos afectados: Analytics.php, Validacion.php, Files.php, Miniportal.php, Client.php

2. **`document_by_file` → `file_document`**
   - ✅ Todas las referencias corregidas
   - Archivos afectados: Analytics.php, Validacion.php, Miniportal.php, Documents.php

3. **`order_by_car` → `order`**
   - ✅ Todas las referencias corregidas
   - Archivos afectados: Validacion.php, Files.php, Miniportal.php, Client.php

4. **`header_client` → `client_header`**
   - ✅ Todas las referencias corregidas
   - Archivos afectados: Validacion.php, Files.php, Client.php, VanguardiaClientImport.php, ReportesCumplimiento.php

5. **`client_total_relation` → `client_dms_relation`**
   - ✅ Todas las referencias corregidas
   - Archivos afectados: Validacion.php, Files.php, Client.php, VanguardiaClientImport.php, ReportesCumplimiento.php, Analytics.php

### ✅ Correcciones de Nomenclatura Realizadas

1. **`File_Status` / `FileStatus` → `file_status`**
   - ✅ Corregido en: Analytics.php (5 lugares), Validacion.php (2 lugares), Miniportal.php (1 lugar)
   - Nota: Existe tanto `file_status` como `File_Status` en la BD, pero se usa `file_status` (snake_case)

2. **`DocumentType` → `document_type`**
   - ✅ Corregido en: Analytics.php (2 lugares), Validacion.php (1 lugar), Miniportal.php (4 lugares)

3. **`DocumentFileStatus` / `DocumentFile_Status` → `document_file_status`**
   - ✅ Corregido en: Validacion.php (1 lugar), Miniportal.php (1 lugar)

4. **`FileDocument` → `file_document`**
   - ✅ Corregido en: Miniportal.php (2 lugares)

5. **`FileSubStatus` → `file_sub_status`**
   - ✅ Corregido en: FileSubStatus.php (3 lugares)

### ⚠️ Correcciones Adicionales

1. **Error en JOIN de Analytics.php línea 2226**
   - ❌ Antes: `fs.IdClient`
   - ✅ Después: `fs.Id`
   - Corregido

2. **Comentarios actualizados**
   - Comentarios que mencionaban `File_Status` actualizados a `file_status`
   - Comentarios que mencionaban `DocumentType` actualizados a `document_type`

## Archivos Modificados

1. `BE/app/Controllers/Api/Analytics.php`
   - 8 correcciones de nombres de tablas
   - 1 corrección de error en JOIN

2. `BE/app/Controllers/Api/Validacion.php`
   - 4 correcciones de nombres de tablas
   - 1 corrección de comentario

3. `BE/app/Controllers/Api/Miniportal.php`
   - 6 correcciones de nombres de tablas

4. `BE/app/Controllers/Api/FileSubStatus.php`
   - 3 correcciones de nombres de tablas

5. `BE/app/Controllers/Api/Files.php`
   - 1 corrección de comentario

## Estado Final

✅ **Todas las referencias a tablas renombradas han sido corregidas**
✅ **Todas las referencias usan snake_case consistente**
✅ **No se encontraron referencias pendientes a nombres antiguos**

## Notas Importantes

1. La tabla `File_Status` existe en la base de datos, pero se debe usar `file_status` (snake_case) para mantener consistencia.

2. Todas las referencias a tablas ahora usan snake_case, que es el estándar establecido en las migraciones anteriores.

3. Los comentarios también fueron actualizados para reflejar los nombres correctos de las tablas.

4. Se verificó que todas las tablas renombradas están correctamente referenciadas en los controladores de la API.
