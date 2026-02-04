# Revisión de archivos "unused" (TypeScript compilation)

Resumen de cada archivo que el compilador marca como *"part of the TypeScript compilation but it's unused"* y si realmente se usa o no.

---

## 1. Archivos de build (Tailwind / Node)

Usados por `tailwind.config.ts` en tiempo de build, no por el bundle de Angular. **Solución:** excluirlos del `tsconfig.app.json`.

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `@vex/config/color-variables.ts` | No importado por nadie | Solo se referencia a sí mismo. Candidato a excluir o eliminar si no se usa en temas. |
| `@vex/tailwind/plugins/icons.ts` | Sí | `tailwind.config.ts` → `addIconsPlugin` |
| `@vex/tailwind/plugins/themes.ts` | Sí | `tailwind.config.ts` → `addThemesPlugin` |
| `@vex/tailwind/utils/generate-scss.ts` | Sí | `themes.ts` |
| `@vex/tailwind/utils/naming.ts` | Sí | `generate-scss.ts` y `themes.ts` |

**Recomendación:** Excluir la carpeta `src/@vex/tailwind` del `tsconfig.app.json` (el build de Angular no compila `tailwind.config.ts`; lo ejecuta Node por separado). Si se excluye, los plugins y utils de Tailwind dejan de generar el warning.

---

## 2. Core: interfaces y servicios

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `core/interfaces/document.interface.ts` | Sí | `document.service.ts` |
| `core/services/config-loader.service.ts` | No | Solo comentario en `app.component.ts`. No inyectado. |
| `core/services/debug.service.ts` | No | Ningún import. |
| `core/services/document.service.ts` | No | Ningún import. Servicio sin uso. |
| `core/services/real-time-analytics.service.ts` | Sí | `dashboard-admin-analytics`, `widget-real-time-metrics` |
| `core/services/test-url.service.ts` | No | Ningún import. |
| `core/services/user-profile.service.ts` | Sí | `profile-image.component.ts` |

---

## 3. Layouts / toolbar

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `toolbar-search/toolbar-search.component.ts` | No | No está en el template del toolbar. El toolbar no importa `ToolbarSearchComponent`. |
| `toolbar-user/interfaces/menu-item.interface.ts` | No | `toolbar-user-dropdown` define su propia interfaz `MenuItem` inline. Interfaz duplicada. |

---

## 4. Configuración y páginas

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `configuracion/documentos-requeridos/duplicate-configuration-dialog/index.ts` | Opcional | Barrel export. `documentos-requeridos.component` importa directamente `DuplicateConfigurationDialogComponent`. El `index.ts` no es necesario. |
| `configuracion/roles/roles.component.ts` | No | No hay ruta `configuracion/roles` en `app.routes.ts`. Página sin entrada. |

---

## 5. Dashboards y widgets

Todos estos componentes **sí se usan entre sí** (dashboard-admin-analytics usa sus widgets en el template), pero **el dashboard admin no está en las rutas**.

| Archivo | ¿En rutas? | Nota |
|---------|------------|------|
| `dashboard-admin-analytics/dashboard-admin-analytics.component.ts` | No | No existe `path: 'dashboards/admin-analytics'` (o similar) en `app.routes.ts`. Solo está `/` (dashboard-analytics) y `/dashboards/global`. |
| `analytics-filters/analytics-filters.component.ts` | — | Usado en template de dashboard-admin-analytics. |
| `widget-document-metrics`, `widget-large-chart`, `widget-process-metrics`, `widget-quick-value-center`, `widget-quick-value-start`, `widget-real-time-metrics`, `widget-table` | — | Usados en template de dashboard-admin-analytics. |

**Conclusión:** Toda la pantalla "dashboard admin analytics" y sus widgets son código muerto a nivel de rutas. Para usarlos habría que añadir una ruta que cargue `DashboardAdminAnalyticsComponent`.

---

## 6. Mesa de control

En `app.routes.ts` solo existen:

- `mesa-control/validacion`
- `mesa-control/consolidacion-dms`

