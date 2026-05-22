# Nexus SingleFile

Plataforma B2B de gestión documental y procesamiento de pedidos para una red de agencias. Integra DMS Vanguardia para verificación de facturas y datos de cliente, y un sistema de liquidaciones externo.

## Stack

- **Backend**: PHP 8.1+ / CodeIgniter 4 — [BE/](BE/)
- **Frontend**: Angular 17 + Tailwind + Angular Material — [FE/](FE/)
- **Base de datos**: MySQL — esquemas en [DB/](DB/) y scripts en [BE/scripts/](BE/scripts/)

## Arranque rápido

```bash
# Backend (puerto 8080 por defecto, 402 en deploy)
cd BE
cp .env.example .env   # editar credenciales locales
composer install
php spark serve

# Frontend (puerto 3600)
cd FE
npm install
npm start
```

Setup detallado: [FE/DEVELOPMENT_SETUP.md](FE/DEVELOPMENT_SETUP.md) · [BE/CONFIGURACION_SERVIDOR.md](BE/CONFIGURACION_SERVIDOR.md) · [BE/INSTALACION_PHP.md](BE/INSTALACION_PHP.md)

## Estructura

```
BE/         API CodeIgniter 4 (37 controladores en app/Controllers/Api)
FE/         Angular 17 (pages: mesa-control, procesos, dashboards, configuracion)
DB/         Esquemas SQL
Documents/  Documentación externa (PDFs)
```

## Documentación

### Arquitectura y APIs (backend)
- [BE/API_ENDPOINTS.md](BE/API_ENDPOINTS.md) — índice general de endpoints
- [BE/AGENCY_API_README.md](BE/AGENCY_API_README.md) — API de agencias
- [BE/CLIENT_SEARCH_API_README.md](BE/CLIENT_SEARCH_API_README.md) — búsqueda de clientes
- [BE/API_DOCUMENTOS_README.md](BE/API_DOCUMENTOS_README.md) — gestión de documentos
- [BE/VANGUARDIA_API_DIRECT_USAGE.md](BE/VANGUARDIA_API_DIRECT_USAGE.md) — integración Vanguardia DMS
- [BE/PASSWORD_ENCRYPTION_README.md](BE/PASSWORD_ENCRYPTION_README.md) — esquema JWT + bcrypt
- [BE/README.md](BE/README.md) — README del módulo BE

### Frontend
- [FE/DEVELOPMENT_SETUP.md](FE/DEVELOPMENT_SETUP.md) — entorno local
- [FE/IMPLEMENTATION_GUIDE.md](FE/IMPLEMENTATION_GUIDE.md) — guía de implementación
- [FE/FRONTEND_VANGUARDIA_UPLOAD_IMPLEMENTATION.md](FE/FRONTEND_VANGUARDIA_UPLOAD_IMPLEMENTATION.md) — upload directo a Vanguardia
- [FE/CONFIGURACION_BASEHREF.md](FE/CONFIGURACION_BASEHREF.md) — baseHref por entorno
- [FE/USER_AGENCIES_OPTIMIZATION.md](FE/USER_AGENCIES_OPTIMIZATION.md) — optimización usuarios/agencias

### Deploy
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — guía general
- [DEPLOY-INSTRUCTIONS-20251023.md](DEPLOY-INSTRUCTIONS-20251023.md) — instrucciones actuales (oct 2025)
- [BE/README-PUERTO-402.md](BE/README-PUERTO-402.md) — backend en puerto 402
- [FE/README-FE-PORT401-DEPLOY.md](FE/README-FE-PORT401-DEPLOY.md) · [FE/README-FE-PORT402-DEPLOY.md](FE/README-FE-PORT402-DEPLOY.md) — deploy FE por puerto
- [FE/INSTRUCCIONES_DEPLOY_SINGLEFILE.md](FE/INSTRUCCIONES_DEPLOY_SINGLEFILE.md) — build single-file

### Rendimiento y optimización
- [ANALISIS_PERFORMANCE.md](ANALISIS_PERFORMANCE.md) — análisis general
- [OPTIMIZACIONES_RENDIMIENTO.md](OPTIMIZACIONES_RENDIMIENTO.md) — recomendaciones (nota: la cifra de 142 console.log ya está resuelta)
- [BE/OPTIMIZACIONES_APLICADAS.md](BE/OPTIMIZACIONES_APLICADAS.md) — cambios aplicados
- [BE/OPTIMIZACION_QUERIES_ANALYTICS.md](BE/OPTIMIZACION_QUERIES_ANALYTICS.md) — queries de analytics

### Migraciones e incidentes
- [BE/MIGRATION_STATUS.md](BE/MIGRATION_STATUS.md) — estado de migración de passwords
- [BE/MIGRACION_LOGIN_EMAIL.md](BE/MIGRACION_LOGIN_EMAIL.md) — migración login por email
- [BE/MESA_CONTROL_IDORDERTOTAL_UPDATE.md](BE/MESA_CONTROL_IDORDERTOTAL_UPDATE.md) — fix IdOrderTotal en Mesa Control
- [BE/SOLUCION_AUTENTICACION_MYSQL.md](BE/SOLUCION_AUTENTICACION_MYSQL.md) — fix auth MySQL
- [BE/FINAL_STATUS.md](BE/FINAL_STATUS.md) — status report (ago 2025)
- [FE/FIX_DASHBOARD_WIDGETS.md](FE/FIX_DASHBOARD_WIDGETS.md) · [FE/SOLUCION_PAGINA_COLGADA.md](FE/SOLUCION_PAGINA_COLGADA.md) — fixes FE
- [FE/REVISION_ARCHIVOS_UNUSED.md](FE/REVISION_ARCHIVOS_UNUSED.md) — auditoría de archivos sin uso

## Configuración

El backend lee variables de entorno desde `BE/.env` (no versionado). Usar [BE/.env.example](BE/.env.example) como plantilla. Variables críticas:

- `database.default.*` — conexión MySQL
- `VANGUARDIA_INVOICE_URL` / `VANGUARDIA_PROVIDER_TOKEN` — integración DMS
- `encryption.key` / `JWT_SECRET` — generar valores únicos por entorno

## Dominio

| Término | Significado |
|---|---|
| **File / Pedido** | Expediente de cliente con documentación asociada |
| **Mesa Control** | Dashboard operativo para validación de expedientes |
| **Documento Requerido** | Checklist por tipo de proceso |
| **Extraordinario** | Justificación de excepción documental |
| **Vanguardia** | DMS externo (facturas, datos de cliente) |
| **Liquidación** | Integración de pagos / cierre |
| **Agency / SubFix** | Agencia regional con código de zona |
