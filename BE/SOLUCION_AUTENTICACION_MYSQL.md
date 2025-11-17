# Solución: Error de Autenticación MySQL

## Error
```
Unable to connect to the database. Main connection [MySQLi]: 
The server requested authentication method unknown to the client [auth_gssapi_client]
```

## Causa
MySQL 8.0+ usa por defecto el método de autenticación `caching_sha2_password` o `auth_gssapi_client`, que no es compatible con versiones antiguas de PHP MySQLi. PHP requiere `mysql_native_password`.

## Soluciones

### Opción 1: Script SQL (Recomendado)

Ejecuta el siguiente comando SQL como administrador de MySQL:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '00@Limonero';
FLUSH PRIVILEGES;
```

**Nota:** Ajusta el usuario y contraseña según tu configuración.

### Opción 2: Script PHP Automático

Ejecuta el script PHP que crea la solución automáticamente:

```bash
cd BE
php scripts/fix_mysql_auth.php
```

**Importante:** Ajusta las credenciales en el script antes de ejecutarlo.

### Opción 3: Línea de Comandos MySQL

Si tienes acceso a la línea de comandos de MySQL:

```bash
mysql -u root -p
```

Luego ejecuta:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password';
FLUSH PRIVILEGES;
```

### Opción 4: Cambiar para Todos los Usuarios (Solo si es necesario)

Si necesitas cambiar el método de autenticación por defecto para todos los usuarios nuevos:

```sql
SET GLOBAL default_authentication_plugin = 'mysql_native_password';
```

## Verificación

Después de aplicar la solución, verifica que el cambio se aplicó correctamente:

```sql
SELECT user, host, plugin FROM mysql.user WHERE user = 'root';
```

Deberías ver `mysql_native_password` en la columna `plugin`.

## Reiniciar el Backend

Después de aplicar la solución, reinicia el servidor del backend:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar
cd BE
php spark serve --host=0.0.0.0 --port=8080
```

## Notas Adicionales

- Este cambio solo afecta al método de autenticación, no a los datos
- `mysql_native_password` es seguro y compatible con PHP
- Si usas un usuario diferente a 'root', ajusta los comandos según corresponda
- En producción, considera usar un usuario específico para la aplicación en lugar de 'root'

## Archivos de Ayuda

- `BE/scripts/fix_mysql_auth.sql` - Script SQL manual
- `BE/scripts/fix_mysql_auth.php` - Script PHP automático

