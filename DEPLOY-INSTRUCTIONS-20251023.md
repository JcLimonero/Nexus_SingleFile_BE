# 🚀 Instrucciones de Deploy - SingleFile
**Fecha:** 23 de Octubre de 2025  
**Hora:** 10:51 AM  
**Versión:** Producción con cambios de Validación

---

## 📦 Archivos Generados

### Frontend
- **Archivo:** `FE-deploy-production-20251023-1051.zip`
- **Tamaño:** 9.7 MB
- **Contenido:** Frontend compilado y optimizado para producción
- **Configuración:** API Base URL = `http://192.168.190.140:401`

### Backend
- **Archivo:** `BE-deploy-production-20251023-1051.zip`
- **Tamaño:** 14 MB
- **Contenido:** Backend PHP/CodeIgniter 4 con todos los archivos necesarios
- **Base de Datos:** MySQL/MariaDB

---

## 🆕 Cambios Incluidos en Esta Versión

### ✅ Mesa de Control - Validación
1. **Campo `IdDocumentContainer` agregado** al endpoint `/api/clients-validation/documentos`
2. **Botón "Ver" mejorado:**
   - Solo aparece si el documento tiene archivo asociado
   - Al hacer clic descarga/abre el archivo de Backblaze
   - Si el documento está en estatus 2, cambia automáticamente a estatus 3 (En revisión)
3. **Integración con Backblaze:**
   - Obtiene URLs temporales privadas (válidas por 1 hora)
   - Funcionalidad similar a Integración y Liquidación

### ✅ Autenticación con APIs de Vanguardia
4. **Header `X-Provider-Token` agregado** a todas las llamadas:
   - API de búsqueda de clientes (`singlefilecustomer`)
   - API de pedidos (`singlefileorderslastest`)
   - API de subida de archivos (`backblaze/upload`)
   - API de obtención de URLs privadas (`get-private-url`)
5. **Error 403 resuelto** en todas las integraciones con Vanguardia

---

## 🔧 Instrucciones de Instalación

### 1️⃣ Backend (API)

#### a) Subir archivos al servidor
```bash
# Descomprimir el archivo
unzip BE-deploy-production-20251023-1051.zip

# Navegar al directorio
cd BE/
```

#### b) Configurar variables de entorno
```bash
# Copiar el archivo de producción
cp env.production .env

# Editar las variables según tu servidor
nano .env
```

**Variables importantes a configurar:**
```env
# Base de datos
database.default.hostname = TU_HOST_MYSQL
database.default.database = singlefile_db
database.default.username = TU_USUARIO_DB
database.default.password = TU_PASSWORD_DB

# URL de la aplicación
app.baseURL = 'http://192.168.190.140:401/'

# Clave de encriptación (genera una nueva)
encryption.key = GENERA_UNA_CLAVE_SEGURA_AQUI
```

#### c) Instalar dependencias
```bash
# Solo en producción (sin vendor incluido)
composer install --no-dev --optimize-autoloader

# Si el vendor ya está en el ZIP, solo optimizar
composer dump-autoload --optimize
```

#### d) Configurar permisos
```bash
chmod -R 755 writable/
chmod 644 public/index.php
chmod 755 spark

# Crear directorios si no existen
mkdir -p writable/{cache,logs,session,uploads,debugbar}
```

#### e) Iniciar el servidor
```bash
# Opción 1: Servidor de desarrollo PHP
php spark serve --host=0.0.0.0 --port=401

# Opción 2: Usar el script
./start-port402.sh  # (modificar puerto a 401 si es necesario)

# Opción 3: Configurar Apache/Nginx (recomendado para producción)
```

---

### 2️⃣ Frontend (Angular)

#### a) Descomprimir archivos
```bash
unzip FE-deploy-production-20251023-1051.zip
cd FE/
```

#### b) Copiar al servidor web

**Opción A: Servidor web independiente**
```bash
# Copiar archivos compilados al directorio web
cp -r dist/vex/* /var/www/html/
```

**Opción B: Integrar con backend**
```bash
# Los archivos YA están en BE/public/ desde el ZIP del backend
# Si necesitas actualizarlos:
cp -r dist/vex/* ../BE/public/
```

---

## 🌐 Configuración del Servidor Web

