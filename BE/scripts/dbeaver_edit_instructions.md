# Instrucciones para Editar Email en DBeaver

## Método 1: Edición Directa de Datos (Recomendado)

### Paso 1: Abrir la Tabla
1. En DBeaver, navega a: **Database Navigator** → **nexfile** → **Tables** → **user**
2. Click derecho en la tabla **user**
3. Selecciona **View Data** o **Open Data**

### Paso 2: Activar Modo de Edición
1. En la ventana de datos que se abre, busca el botón **"Edit"** o **"Toggle Edit Mode"** (icono de lápiz) en la barra de herramientas
2. O presiona **Ctrl+E** (Windows/Linux) o **Cmd+E** (Mac)
3. Verifica que aparezca **"Edit mode"** en la barra de estado inferior

### Paso 3: Editar el Campo Mail
1. Localiza la fila del usuario que quieres editar
2. Haz **doble clic** en la celda del campo **Mail**
3. Escribe el nuevo email (ejemplo: `admin@nexusqtech.com`)
4. Presiona **Enter** o **Tab** para confirmar el cambio
5. Verás que la fila se marca con un **asterisco (*)** indicando cambios pendientes

### Paso 4: Guardar los Cambios
1. Haz clic en el botón **"Save"** (icono de disco 💾) en la barra de herramientas
2. O presiona **Ctrl+S**
3. DBeaver mostrará un diálogo de confirmación con el SQL que se ejecutará
4. Revisa el SQL y haz clic en **"Execute"** o **"OK"**
5. Verifica que el cambio se haya aplicado correctamente

## Método 2: SQL Editor (Alternativa si el Método 1 no funciona)

### Paso 1: Abrir SQL Editor
1. Click derecho en la tabla **user**
2. Selecciona **SQL Editor** → **New SQL Script**
3. O usa el atajo: **Alt+Shift+Q**

### Paso 2: Ejecutar UPDATE
1. Escribe el siguiente comando SQL (reemplaza los valores):
```sql
UPDATE `user` 
SET `Mail` = 'nuevo_email@nexusqtech.com', 
    `UpdateDate` = NOW() 
WHERE `Id` = [ID_DEL_USUARIO];
```

2. Ejemplo para el usuario con ID 1:
```sql
UPDATE `user` 
SET `Mail` = 'admin@nexusqtech.com', 
    `UpdateDate` = NOW() 
WHERE `Id` = 1;
```

3. Selecciona el comando SQL completo
4. Presiona **Ctrl+Enter** o haz clic en el botón **"Execute SQL"** (▶️)
5. Verifica el mensaje de éxito

### Paso 3: Verificar el Cambio
Ejecuta esta consulta para verificar:
```sql
SELECT Id, Name, Mail FROM `user` WHERE `Id` = [ID_DEL_USUARIO];
```

## Solución de Problemas

### Problema: No puedo activar el modo de edición
**Solución:**
- Verifica que estés viendo la tabla completa, no una vista
- Asegúrate de tener permisos de UPDATE en la tabla
- Intenta usar el Método 2 (SQL Editor) en su lugar

### Problema: Los cambios no se guardan
**Solución:**
1. Ve a: **Window** → **Preferences** → **Connections** → **Transactions**
2. Asegúrate de que **"Auto-commit"** esté marcado
3. Si está desmarcado, márcalo y reinicia DBeaver

### Problema: El campo Mail aparece en gris (solo lectura)
**Solución:**
- Verifica que el modo de edición esté activado (Ctrl+E)
- Asegúrate de que no haya una transacción pendiente
- Cierra y vuelve a abrir la conexión
- Usa el Método 2 (SQL Editor) como alternativa

### Problema: Error al guardar
**Solución:**
- Verifica que el email tenga un formato válido
- Asegúrate de que el campo no exceda 500 caracteres
- Revisa el mensaje de error específico en la consola de DBeaver
- Intenta usar el Método 2 (SQL Editor) para ver el error completo

## Configuración Recomendada para DBeaver

1. **Auto-commit activado:**
   - Window → Preferences → Connections → Transactions
   - Marca "Auto-commit"

2. **Confirmación de cambios:**
   - Window → Preferences → Database → Data Editor
   - Marca "Confirm data changes" (opcional, pero recomendado)

3. **Mostrar cambios pendientes:**
   - Los cambios pendientes se muestran con un asterisco (*) en la fila
   - Puedes ver todos los cambios pendientes antes de guardar

## Notas Importantes

- **Siempre verifica** el cambio después de guardar
- **Haz backup** antes de cambios masivos
- Si editas múltiples usuarios, considera usar SQL para mayor control
- El campo `UpdateDate` se actualiza automáticamente si usas SQL con `NOW()`

## Ejemplo Completo

Para cambiar el email del usuario con ID 1 de `admin@nexusqtech.com` a `administrador@nexusqtech.com`:

1. Abre la tabla `user` en modo de datos
2. Activa el modo de edición (Ctrl+E)
3. Doble clic en la celda Mail de la fila con Id=1
4. Cambia el email a `administrador@nexusqtech.com`
5. Presiona Enter
6. Guarda los cambios (Ctrl+S)
7. Confirma en el diálogo
8. Verifica con: `SELECT Mail FROM user WHERE Id = 1;`
