# Instalación de PHP para el Backend

## Versiones soportadas
CodeIgniter 4.7 (versión actual del proyecto, ver `composer.lock`) requiere **PHP 8.1, 8.2, 8.3, 8.4 o 8.5**.
Recomendado para producción: **PHP 8.3 LTS** o **PHP 8.4**.

## Problema
PHP no está instalado o no está en el PATH del sistema.

## Soluciones

### Opción 1: Instalar PHP manualmente (Recomendado)

1. **Descargar PHP:**
   - Visita: https://windows.php.net/download/
   - Descarga la versión **Thread Safe** (TS) para Windows
   - Versión recomendada: PHP 8.1 o superior

2. **Extraer PHP:**
   - Extrae el archivo ZIP en `C:\php`
   - O en cualquier otra ubicación de tu preferencia

3. **Agregar PHP al PATH:**
   - Abre "Variables de entorno" en Windows
   - Edita la variable PATH del sistema
   - Agrega la ruta donde extrajiste PHP (ej: `C:\php`)
   - Reinicia PowerShell o la terminal

4. **Verificar instalación:**
   ```powershell
   php -v
   ```

### Opción 2: Usar Chocolatey

Si tienes Chocolatey instalado:
```powershell
choco install php
```

### Opción 3: Usar XAMPP

1. Descarga XAMPP desde: https://www.apachefriends.org/
2. Instala XAMPP (incluye PHP, MySQL, Apache)
3. Agrega `C:\xampp\php` al PATH del sistema

### Opción 4: Usar WAMP

1. Descarga WAMP desde: https://www.wampserver.com/
2. Instala WAMP (incluye PHP, MySQL, Apache)
3. Agrega la ruta de PHP de WAMP al PATH

## Verificar instalación

Ejecuta el script de verificación:
```powershell
cd BE
.\check-php.ps1
```

## Después de instalar PHP

Una vez que PHP esté instalado, puedes iniciar el backend:

```powershell
cd BE
php spark serve --host=0.0.0.0 --port=8080
```

O usar el script de inicio:
```powershell
cd BE
.\start-port402.sh  # Para puerto 402
```

## Requisitos adicionales

- **Extensiones PHP necesarias:**
  - `intl`
  - `mbstring`
  - `mysqli` (para MySQL)
  - `curl` (opcional, para peticiones HTTP)

- **Base de datos:**
  - MySQL/MariaDB configurada
  - Credenciales configuradas en el archivo `.env`

## Notas

- El frontend está configurado para conectarse al backend en el puerto **8080**
- Asegúrate de que el puerto esté disponible antes de iniciar el servidor
- Revisa el archivo `.env` para configurar la base de datos correctamente

