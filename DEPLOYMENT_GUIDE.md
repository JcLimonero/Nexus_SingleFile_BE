# 🚀 Guía de Despliegue en Producción - NexFile

## 📦 Archivos de Despliegue Generados

### Backend (API)
- **Archivo:** `BE-deploy-production-20250925-1154.zip` (15.9 MB)
- **Contenido:** API completa con todas las dependencias optimizadas para producción

### Frontend (Angular)
- **Archivo:** `FE-deploy-production-20250925-1154.zip` (8.5 MB)
- **Contenido:** Frontend construido y optimizado para producción

## 🔧 Instrucciones de Despliegue

### 1. Backend (API)

#### Preparación del Servidor
```bash
# Descomprimir el archivo ZIP
unzip BE-deploy-production-20250925-1154.zip

# Entrar al directorio del backend
cd BE/
```

#### Configuración de Base de Datos
1. **Editar el archivo `.env`:**
   ```env
   CI_ENVIRONMENT = production
   
   # Configuración de la aplicación
   app.baseURL = 'https://tu-dominio.com/'
   
   # Configuración de base de datos
   database.default.hostname = localhost
   database.default.database = tu_base_de_datos
   database.default.username = tu_usuario_db
   database.default.password = tu_password_db
   database.default.DBDriver = MySQLi
   database.default.port = 3306
   
   # Clave de encriptación (generar una nueva y segura)
   encryption.key = tu_clave_de_encriptacion_segura_aqui
   
   # Configuración de seguridad
   app.forceGlobalSecureRequests = true
   
   # URL del frontend para el enlace del miniportal (compartir por WhatsApp)
   # IMPORTANTE: Sin esto, el enlace generado apuntará a localhost
   miniportal.frontendUrl = 'https://tu-dominio.com/'
   ```

#### Instalación y Configuración
```bash
# Instalar dependencias de producción
composer install --no-dev --optimize-autoloader

# Configurar permisos
chmod -R 755 writable/
chmod 644 public/index.php

# Crear directorios necesarios
mkdir -p writable/cache
mkdir -p writable/logs
mkdir -p writable/session
mkdir -p writable/uploads
```

#### Iniciar el Servidor
```bash
# Opción 1: Servidor de desarrollo (para pruebas)
php spark serve --host=0.0.0.0 --port=402

# Opción 2: Configurar servidor web (Apache/Nginx)
# Ver configuración específica más abajo
```

### 2. Frontend (Angular)

#### Descomprimir y Configurar
```bash
# Descomprimir el archivo ZIP
unzip FE-deploy-production-20250925-1154.zip

# El contenido del directorio dist/vex/ contiene los archivos optimizados
```

#### Opciones de Despliegue

**Opción A: Servidor Web Estático**
```bash
# Copiar archivos al directorio web del servidor
cp -r dist/vex/* /var/www/html/
# o al directorio correspondiente en tu servidor
```

**Opción B: Integración con Backend**
```bash
# Copiar archivos al directorio público del backend
cp -r dist/vex/* /path/to/backend/public/
```

## 🌐 Configuración del Servidor Web

### Apache (.htaccess incluido)
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:402/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔍 Verificación del Despliegue

### Backend
```bash
# Verificar que la API responde
curl -I http://localhost:402/api/health

# Verificar logs
tail -f writable/logs/log-$(date +%Y-%m-%d).log
```

### Frontend
```bash
# Verificar que el frontend carga
curl -I http://localhost:402/index.html

# Verificar en el navegador
# Abrir: http://tu-dominio.com/index.html
```

## 🔒 Configuración de Seguridad

### SSL/HTTPS
```nginx
server {
    listen 443 ssl http2;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Resto de la configuración...
}
```

### Variables de Entorno
- **NUNCA** subir el archivo `.env` al control de versiones
- Generar una clave de encriptación segura y única
- Usar contraseñas seguras para la base de datos
- Configurar CORS apropiadamente para el dominio de producción

## 📊 Monitoreo y Logs

### Logs del Backend
```bash
# Ver logs en tiempo real
tail -f writable/logs/log-$(date +%Y-%m-%d).log

# Ver logs de errores
grep "ERROR" writable/logs/log-$(date +%Y-%m-%d).log
```

### Logs del Servidor Web
```bash
# Apache
tail -f /var/log/apache2/error.log
tail -f /var/log/apache2/access.log

# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## 🛠️ Solución de Problemas

### Problemas Comunes

**1. Frontend no carga**
- Verificar que el servidor web esté corriendo
- Verificar permisos de archivos
- Verificar configuración de rewrite rules

**2. API no responde**
- Verificar que el backend esté corriendo
- Verificar configuración de base de datos
- Verificar logs del backend

**3. Miniportal redirige a localhost**
- Configurar `miniportal.frontendUrl` en el `.env` del servidor de producción con la URL real del frontend (ej: `https://tu-dominio.com/` o `http://74.208.78.55:8102/`)
- Sin esta variable, el enlace generado al compartir expediente apunta a `http://localhost:4200`

**4. Errores de CORS**
- Configurar CORS en el backend
- Verificar headers de respuesta

**5. Problemas de base de datos**
- Verificar credenciales en `.env`
- Verificar que MySQL esté corriendo
- Verificar permisos de usuario de base de datos

### Comandos de Diagnóstico
```bash
# Verificar estado de PHP
php -v

# Verificar extensiones de PHP
php -m | grep -E "(mysqli|curl|json|mbstring)"

# Verificar estado de MySQL
systemctl status mysql

# Verificar puertos
netstat -tlnp | grep -E "(80|443|402|3306)"
```

## 📝 Checklist de Despliegue

### Pre-Despliegue
- [ ] Backup de la base de datos actual
- [ ] Backup de archivos de configuración
- [ ] Verificar que el servidor cumple requisitos (PHP 8.1+, MySQL 5.7+)
- [ ] Configurar SSL/HTTPS
- [ ] Configurar firewall

### Despliegue
- [ ] Descomprimir archivos de despliegue
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias
- [ ] Configurar permisos
- [ ] Configurar servidor web
- [ ] Probar funcionalidad básica

### Post-Despliegue
- [ ] Verificar logs de errores
- [ ] Probar todas las funcionalidades principales
- [ ] Configurar monitoreo
- [ ] Documentar cambios
- [ ] Notificar al equipo

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. **Revisar logs:** Siempre el primer paso es revisar los logs
2. **Verificar configuración:** Asegurar que todas las variables estén configuradas correctamente
3. **Probar componentes:** Verificar que cada componente funcione independientemente
4. **Documentar errores:** Anotar mensajes de error exactos para facilitar la solución

---

**Fecha de Generación:** 25 de Septiembre de 2025  
**Versión:** Producción  
**Tamaño Total:** ~24.4 MB (Backend: 15.9 MB + Frontend: 8.5 MB)


