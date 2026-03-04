# DWH API - Nexfile

APIs de consumo del DWH (vgd_dwh_prod). Expone los endpoints compatibles con el frontend NexFile.

## Endpoints

| Ruta | Vista DWH | Parámetros |
|------|-----------|------------|
| `GET /nexfile/customers` | view_single_file_client | connectionstring, ndDMS, id, perpage, page |
| `GET /nexfile/orders` | single_file_orders_latest | customer_dms (req), connection_string, id_agency, perpage |
| `GET /nexfile/invoices` | view_single_file_orders | idAgency, delivery_month, delivery_year, perpage |

## Configuración

- **Base de datos:** `app/Config/database-config.json` (mismas credenciales que BE, database: `vgd_dwh_prod`)
- **Puerto:** 8101 (por defecto)

## Ejecución

```bash
cd DWH
cp env .env
php spark serve --port=8101
```

## Pruebas

```bash
# Tests PHPUnit
./vendor/bin/phpunit tests/Feature/NexfileApiTest.php

# Tests curl (con servidor en ejecución: php spark serve --port=8101)
./scripts/test-apis.sh http://localhost:8082
```

## Esquema de vistas

El controlador detecta automáticamente las columnas vía INFORMATION_SCHEMA. Soporta variantes: nd_cliente/ndCliente, connection_string/connectionstring, id_agency/idAgency, etc.
