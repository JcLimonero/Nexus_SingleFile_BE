# Configuración del Servidor - SingleFile

Este documento explica cómo configurar la aplicación SingleFile directamente en el servidor modificando archivos JSON externos.

## Archivos de Configuración

### Backend - Configuración de Base de Datos

**Archivo:** `BE/singlefile-api/config/database-config.json`

Este archivo permite configurar la conexión a la base de datos y otros parámetros del backend.

```json
{
  "database": {
    "hostname": "localhost",
    "port": 3306,
    "database": "singlefile_db",
    "username": "root",
    "password": "",
    "driver": "MySQLi",
    "prefix": "",
    "charset": "utf8mb4",
    "collation": "utf8mb4_general_ci",
    "debug": true,
    "strict": false,
    "encrypt": false,
    "compress": false
  },
  "environment": {
    "name": "production",
    "baseURL": "http://localhost:402/",
    "forceHTTPS": false,
    "indexPage": "index.php",
    "uriProtocol": "REQUEST_URI"
  },
  "security": {
    "encryptionKey": "tu_clave_de_encriptacion_segura_aqui",
    "sessionDriver": "CodeIgniter\\Session\\Handlers\\FileHandler",
    "sessionPath": null
  },
  "logging": {
    "threshold": 4
  }
}
```

### Frontend - Configuración de APIs

**Archivo:** `FE/src/assets/config/api-config.json`

Este archivo permite configurar las URLs de las APIs y otros parámetros del frontend.

```json
{
  "api": {
    "baseUrl": "http://localhost:402",
    "timeout": 30000,
    "retryAttempts": 3,
    "retryDelay": 1000
  },
  "environment": {
    "production": true,
    "debug": false,
    "version": "1.0.0"
  },
  "features": {
    "enableLogging": true,
    "enableErrorReporting": true,
    "enablePerformanceMonitoring": false
  }
}
```

## Cómo Usar

### 1. Configurar Base de Datos (Backend)

1. Edita el archivo `BE/singlefile-api/config/database-config.json`
2. Modifica los valores en la sección `database`:
   - `hostname`: Servidor de la base de datos
   - `port`: Puerto de la base de datos (por defecto 3306 para MySQL)
   - `database`: Nombre de la base de datos
   - `username`: Usuario de la base de datos
   - `password`: Contraseña de la base de datos
3. Reinicia el servidor backend

### 2. Configurar URLs de API (Frontend)

1. Edita el archivo `FE/src/assets/config/api-config.json`
2. Modifica el valor de `api.baseUrl` con la URL del servidor backend
3. Reinicia la aplicación frontend

## Ejemplos de Configuración

### Desarrollo Local
```json
{
  "api": {
    "baseUrl": "http://localhost:402"
  }
}
```

### Servidor de Desarrollo
```json
{
  "api": {
    "baseUrl": "http://dev.singlefile.com"
  }
}
```

### Producción
```json
{
  "api": {
    "baseUrl": "https://api.singlefile.com"
  }
}
```

## Ventajas

1. **Sin Recompilación**: No necesitas recompilar la aplicación para cambiar la configuración
2. **Modificación Directa**: Puedes editar los archivos directamente en el servidor
3. **Fallback Seguro**: Si los archivos no existen o tienen errores, se usan valores por defecto
4. **Caché Inteligente**: La configuración se carga una vez y se mantiene en memoria
5. **Logging**: Los cambios se registran en los logs para auditoría

## Seguridad

- Los archivos de configuración contienen información sensible
- Asegúrate de que los permisos de archivo sean apropiados
- No subas estos archivos al control de versiones
- Usa claves de encriptación seguras en producción

## Solución de Problemas

### Backend no se conecta a la base de datos
1. Verifica que el archivo `database-config.json` existe
2. Revisa los logs del servidor para errores de configuración
3. Confirma que las credenciales de la base de datos son correctas

### Frontend no puede conectar con el backend
1. Verifica que el archivo `api-config.json` existe
2. Confirma que la URL en `api.baseUrl` es correcta
3. Revisa la consola del navegador para errores de red

### Configuración no se aplica
1. Reinicia el servidor después de hacer cambios
2. Limpia la caché del navegador
3. Verifica que el archivo JSON tiene sintaxis válida
