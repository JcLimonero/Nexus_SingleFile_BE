# Solución al Error "PRIMARY KEY missing in result set" en DBeaver

## Problema
DBeaver muestra el error: **"Can't update attribute 'Mail' - attributes of key 'nexfile.`PRIMARY`' are missing in result set"**

Esto ocurre porque DBeaver necesita que la clave primaria (`Id`) esté visible y seleccionada cuando editas datos directamente.

## Solución 1: Asegurar que la Columna Id esté Visible

### Paso 1: Abrir la Vista de Datos
1. Click derecho en la tabla `user` → **View Data**

### Paso 2: Verificar que la Columna Id esté Visible
1. En la vista de datos, verifica que la columna **`Id`** esté visible (no oculta)
2. Si no está visible:
   - Click derecho en cualquier encabezado de columna
   - Selecciona **"Configure columns"** o **"Column settings"**
   - Asegúrate de que **`Id`** esté marcada como visible
   - Haz clic en **OK**

### Paso 3: Ordenar por Id (Opcional pero Recomendado)
1. Haz clic en el encabezado de la columna **`Id`** para ordenar por ella
2. Esto ayuda a DBeaver a identificar correctamente las filas

### Paso 4: Activar Modo de Edición
1. Presiona **Ctrl+E** para activar el modo de edición
2. Verifica que aparezca "Edit mode" en la barra de estado

### Paso 5: Editar y Guardar
1. Edita el campo `Mail`
2. Guarda con **Ctrl+S**

## Solución 2: Configurar DBeaver para Incluir Clave Primaria

### Configuración de Detección de Cambios
1. Ve a: **Window** → **Preferences**
2. Navega a: **Database** → **Data Editor**
3. Busca la sección **"Change detection"** o **"Detección de cambios"**
4. Asegúrate de que:
   - **"Detect changes automatically"** esté marcado
   - **"Use primary key for row identification"** esté marcado
5. Haz clic en **Apply** y **OK**

### Configuración de Consultas
1. Ve a: **Window** → **Preferences**
2. Navega a: **Database** → **SQL Editor** → **SQL Execution**
3. Verifica que:
   - **"Read-only result set"** NO esté marcado
   - **"Use fetch size"** esté configurado apropiadamente
4. Haz clic en **Apply** y **OK**

## Solución 3: Usar SQL Editor (Más Confiable)

Si las soluciones anteriores no funcionan, usa el SQL Editor:

### Paso 1: Abrir SQL Editor
1. Click derecho en la tabla `user`
2. Selecciona **SQL Editor** → **New SQL Script**

### Paso 2: Ejecutar UPDATE
```sql
UPDATE `user` 
SET `Mail` = 'nuevo_email@nexusqtech.com', 
    `UpdateDate` = NOW() 
WHERE `Id` = [ID_DEL_USUARIO];
```

Ejemplo:
```sql
UPDATE `user` 
SET `Mail` = 'admin@nexusqtech.com', 
    `UpdateDate` = NOW() 
WHERE `Id` = 1;
```

### Paso 3: Ejecutar
1. Selecciona el comando SQL
2. Presiona **Ctrl+Enter** o haz clic en **Execute SQL** (▶️)

## Solución 4: Refrescar la Conexión

A veces DBeaver necesita refrescar la información de la tabla:

1. Click derecho en la tabla `user`
2. Selecciona **Refresh** o presiona **F5**
3. Vuelve a abrir **View Data**
4. Intenta editar nuevamente

## Solución 5: Verificar Configuración de la Conexión

1. Click derecho en la conexión a la base de datos
2. Selecciona **Edit Connection**
3. Ve a la pestaña **Driver Properties**
4. Verifica que no haya propiedades que bloqueen la edición
5. En la pestaña **General**, verifica:
   - **Read-only** NO debe estar marcado
   - **Auto-commit** debe estar marcado (si está disponible)

## Verificación Rápida

Para verificar que todo está configurado correctamente:

1. Abre la tabla `user` en modo de datos
2. Verifica que la columna `Id` sea la primera columna visible
3. Verifica que puedas ver el valor de `Id` para cada fila
4. Activa el modo de edición (Ctrl+E)
5. Intenta editar el campo `Mail`
6. Guarda los cambios (Ctrl+S)

## Notas Importantes

- **Siempre asegúrate de que la columna `Id` esté visible** antes de editar
- Si el problema persiste, usa el **SQL Editor** (Solución 3) que es más confiable
- El error ocurre porque DBeaver necesita la clave primaria para identificar qué fila actualizar
- Si la columna `Id` está oculta o no está en el resultado, DBeaver no puede hacer el UPDATE correctamente

## Comando SQL de Respaldo

Si nada funciona, siempre puedes usar este comando SQL directamente:

```sql
-- Ver usuarios actuales
SELECT Id, Name, Mail FROM `user` ORDER BY Id;

-- Actualizar email de un usuario específico
UPDATE `user` 
SET `Mail` = 'nuevo_email@nexusqtech.com', 
    `UpdateDate` = NOW() 
WHERE `Id` = [ID];

-- Verificar el cambio
SELECT Id, Name, Mail FROM `user` WHERE `Id` = [ID];
```