No hay rutas para dashboard, monitoreo ni reportes.

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `mesa-control/dashboard/dashboard.component.ts` | No | Sin ruta. |
| `mesa-control/monitoreo/monitoreo.component.ts` | No | Sin ruta. |
| `mesa-control/reportes/reportes.component.ts` | No | Sin ruta. |
| `mesa-control/validacion/ver-documento-dialog/ver-documento-dialog.component.ts` | No | `validacion.component` en `onVerDocumento()` no abre este dialog; abre la URL del documento. El dialog nunca se instancia. |

---

## 7. Procesos

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `procesos/gestion/gestion.component.ts` | No | No hay ruta `procesos/gestion` en `app.routes.ts`. |

---

## 8. Shared

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `shared/components/profile-image/profile-image.component.ts` | No | Ningún template usa `app-profile-image`. El componente usa `UserProfileService` pero nadie usa el componente. |

---

## 9. Environments y estáticos

| Archivo | ¿Se usa? | Dónde |
|---------|----------|--------|
| `environments/environment.example.ts` | No | Solo documentación / plantilla. |
| `environments/environment.prod.ts` | Sí | `angular.json` → `fileReplacements` en build production. Debe seguir en compilación. |
| `static-data/table-sales-data.ts` | No | Ningún import. |
| `test.ts` | No | Ningún import. |

---

## Resumen de acciones recomendadas

### A. Reducir warnings sin tocar lógica (tsconfig)

- **Excluir** del `tsconfig.app.json` la carpeta usada solo por Tailwind en Node, por ejemplo:
  - `src/@vex/tailwind/**`
  - y, si aplica, `src/@vex/config/color-variables.ts` (si no se usa en runtime).

Así desaparecen los warnings de los archivos de build (icons, themes, generate-scss, naming).

### B. Código realmente no usado (candidatos a borrar o integrar)

- Servicios sin referencias: `config-loader.service.ts`, `debug.service.ts`, `document.service.ts`, `test-url.service.ts`.
- Componentes sin ruta ni uso en templates: `toolbar-search`, `roles.component`, `mesa-control/dashboard`, `mesa-control/monitoreo`, `mesa-control/reportes`, `gestion.component`, `profile-image.component`.
- Dialog no abierto: `ver-documento-dialog` (validación no lo usa).
- Barrel opcional: `duplicate-configuration-dialog/index.ts`.
- Interfaz duplicada: `menu-item.interface.ts` (ya está en toolbar-user-dropdown).
- Datos/ejemplo: `table-sales-data.ts`, `test.ts`, `environment.example.ts` (este último se puede mantener como doc).

### C. Código “muerto” por falta de ruta

- Añadir ruta para **dashboard admin analytics** si se quiere usar (y opcionalmente para mesa-control dashboard/monitoreo/reportes y procesos/gestion), o eliminar esos módulos si ya no se usarán.

---

## Ejecutado (revisión aplicada)

### Archivos eliminados
- **Servicios:** `config-loader.service.ts`, `debug.service.ts`, `document.service.ts`, `test-url.service.ts`, `user-profile.service.ts`
- **Interfaz:** `document.interface.ts`
- **Componentes/carpetas:** `toolbar-search/` (3 archivos), `roles.component.ts`, `profile-image.component.ts`, `ver-documento-dialog/` (3 archivos)
- **Otros:** `menu-item.interface.ts`, `duplicate-configuration-dialog/index.ts`, `table-sales-data.ts`, `test.ts`

### Excluidos en tsconfig.app.json (sin compilar, código conservado por si se añaden rutas)
- `src/app/pages/dashboards/dashboard-admin-analytics/**`
- `src/app/pages/dashboards/components/analytics-filters/**`
- `src/app/pages/dashboards/components/widgets/widget-document-metrics/**`, `widget-large-chart/**`, `widget-process-metrics/**`, `widget-quick-value-center/**`, `widget-quick-value-start/**`, `widget-real-time-metrics/**`, `widget-table/**`
- `src/app/core/services/real-time-analytics.service.ts`
- `src/app/pages/mesa-control/dashboard/**`, `monitoreo/**`, `reportes/**`
- `src/app/pages/procesos/gestion/**`
- `src/environments/environment.example.ts`

**No se excluyó** `environment.prod.ts` (se usa en `fileReplacements` del build de producción).

---

*Documento generado a partir de la revisión de imports y `app.routes.ts`.*