### Apache (.htaccess incluido)
El archivo `.htaccess` ya está incluido en `dist/vex/`:

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
    listen 401;
    server_name 192.168.190.140;
    root /var/www/html;
    index index.html;

    # Frontend - Angular SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend - API
    location /api/ {
        proxy_pass http://localhost:401/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## ✅ Verificación del Deploy

### 1. Verificar Backend
```bash
# Verificar que responde
curl http://192.168.190.140:401/api/health

# Ver logs
tail -f BE/writable/logs/log-$(date +%Y-%m-%d).log
```

### 2. Verificar Frontend
```bash
# Verificar que carga
curl -I http://192.168.190.140:401/index.html

# Abrir en navegador
# URL: http://192.168.190.140:401
```

### 3. Probar Funcionalidades Nuevas
1. ✅ Login con usuario admin
2. ✅ Ir a Mesa de Control → Validación
3. ✅ Seleccionar un cliente con documentos
4. ✅ Verificar que el botón "Ver" solo aparece en documentos con archivo
5. ✅ Hacer clic en "Ver" y verificar que abre/descarga el documento
6. ✅ Verificar que documentos en estatus 2 cambian a estatus 3

---

## 📊 Resumen de Cambios Técnicos

### Backend (`BE/app/Controllers/Api/Validacion.php`)
```sql
-- Campo agregado al query de documentos
SELECT 
    ...
    dbf.IdDocumentContainer as documentContainer
FROM DocumentByFile dbf
...
```

### Frontend
**Archivos modificados:**
- `FE/src/app/pages/mesa-control/validacion/validacion.component.ts`
- `FE/src/app/pages/mesa-control/validacion/validacion.component.html`
- `FE/src/app/pages/mesa-control/validacion/validacion.service.ts`
- `FE/src/app/core/services/vanguardia-client.service.ts`
- `FE/src/app/pages/procesos/integracion/integracion.component.ts`
- `FE/src/app/pages/procesos/liquidacion/liquidacion.component.ts`

**Cambios principales:**
- Header `X-Provider-Token` en todas las llamadas a Vanguardia
- Método `onVerDocumento()` actualizado con cambio de estatus automático
- Visualización condicional del botón "Ver" según `documentContainer`

---

## 🔐 Configuración de Seguridad

### Token de Vanguardia
El token `X-Provider-Token` está hardcodeado:
```
b26e88c4-ddbe-4adb-a214-4667f454824a
```

⚠️ **Para producción:** Considera mover este token a variables de entorno.

### Conexión a Base de Datos
```
Host: 192.168.190.140:3306
Usuario: vgd_testing
Base de Datos: singlefile_db
```

---

## 📝 Checklist de Deploy

### Pre-Deploy
- [ ] Backup de la base de datos actual
- [ ] Backup de archivos `.env` actuales
- [ ] Verificar requisitos del servidor (PHP 8.1+, MySQL 5.7+)
- [ ] Verificar espacio en disco suficiente

### Deploy
- [ ] Descomprimir archivos ZIP
- [ ] Configurar archivo `.env` del backend
- [ ] Instalar/verificar dependencias de Composer
- [ ] Configurar permisos de directorios
- [ ] Copiar frontend al directorio web
- [ ] Configurar servidor web (Apache/Nginx)
- [ ] Reiniciar servicios

### Post-Deploy
- [ ] Verificar que la API responde
- [ ] Verificar que el frontend carga
- [ ] Probar login
- [ ] Probar funcionalidades de Validación
- [ ] Verificar integración con Vanguardia
- [ ] Revisar logs de errores
- [ ] Notificar al equipo

---

## 🛠️ Solución de Problemas

### El botón "Ver" no aparece
- Verificar que el documento tenga `IdDocumentContainer` en la BD
- Verificar que el endpoint `/api/clients-validation/documentos` retorna el campo `documentContainer`

### Error 403 en APIs de Vanguardia
- Verificar que el header `X-Provider-Token` se está enviando
- Verificar que el token es correcto
- Verificar logs del navegador (Consola F12)

### No se puede descargar/ver documentos
- Verificar que la API de Vanguardia está accesible: `https://apisvanguardia.com:400/backblaze/get-private-url`
- Verificar que el archivo existe en Backblaze
- Verificar logs del navegador

---

## 📞 Contacto y Soporte

**Desarrollador:** Juan Carlos Limón Nieto  
**Fecha:** 23 de Octubre de 2025  
**Versión:** Producción - v1.1

---

## 📂 Ubicación de los Archivos

```
/Users/jclimonero/Developer/SingleFile/
├── FE-deploy-production-20251023-1051.zip  (9.7 MB)
└── BE-deploy-production-20251023-1051.zip  (14 MB)
```

**Total:** 23.7 MB

