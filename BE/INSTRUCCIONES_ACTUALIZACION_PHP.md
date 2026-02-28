# Instrucciones para Actualizar PHP a 8.4.11 en Windows

## Método 1: Descarga Manual (Recomendado)

### Paso 1: Descargar PHP 8.4.11

1. Visita: https://windows.php.net/download/
2. Busca la versión **PHP 8.4.11** (Thread Safe o Non-Thread Safe)
3. Descarga el archivo ZIP (recomendado: **Thread Safe x64**)

### Paso 2: Instalar PHP

1. **Extrae el archivo ZIP** en una carpeta (ejemplo: `C:\php\`)
2. **Renombra** `php.ini-development` a `php.ini`
3. **Edita** `php.ini` y descomenta las extensiones necesarias:
   ```ini
   extension=mysqli
   extension=pdo_mysql
   extension=mbstring
   extension=curl
   extension=openssl
   extension=fileinfo
   extension=json
   ```

### Paso 3: Agregar PHP al PATH

1. Abre **Variables de entorno** del sistema
2. Edita la variable **Path**
3. Agrega la ruta de PHP (ejemplo: `C:\php\`)
4. Reinicia la terminal/PowerShell

### Paso 4: Verificar Instalación

```bash
php -v
```

Deberías ver: `PHP 8.4.11`

## Método 2: Usando Chocolatey (Si está instalado)

```powershell
choco install php --version=8.4.11
```

## Método 3: Usando XAMPP/WAMP

1. Descarga XAMPP con PHP 8.4 desde: https://www.apachefriends.org/
2. O actualiza tu instalación existente

## Verificación Post-Instalación

Ejecuta el script de verificación:

```bash
php BE/scripts/check_php_version.php
```

## Actualizar Composer (si es necesario)

Después de actualizar PHP, actualiza Composer:

```bash
composer self-update
```

## Notas Importantes

- **Backup**: Haz backup de tu `php.ini` actual antes de reemplazarlo
- **Extensiones**: Asegúrate de que todas las extensiones necesarias estén habilitadas
- **Servidor Web**: Si usas Apache/Nginx, reinícialo después de actualizar PHP
- **Composer**: Ejecuta `composer install` nuevamente después de actualizar PHP

## Solución de Problemas

### PHP no se encuentra en PATH
- Verifica que la ruta esté correctamente agregada
- Reinicia la terminal completamente
- Ejecuta: `refreshenv` (si usas Chocolatey)

### Extensiones faltantes
- Verifica que las DLLs estén en la carpeta `ext/`
- Descomenta las extensiones en `php.ini`
- Reinicia el servidor web

### Composer no funciona
- Ejecuta: `composer self-update`
- Verifica: `composer --version`
