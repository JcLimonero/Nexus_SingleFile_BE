# Look & feel – Cambios realizados y próximos pasos

Este documento describe lo que ya se hizo para dar identidad propia a la app (sin referencias visibles a Vex) y qué más puedes hacer si quieres un cambio más profundo.

---

## Cambios ya aplicados

### 1. **package.json**
- **name:** `nexfile` (antes `vex`)
- **version:** `1.0.0`
- **description:** "NexFile One - Gestión de expedientes y documentación"
- **author / license:** Nexus Q Tech, UNLICENSED

### 2. **index.html**
- Favicon por defecto local (se puede sobreescribir desde `branding.json`).
- **Splash de carga:** IDs y clases renombrados de `vex-splash-*` a `app-splash-*`; fondo `#0f172a`; loader con barra animada en color primario (`#0ea5e9`).
- **Root de la app:** `<app-root>` en lugar de `<vex-root>`.

### 3. **App root**
- `AppComponent` usa `selector: 'app-root'` (estándar en Angular).

### 4. **Splash screen**
- El servicio que oculta el splash busca `#app-splash-screen` (ya no `#vex-splash-screen`).

### 5. **Estilos globales (styles.scss)**
- Comentarios y overrides pensados para NexFile One.
- Variables CSS: color primario, sidenav oscuro, altura de toolbar, border-radius.
- Clases de layout duplicadas como `app-layout-*` (junto a las `vex-*`) para que puedas dar estilo propio sin tocar el core.

### 6. **Layout**
- Contenedores del layout tienen también clases `app-layout-sidenav-container`, `app-layout-content`, `app-layout-main` para poder estilizar con identidad propia.

---

## Cómo seguir cambiando el look (sin quitar Vex del código)

- **Colores:** Ajusta en `styles.scss` las variables `--vex-color-primary-*`, `--vex-sidenav-background`, etc. También puedes usar `branding.json` → `theme.primaryColor` y `menuColors`.
- **Tipografía:** En `styles.scss`, `html, body { font-family: ... }` ya usa una pila genérica; puedes poner tu propia fuente (ej. Google Fonts).
- **Splash:** En `index.html` puedes cambiar colores, tamaño del logo y animación del loader.
- **Favicon / logos:** Todo se controla desde `assets/config/branding.json` (favicon, logoLogin, logoApp, logoLoading).

Con esto la app deja de “parecer” la plantilla Vex en lo que ve el usuario (nombre, splash, colores, tipografía, favicon).

---

## Si quieres eliminar Vex por completo (refactor grande)

Eso implica sustituir el layout y los componentes que vienen de `@vex` por implementaciones propias o de Angular Material. Resumen de pasos:

1. **Layout**
   - Crear un layout propio (p. ej. `app/layouts/nexfile-layout/`) con:
     - `mat-sidenav-container`, `mat-sidenav`, `mat-toolbar`, contenido principal y footer.
   - Sustituir en rutas el uso del layout actual por este nuevo layout.
   - Dejar de usar `vex-base-layout`, `vex-toolbar`, `vex-sidenav`, `vex-footer`, etc.

2. **Componentes que usan @vex**
   - `VexPopoverRef` → sustituir por `MatMenu` o un panel propio.
   - `vex-progress-bar` → `ngx-loading-bar` o barra propia.
   - `vex-search` → componente de búsqueda propio.
   - `vex-page-layout` / `vex-secondary-toolbar` → secciones propias con `mat-toolbar` y contenido.
   - Gráficos: los que usan `vex-chart` se pueden pasar a ApexCharts directamente.

3. **Servicios y config**
   - Dejar de usar `provideVex()`, `VexConfigService`, `VexLayoutService`, `VexSplashScreenService`, etc.
   - Implementar un `SplashScreenService` propio que oculte `#app-splash-screen`.
   - Mantener solo lo que necesites de Material (form field options, etc.) en `app.config.ts`.

4. **Estilos**
   - Dejar de importar `./@vex/styles/core` en `styles.scss`.
   - Definir tu propio tema (variables CSS o Angular Material theme) y los estilos del layout.

5. **Branding**
   - En `branding.json` y `BrandingService`, el campo `layoutStyle` (apollo, zeus, etc.) solo tiene sentido con Vex; puedes eliminarlo o reemplazarlo por opciones propias (p. ej. “compact” / “wide”) cuando tengas un layout propio.

6. **Carpeta @vex**
   - Cuando nada importe ya desde `@vex`, puedes borrar la carpeta `src/@vex`.

Este camino es laborioso (varios días) pero deja la app sin dependencia de la plantilla Vex.

---

## Resumen

- **Hecho:** Identidad propia en nombre, splash, root, estilos globales y clases de layout; sin referencias visibles a “Vex” ni a terceros en favicon/títulos.
- **Opcional:** Seguir afinando look & feel con variables CSS y branding.
- **Opcional (refactor grande):** Sustituir layout y componentes de `@vex` por implementación propia o Material para eliminar Vex del código.
