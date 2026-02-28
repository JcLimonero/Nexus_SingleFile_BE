# Cómo Hacer Visible la Columna Mail en DBeaver

## Problema
La columna `Mail` no está visible en la vista de datos de DBeaver, por lo que no puedes editarla directamente.

## Solución: Configurar Columnas Visibles

### Paso 1: Abrir Configuración de Columnas
1. En la vista de datos de la tabla `user` (donde estás ahora)
2. Haz **click derecho** en cualquier encabezado de columna (por ejemplo, en "Name" o "Id")
3. Selecciona **"Configure columns"** o **"Column settings"** o **"Configurar columnas"**

### Paso 2: Hacer Visible la Columna Mail
1. En el diálogo que se abre, verás una lista de todas las columnas disponibles
2. Busca la columna **`Mail`** en la lista
3. Marca la casilla de verificación junto a **`Mail`** para hacerla visible
4. También verifica que **`Id`** esté marcada (debe estar visible ya que la ves en la pantalla)
5. Opcionalmente, puedes arrastrar **`Mail`** para colocarla cerca de **`Name`** o **`Id`** para tenerla más accesible
6. Haz clic en **OK** o **Apply**

### Paso 3: Verificar que Mail esté Visible
1. Después de cerrar el diálogo, deberías ver la columna **`Mail`** en la vista de datos
2. Si no aparece, intenta:
   - Cerrar y volver a abrir la vista de datos
   - O hacer clic derecho en la tabla → **Refresh** (F5)

### Paso 4: Editar el Campo Mail
1. Una vez que la columna **`Mail`** sea visible:
   - Presiona **Ctrl+E** para activar el modo de edición
   - Haz **doble clic** en la celda del campo **`Mail`** del usuario que quieres editar
   - Escribe el nuevo email
   - Presiona **Enter** o **Tab**
   - Guarda con **Ctrl+S**

## Alternativa: Usar SQL Editor (Más Rápido)

Si prefieres no configurar las columnas, puedes usar directamente el SQL Editor:

1. Click derecho en la tabla `user`
2. Selecciona **SQL Editor** → **New SQL Script**
3. Ejecuta:
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

4. Presiona **Ctrl+Enter** para ejecutar

## Verificar Todas las Columnas Disponibles

Si quieres ver todas las columnas disponibles en la tabla:

1. Click derecho en la tabla `user`
2. Selecciona **View DDL** o **Show DDL** (si está disponible)
3. O ejecuta en SQL Editor:
```sql
DESCRIBE `user`;
```

Esto te mostrará todas las columnas incluyendo `Mail`.
