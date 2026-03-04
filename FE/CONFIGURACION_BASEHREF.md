# 📝 Configuración de baseHref

## 🔧 Cómo Funciona

### Desarrollo Local
- El `index.html` en `src/` tiene `<base href="/">`
- Cuando ejecutas `ng serve`, la aplicación funciona en `http://localhost:3600/`
- No necesitas especificar `--base-href` en desarrollo

### Producción
- El `angular.json` tiene `"baseHref": "/NexFile/"` en la configuración de producción
- Cuando ejecutas `ng build --configuration production`, Angular **sobrescribe** el `baseHref` del `index.html` con el de la configuración
- El `index.html` generado en `dist/vex/` tendrá `<base href="/NexFile/">`
- La aplicación funcionará en `https://apisvanguardia.com:400/NexFile/`

## ✅ Comandos

### Desarrollo
```bash
cd FE
ng serve
# o
ng serve --port 3600
```
Accede a: `http://localhost:3600/`

### Producción
```bash
cd FE
ng build --configuration production
```
Los archivos en `dist/vex/` tendrán `baseHref="/NexFile/"` automáticamente.

## ⚠️ Importante

- **NO** cambies el `baseHref` en `src/index.html` a `/NexFile/` para desarrollo
- El `baseHref` en `angular.json` solo se aplica cuando construyes para producción
- Si necesitas probar con `/NexFile/` en desarrollo, usa la configuración `NexFile`:
  ```bash
  ng serve --configuration NexFile
  ```
  Esto usará `baseHref="/NexFile/"` pero sin optimizaciones (más rápido para desarrollo)
