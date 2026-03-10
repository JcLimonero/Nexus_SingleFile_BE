# API Endpoints – NexFile Backend

Base URL: `http://localhost:8080/api` (o el que uses en `php spark serve`).

## Autenticación (`/api/auth`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Login (email/usuario + password) |
| POST | `/auth/update-email` | Actualizar email (migración) |
| POST | `/auth/verify` | Verificar token |
| POST | `/auth/refresh` | Renovar access token |
| POST | `/auth/logout` | Cerrar sesión |

## Contraseñas (`/api/password`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/password/change` | Cambiar contraseña |
| POST | `/password/reset` | Reset contraseña |
| GET | `/password/migration-status` | Estado migración |
| POST | `/password/force-migration` | Forzar migración |

## Agencias (`/api/agency`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/agency` | Listar (query: enabled) |
| POST | `/agency` | Crear |
| GET | `/agency/search` | Buscar |
| GET | `/agency/regions` | Regiones |
| GET | `/agency/stats` | Estadísticas |
| GET | `/agency/(:num)` | Ver uno |
| PUT | `/agency/(:num)` | Actualizar |
| DELETE | `/agency/(:num)` | Eliminar |
| PATCH | `/agency/(:num)/toggle-status` | Activar/desactivar |

## Búsqueda de clientes (`/api/client-search`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/client-search/search` | Buscar |
| GET | `/client-search/by-agency/(:num)` | Por agencia |
| GET | `/client-search/(:num)` | Por ID |

## Procesos (`/api/process`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/process` | Listar |
| POST | `/process` | Crear |
| GET | `/process/search` | Buscar |
| GET | `/process/stats` | Estadísticas |
| GET | `/process/(:num)` | Ver uno |
| PUT | `/process/(:num)` | Actualizar |
| DELETE | `/process/(:num)` | Eliminar |
| PATCH | `/process/(:num)/estado` | Cambiar estado |

## Tipo de operación (`/api/operation-type`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/operation-type` | Listar |
| POST | `/operation-type` | Crear |
| GET | `/operation-type/search` | Buscar |
| GET | `/operation-type/stats` | Estadísticas |
| GET | `/operation-type/(:num)` | Ver uno |
| PUT | `/operation-type/(:num)` | Actualizar |
| DELETE | `/operation-type/(:num)` | Eliminar |
| PATCH | `/operation-type/(:num)/estado` | Activar/desactivar |

## Tipo de cliente (`/api/costumer-type`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/costumer-type` | Listar |
| POST | `/costumer-type` | Crear |
| GET | `/costumer-type/search` | Buscar |
| GET | `/costumer-type/stats` | Estadísticas |
| GET | `/costumer-type/active` | Activos |
| GET | `/costumer-type/(:num)` | Ver uno |
| PUT | `/costumer-type/(:num)` | Actualizar |
| DELETE | `/costumer-type/(:num)` | Eliminar |
| PATCH | `/costumer-type/(:num)/toggle-status` | Activar/desactivar |

## Tipo de documento (`/api/document-type`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/document-type` | Listar |
| POST | `/document-type` | Crear |
| GET | `/document-type/search` | Buscar |
| GET | `/document-type/stats` | Estadísticas |
| GET | `/document-type/active` | Activos |
| GET | `/document-type/(:num)/configurations` | Configuraciones |
| GET | `/document-type/(:num)/configurations-to-add` | Configuraciones a añadir |
| POST | `/document-type/(:num)/add-to-configurations` | Añadir a configuraciones |
| DELETE | `/document-type/(:num)/configuration/(:num)` | Quitar configuración |
| GET | `/document-type/(:num)` | Ver uno |
| PUT | `/document-type/(:num)` | Actualizar |
| DELETE | `/document-type/(:num)` | Eliminar |
| PATCH | `/document-type/(:num)/toggle-status` | Activar/desactivar |

## Documento requerido (`/api/documento-requerido`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/documento-requerido` | Listar |
| POST | `/documento-requerido` | Crear |
| GET | `/documento-requerido/stats` | Estadísticas |
| PUT | `/documento-requerido/reorder` | Reordenar |
| POST | `/documento-requerido/duplicate` | Duplicar |
| GET | `/documento-requerido/(:num)` | Ver uno |
| PUT | `/documento-requerido/(:num)` | Actualizar |
| DELETE | `/documento-requerido/(:num)` | Eliminar |

## Configuración de procesos (`/api/configuration-process`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/configuration-process/enabled` | Configuraciones habilitadas |
| GET | `/configuration-process/enabled-by-agency/(:num)` | Por agencia |

