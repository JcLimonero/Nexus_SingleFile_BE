# Auto-reparación de expedientes (cron)

Repara automáticamente los primeros 10 expedientes pendientes en `expedientes_corregir` (donde `api_result IS NULL`).

## Opción 1: Comando CLI (recomendado para cron)

```bash
cd /ruta/al/proyecto/BE
php spark expedientes:auto-reparar
```

Con límite personalizado (ej. 20):
```bash
php spark expedientes:auto-reparar 20
```

### Ejemplo crontab (cada 5 minutos)

```cron
*/5 * * * * cd /ruta/al/proyecto/BE && php spark expedientes:auto-reparar >> /var/log/expedientes-auto-reparar.log 2>&1
```

## Opción 2: API (requiere sesión admin)

```bash
curl -X GET "https://tu-dominio/api/clients-validation/expedientes-corregir/auto-reparar" \
  -H "Authorization: Bearer TOKEN_ADMIN"
```
