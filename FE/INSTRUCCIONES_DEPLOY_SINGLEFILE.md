# 🚀 Instrucciones de Deploy para /NexFile/

## ⚠️ Problema Resuelto

Los errores 404 se debían a que el `baseHref` estaba configurado como `/` en lugar de `/NexFile/`.

## ✅ Solución Aplicada

1. ✅ `baseHref` actualizado en `src/index.html` a `/NexFile/`
2. ✅ `baseHref` agregado en `angular.json` para la configuración de producción
3. ✅ Script de build creado con la configuración correcta

## 📦 Pasos para Desplegar

### 1. Reconstruir la Aplicación

```bash
cd FE
ng build --configuration production
```

O usar el script:

```bash
cd FE
./build-production-NexFile.sh
```

### 2. Verificar los Archivos Generados

Los archivos se generarán en `FE/dist/vex/` con las rutas correctas:
- `index.html` (con `<base href="/NexFile/">`)
- `main.[hash].js`
- `polyfills.[hash].js`
- `runtime.[hash].js`
- `styles.[hash].css`
- `vendor.[hash].js` (si existe)
- `assets/` (con todas las imágenes y recursos)

### 3. Desplegar en el Servidor

Copiar todos los archivos de `FE/dist/vex/` a:
```
https://apisvanguardia.com:400/NexFile/
```

**Estructura esperada en el servidor:**
```
/NexFile/
  ├── index.html
  ├── main.[hash].js
  ├── polyfills.[hash].js
  ├── runtime.[hash].js
  ├── styles.[hash].css
  ├── vendor.[hash].js
  └── assets/
      └── img/
          └── icons/
              └── logos/
                  └── logo_loading_blue.svg
```

### 4. Configurar el Servidor Web

#### Para Apache (.htaccess)

Crear o actualizar `.htaccess` en `/NexFile/`:

```apache
RewriteEngine On
RewriteBase /NexFile/

# Si es un archivo o directorio existente, servirlo
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]

# Si no existe, redirigir a index.html (para rutas de Angular)
RewriteRule ^ /NexFile/index.html [L]
```

#### Para Nginx

```nginx
location /NexFile/ {
    alias /ruta/completa/a/dist/vex/;
    try_files $uri $uri/ /NexFile/index.html;
    
    # Headers para SPA
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
}
```

### 5. Verificar el Deploy

1. Abrir `https://apisvanguardia.com:400/NexFile/` en el navegador
2. Abrir la consola del navegador (F12)
3. Verificar que NO haya errores 404
4. Los archivos deben cargarse desde:
   - ✅ `https://apisvanguardia.com:400/NexFile/main.[hash].js`
   - ✅ `https://apisvanguardia.com:400/NexFile/polyfills.[hash].js`
   - ✅ `https://apisvanguardia.com:400/NexFile/styles.[hash].css`
   - ✅ `https://apisvanguardia.com:400/NexFile/assets/img/icons/logos/logo_loading_blue.svg`

## 🔍 Verificación Post-Deploy

### Checklist

- [ ] Todos los archivos JS se cargan correctamente (sin 404)
- [ ] El archivo CSS se carga correctamente
- [ ] Las imágenes/assets se cargan correctamente
- [ ] La aplicación se inicializa (el splash screen desaparece)
- [ ] No hay errores en la consola del navegador
- [ ] Las rutas de Angular funcionan (navegación interna)

### Errores Comunes

#### ❌ Error 404 en archivos JS/CSS
**Causa**: El `baseHref` no está configurado correctamente o los archivos no están en la ruta correcta.

**Solución**: 
1. Verificar que el `index.html` tenga `<base href="/NexFile/">`
2. Verificar que los archivos estén en `/NexFile/` en el servidor
3. Reconstruir la aplicación con `ng build --configuration production`

#### ❌ La página se queda en blanco después del splash
**Causa**: Error de JavaScript que impide la inicialización.

**Solución**: 
1. Revisar la consola del navegador (F12) para ver errores
2. Verificar que el backend esté accesible en `https://apisvanguardia.com:400/api/`
3. Verificar la configuración de CORS en el backend

#### ❌ Error CORS
**Causa**: El backend no permite el origen `https://apisvanguardia.com:400`.

**Solución**: Configurar CORS en el backend para permitir ese origen.

## 📝 Notas Adicionales

- El `baseHref` debe coincidir exactamente con la ruta donde está desplegada la aplicación
- Si cambias la ruta de despliegue, debes actualizar el `baseHref` y reconstruir
- Los archivos con hash (ej: `main.abc123.js`) cambian en cada build, por eso Angular los genera automáticamente