## Logs de actividad (`/api/user-activity-logs`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/user-activity-logs` | Listar |
| POST | `/user-activity-logs` | Crear |
| GET | `/user-activity-logs/user/(:any)` | Por usuario |
| GET | `/user-activity-logs/action/(:any)` | Por acción |
| GET | `/user-activity-logs/stats` | Estadísticas |
| DELETE | `/user-activity-logs/clean` | Limpiar antiguos |

## Analytics (`/api/analytics`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/analytics/dashboard` | Dashboard |
| GET | `/analytics/widget-document-statistics` | Estadísticas documentos |
| GET | `/analytics/widget-process-statistics` | Estadísticas procesos |
| GET | `/analytics/widget-agency-statistics` | Estadísticas agencias |
| GET | `/analytics/widget-agency-specific-metrics` | Métricas por agencia |
| GET | `/analytics/widget-file-trend-chart` | Tendencia archivos |
| GET | `/analytics/widget-file-distribution-metrics` | Distribución archivos |
| GET | `/analytics/widget-process-distribution` | Distribución procesos |
| GET | `/analytics/widget-status-distribution` | Distribución por estado |
| GET | `/analytics/widget-current-month-status` | Estado mes actual |
| GET | `/analytics/widget-previous-months` | Meses anteriores |
| GET | `/analytics/widget-historical-status` | Histórico por estado |
| GET | `/analytics/widget-system-overview-metrics` | Métricas sistema |
| GET | `/analytics/advisor-distribution` | Distribución asesores |
| GET | `/analytics/weekly-data` | Datos semanales |
| GET | `/analytics/attention-period` | Período atención |
| GET | `/analytics/current-month-attention` | Atención mes actual |
| GET | `/analytics/current-month-liberated` | Liberados mes actual |
| GET | `/analytics/total-liberated` | Total liberados |
| GET | `/analytics/orders-by-attention-period` | Pedidos por período |
| GET | `/analytics/export` | Exportar |
| GET | `/analytics/performance` | Rendimiento |
| GET | `/analytics/debug-*` | Varios endpoints de debug |

## Estados y motivos de archivo
| Grupo | Métodos típicos |
|-------|-----------------|
| `/api/file-status` | GET /, GET /active, GET /(:num) |
| `/api/file-sub-status` | GET /, GET /active, GET /(:num) |
| `/api/file-reason` | CRUD + search, stats, active, toggle-status |
| `/api/file-extraordinary-reason` | CRUD + search, stats, active, toggle-status |

## Documentos (`/api/document`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/document` | Listar |
| POST | `/document` | Crear |
| GET | `/document/search` | Buscar |
| GET | `/document/stats` | Estadísticas |
| GET | `/document/by-file/(:num)` | Por archivo |
| GET | `/document/(:num)` | Ver uno |
| PUT | `/document/(:num)` | Actualizar |
| DELETE | `/document/(:num)` | Eliminar |
| PATCH | `/document/(:num)/toggle-status` | Activar/desactivar |

## Usuarios (`/api/user`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/user` | Listar |
| POST | `/user` | Crear |
| GET | `/user/search` | Buscar |
| GET | `/user/stats` | Estadísticas |
| GET | `/user/check-username` | Comprobar usuario |
| GET | `/user/check-email` | Comprobar email |
| GET | `/user/(:num)` | Ver uno |
| PUT | `/user/(:num)` | Actualizar |
| DELETE | `/user/(:num)` | Eliminar |
| PATCH | `/user/(:num)/toggle-status` | Activar/desactivar |
| POST | `/user/(:num)/change-password` | Cambiar contraseña |
| POST | `/user/(:num)/reset-password` | Reset contraseña |
| GET | `/user/(:num)/access` | Accesos usuario |
| PUT | `/user/(:num)/access` | Actualizar accesos |
| DELETE | `/user/(:num)/access` | Limpiar accesos |
| GET | `/user/(:num)/agencies` | Agencias del usuario |
| POST | `/user/(:num)/agencies` | Asignar agencias |
| DELETE | `/user/(:num)/agencies` | Quitar todas agencias |
| DELETE | `/user/(:num)/agencies/(:num)` | Quitar una agencia |
| GET | `/user/(:num)/agencies/stats` | Stats agencias |
| GET | `/user/agencies-batch` | Agencias por lote |
| GET | `/user/(:num)/processes` | Procesos del usuario |
| POST | `/user/(:num)/processes` | Asignar procesos |
| DELETE | `/user/(:num)/processes` | Quitar todos procesos |
| DELETE | `/user/(:num)/processes/(:num)` | Quitar un proceso |
| GET | `/user/(:num)/processes/stats` | Stats procesos |

