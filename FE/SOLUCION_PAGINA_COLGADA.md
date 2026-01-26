# 🔧 Solución: Página Colgada en https://apisvanguardia.com:400/singlefile/

## 🔍 Diagnóstico del Problema

La página se queda en la pantalla de carga porque:

1. **Base href incorrecto**: El `base href` está configurado como `/` pero la aplicación está desplegada en `/singlefile/`
2. **Rutas de assets incorrectas**: Los archivos JavaScript, CSS e imágenes no se cargan porque buscan en rutas incorrectas
3. **Error silencioso en bootstrap**: Si hay errores, no se muestran en la consola

## ✅ Solución Paso a Paso

### 1. Verificar Errores en la Consola del Navegador

1. Abre `https://apisvanguardia.com:400/singlefile/` en el navegador
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console** y revisa los errores
4. Ve a la pestaña **Network** y verifica qué archivos fallan al cargar (404, CORS, etc.)

### 2. Opción A: Reconstruir con baseHref Correcto (Recomendado)

```bash
cd FE
ng build --configuration production --base-href /singlefile/
```

Luego desplegar los archivos de `dist/vex/` en el servidor.

### 3. Opción B: Configurar el Servidor Web Correctamente

Si no puedes reconstruir, necesitas configurar el servidor web para que:

#### Para Apache (.htaccess):

Crea o actualiza el archivo `.htaccess` en el directorio `/singlefile/`:

```apache
RewriteEngine On
RewriteBase /singlefile/

# Si es un archivo o directorio existente, servirlo
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]

# Si no existe, redirigir a index.html
RewriteRule ^ /singlefile/index.html [L]
```

#### Para Nginx:

```nginx
location /singlefile/ {
    alias /ruta/a/dist/vex/;
    try_files $uri $uri/ /singlefile/index.html;
    
    # Headers para SPA
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 4. Verificar que los Assets se Cargan Correctamente

En la consola del navegador, verifica que estos archivos se cargan:
- `https://apisvanguardia.com:400/singlefile/main.[hash].js`
- `https://apisvanguardia.com:400/singlefile/polyfills.[hash].js`
- `https://apisvanguardia.com:400/singlefile/styles.[hash].css`
- `https://apisvanguardia.com:400/singlefile/assets/img/icons/logos/logo_loading_blue.svg`

### 5. Mejorar el Manejo de Errores (Opcional)

Si quieres ver errores en la consola, actualiza `FE/src/main.ts`:

```typescript
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  console.error('Error al inicializar la aplicación:', err);
  // Mostrar mensaje de error al usuario
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <h1>Error al cargar la aplicación</h1>
      <p>Por favor, revisa la consola del navegador para más detalles.</p>
      <p style="color: red;">${err.message || 'Error desconocido'}</p>
    </div>
  `;
});
```

## 🔍 Verificaciones Adicionales

### Verificar Configuración del Backend

Asegúrate de que el backend esté accesible en:
- `https://apisvanguardia.com:400/api/`

Y que los headers CORS permitan el origen:
- `https://apisvanguardia.com:400`

### Verificar Environment de Producción

El archivo `FE/src/environments/environment.prod.ts` debe tener:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://apisvanguardia.com:400',  // URL correcta del backend
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorderslastest',
    uploadApiUrl: 'https://apisvanguardia.com:400/api/backblaze/upload'
  }
};
```

## 📝 Checklist de Verificación

- [ ] Los archivos JS se cargan correctamente (ver Network tab)
- [ ] Los archivos CSS se cargan correctamente
- [ ] Las imágenes/assets se cargan correctamente
- [ ] No hay errores 404 en la consola
- [ ] No hay errores CORS en la consola
- [ ] El backend responde en `https://apisvanguardia.com:400/api/`
- [ ] El `baseHref` está configurado como `/singlefile/` en el build
- [ ] El servidor web está configurado para servir la SPA correctamente

## 🚨 Errores Comunes

### Error: "Failed to load resource: 404"
**Solución**: Los archivos no se encuentran. Verifica las rutas y el baseHref.

### Error: "CORS policy blocked"
**Solución**: Configura CORS en el backend para permitir `https://apisvanguardia.com:400`.

### Error: "Cannot GET /singlefile/"
**Solución**: El servidor web no está configurado para servir `index.html` en todas las rutas.

### La página se queda en blanco después del splash
**Solución**: Revisa la consola del navegador. Probablemente hay un error de JavaScript que impide la inicialización.
