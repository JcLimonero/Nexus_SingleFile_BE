# Migraciones DWH

## 001 - Crear BD dwh y tabla nexfile_orders

Crea la base de datos `dwh` y la tabla `nexfile_orders` con 20 registros por agencia desde la vista `single_file_orders_latest`.

**Agencias:** 99999, 88888, 1356, 1, 10017, 2, 10082, 2003

### Ejecución

**Opción 1 - Script PHP** (recomendado si el cliente `mysql` da error de autenticación):

```bash
cd DWH
php scripts/run-migration-001.php
```

**Opción 2 - Cliente mysql**:

```bash
mysql -h 74.208.78.55 -u remote_nexus_q_techs -p vgd_dwh_prod < DB/migrations/001_create_dwh_and_nexfile_orders.sql
```

Si falla con "Unknown column 'id_agency'", usar la variante:
```bash
mysql ... < DB/migrations/001_create_dwh_and_nexfile_orders_idagency.sql
```

### Nota

Si la vista se llama `single_file_order_lasted` (en lugar de `single_file_orders_latest`), editar el SQL y reemplazar el nombre.

---

## 002 - Tabla nexfile_customers

Crea la tabla `nexfile_customers` con el mismo número de clientes que `nexfile_orders`. Los clientes se obtienen de `view_single_file_client` (agencias coincidentes).

### Ejecución

```bash
# 1. Poblar (requiere nexfile_orders poblada)
php scripts/populate-nexfile-customers.php

# 2. Alterar columnas a VARCHAR para anonimización
mysql ... dwh < DB/migrations/002_alter_nexfile_customers_for_anonymization.sql

# 3. Crear vista view_single_file_client en dwh (para que la API lea de nexfile_customers)
php scripts/run-migration-007.php

# 4. Anonimizar
php scripts/anonymize-nexfile-customers.php
```

Para que `GET /nexfile/customers` use datos locales, cambiar `database` en `app/Config/database-config.json` a `dwh`.

---

## 003 - Tabla nexfile_invoices

Crea la tabla `nexfile_invoices` y la vista `view_single_file_orders` en `dwh`. La vista permite que la API lea de datos anonimizados cuando la BD configurada es `dwh`.

**Distribución:** 60% de registros coinciden con `nexfile_orders` (idAgency + order_dms), 40% no coinciden.

### Ejecución

```bash
# 1. Migración (crear tabla y vista)
php scripts/run-migration-003.php

# 2. Alterar columnas para anonimización (VARCHAR en vin, model, etc.)
php scripts/run-migration-004.php

# 3. Poblar: 60% desde nexfile_orders, 40% inventados
php scripts/populate-nexfile-invoices.php

# 4. Anonimizar
php scripts/anonymize-nexfile-invoices.php
```

Para usar datos anonimizados en la API, cambiar `database` en `app/Config/database-config.json` a `dwh`.

---

## 009 - tipo_cliente y snake_case en nexfile_customers

Agrega columna `tipo_cliente` ('fisica' | 'moral') y renombra columnas camelCase a snake_case.

```bash
php scripts/run-migration-009.php
```

---

## 008 - Crear vistas Nexfile en dwh

Crea las 3 vistas que la API Nexfile necesita cuando la BD es `dwh`:
- `view_single_file_client` → nexfile_customers
- `single_file_orders_latest` → nexfile_orders
- `view_single_file_orders` → nexfile_invoices

### Ejecución

```bash
php scripts/run-migration-008.php
```

Requiere que nexfile_customers, nexfile_orders y nexfile_invoices estén pobladas.

---

## 005 - Alterar nexfile_orders (quitar chassis, ajustar inventory)

```bash
php scripts/run-migration-005.php
```

- Elimina columna `chassis`
- Ajusta `inventory` a VARCHAR(15) para números de 10 dígitos