## Perfil de usuario (`/api/user/profile`, `/api/user/profile-image`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/user/profile` | Obtener perfil |
| PUT | `/user/profile/default-agency` | Agencia por defecto |
| POST | `/user/profile/upload-image` | Subir imagen |
| DELETE | `/user/profile/remove-image` | Quitar imagen |
| GET | `/user/profile/image/(:num)` | Imagen perfil |
| POST | `/user/profile-image/upload` | Subir imagen (nuevo) |
| GET | `/user/profile-image/get` | Obtener imagen |
| GET | `/user/profile-image/get/(:num)` | Imagen por ID |
| GET | `/user/profile-image/info` | Info imagen |
| GET | `/user/profile-image/info/(:num)` | Info por ID |
| DELETE | `/user/profile-image/remove` | Eliminar imagen |

## Roles (`/api/user-role`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/user-role` | Listar |
| POST | `/user-role` | Crear |
| GET | `/user-role/search` | Buscar |
| GET | `/user-role/stats` | Estadísticas |
| GET | `/user-role/active` | Activos |
| GET | `/user-role/(:num)` | Ver uno |
| PUT | `/user-role/(:num)` | Actualizar |
| DELETE | `/user-role/(:num)` | Eliminar |
| PATCH | `/user-role/(:num)/toggle-status` | Activar/desactivar |

## Clientes y archivos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/client/search` | Buscar cliente |
| GET | `/files/by-client` | Archivos por cliente |
| GET | `/files/by-agency-client` | Archivos por agencia/cliente |
| POST | `/files/create-from-NexFile-new` | Crear desde NexFile |
| POST | `/files/check-existing-orders` | Comprobar pedidos existentes |
| POST | `/files/repair-client-relation` | Reparar relación cliente |
| POST | `/files/delete` | Eliminar archivo |
| POST | `/files/compare-dms-orders` | Comparar pedidos DMS |

## Documentos (upload/requeridos) (`/api/documents`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/documents/required` | Documentos requeridos |
| GET | `/documents/missing-liberation` | Faltantes liberación |
| GET | `/documents/get-file-name` | Nombre de archivo |
| POST | `/documents/upload` | Subir documento |
| POST | `/documents/add-to-file` | Añadir a expediente |

## Validación de clientes – Mesa de control (`/api/clients-validation`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/clients-validation/clientes` | Clientes |
| GET | `/clients-validation/estadisticas` | Estadísticas |
| GET | `/clients-validation/documentos` | Documentos |
| GET | `/clients-validation/diagnostico` | Diagnóstico pedido |
| GET | `/clients-validation/expedientes-corregir` | Listar expedientes a corregir |
| GET | `/clients-validation/expedientes-corregir/auto-reparar` | Auto-reparar primeros 10 pendientes (para cron) |
| POST | `/clients-validation/reparar-relacion` | Reparar relación |
| POST | `/clients-validation/cancelar-pedido` | Cancelar pedido |
| POST | `/clients-validation/excepcion-pedido` | Excepción pedido |
| DELETE | `/clients-validation/eliminar-pedido` | Eliminar pedido |
| PUT | `/clients-validation/cambiar-estatus` | Cambiar estatus |
| POST | `/clients-validation/documentos/liquidacion` | Doc. liquidación |
| POST | `/clients-validation/validar-documento` | Validar documento |
| POST | `/clients-validation/aprobar-documento` | Aprobar documento |
| POST | `/clients-validation/preparar-documento` | Preparar documento |

## NexFile e importación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/NexFile-client-import/import` | Importar clientes NexFile |

## Backblaze / VGD
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/backblaze/upload` | Subir a Backblaze |
| GET | `/backblaze/get-private-url` | URL privada |
| GET | `/vgd/NexFileinvoices` | Facturas NexFile |

---

## Cómo validar que responden

Con el backend levantado (`php spark serve --port=8080`):

```bash
cd BE
php scripts/validate_api_endpoints.php http://localhost:8080
```

Con token JWT (para rutas que requieren auth):

```bash
php scripts/validate_api_endpoints.php http://localhost:8080 --token=TU_JWT_AQUI
```

El script comprueba que cada endpoint no devuelva 404 ni 5xx. 401/403 se cuentan como "requieren autenticación".
