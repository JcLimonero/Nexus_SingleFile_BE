# 🚀 Deploy Frontend NexFile - Puerto 402

## 📋 Información del Deploy

**Archivo ZIP:** `FE-port402-deploy.zip`
**Configuración:** Frontend configurado para apuntar a `http://localhost:402/`
**Tamaño:** ~14.3 MB

## 📦 Contenido del ZIP

✅ **Frontend construido** (`dist/vex/` - archivos optimizados para producción)
✅ **Configuración del proyecto** (`package.json`, `angular.json`, `tsconfig.json`)
✅ **Configuración de Tailwind** (`tailwind.config.ts`)
✅ **Environment específico** (`src/environments/environment.port402.ts`)

## 🔧 Configuración Específica

**Environment configurado para puerto 402:**
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:402'
};
```

## 🚀 Instrucciones de Deploy

### Opción 1: Servidor Web Estático

1. **Descomprimir el ZIP**
   ```bash
   unzip FE-port402-deploy.zip
   ```

2. **Copiar archivos al servidor web**
   ```bash
   # Copiar todo el contenido de dist/vex/ al directorio web del servidor
   cp -r dist/vex/* /var/www/html/
   # o al directorio que corresponda en tu servidor
   ```

3. **Configurar servidor web**
   - Asegurar que el servidor web sirva archivos estáticos
   - Configurar rewrite rules para SPA (Single Page Application)
   - Verificar que el backend esté corriendo en `http://localhost:402/`

### Opción 2: Integración con Backend

1. **Descomprimir en el directorio del backend**
   ```bash
   unzip FE-port402-deploy.zip
   ```

2. **Copiar archivos al directorio público del backend**
   ```bash
   cp -r dist/vex/* /path/to/backend/public/
   ```

3. **Verificar configuración del backend**
   - Backend debe estar corriendo en puerto 402
   - API debe estar disponible en `http://localhost:402/api/`

## 🌐 Acceso a la Aplicación

- **Frontend:** `http://localhost:402/index.html`
- **API Backend:** `http://localhost:402/api/`

## ⚙️ Configuración del Servidor Web

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
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔍 Verificación del Deploy

1. **Verificar que el frontend carga correctamente**
   ```bash
   curl -I http://localhost:402/index.html
   ```

2. **Verificar que la API responde**
   ```bash
   curl -I http://localhost:402/api/health
   ```

3. **Verificar configuración del environment**
   - Abrir las herramientas de desarrollador del navegador
   - Verificar en la consola que las llamadas a la API van a `http://localhost:402/api/`

## 📝 Notas Importantes

- ✅ **Frontend optimizado** para producción
- ✅ **Configuración específica** para puerto 402
- ✅ **Archivos minificados** y comprimidos
- ✅ **Configuración de Tailwind** incluida
- ✅ **Rewrite rules** para SPA incluidas

## 🛠️ Troubleshooting

### Problema: Frontend no carga
- Verificar que el servidor web esté corriendo
- Verificar permisos de archivos
- Verificar configuración de rewrite rules

### Problema: API no responde
- Verificar que el backend esté corriendo en puerto 402
- Verificar configuración de CORS en el backend
- Verificar que la URL base sea `http://localhost:402`

### Problema: Errores de CORS
- Configurar CORS en el backend para permitir `http://localhost:402`
- Verificar headers de respuesta del backend
