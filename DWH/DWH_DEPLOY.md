# 🚀 Guía de Deploy - DWH API (Nexfile)

API de consumo del DWH que expone los endpoints compatibles con el frontend NexFile:
- `GET /nexfile/customers` → clientes
- `GET /nexfile/orders` → pedidos
- `GET /nexfile/invoices` → facturas

**Puerto por defecto:** 8101  
**Stack:** PHP 8.1+, CodeIgniter 4, MySQL/MariaDB

---

## 📦 Requisitos Previos

- PHP 8.1 o superior
- Composer
- Extensión MySQLi
- Acceso a la base de datos `vgd_dwh_prod` o `dwh` (según entorno)

---

## 🔧 Pasos de Deploy

### 1. Subir archivos al servidor

```bash
# Opción A: Copiar carpeta DWH completa
scp -r DWH/ usuario@74.208.78.55:/ruta/destino/

# Opción B: Crear ZIP y subir
cd /Users/jclimonero/Developer/SingleFile
zip -r DWH-deploy.zip DWH -x "DWH/vendor/*" "DWH/.env" "DWH/writable/logs/*" "DWH/writable/cache/*"
scp DWH-deploy.zip usuario@74.208.78.55:/ruta/destino/
```

### 2. En el servidor: descomprimir y entrar

```bash
cd /ruta/destino
unzip DWH-deploy.zip   # si usaste ZIP
cd DWH
```

### 3. Configurar base de datos

Editar `app/Config/database-config.json` con las credenciales del servidor:

```json
{
  "database": {
    "hostname": "74.208.78.55",
    "port": 3306,
    "database": "vgd_dwh_prod",
    "username": "TU_USUARIO",
    "password": "TU_PASSWORD",
    "driver": "MySQLi",
    "charset": "utf8mb4",
    "collation": "utf8mb4_unicode_520_ci",
    "debug": false,
    "strict": false
  }
}
```

- **Producción (datos reales):** `database: "vgd_dwh_prod"`
- **Desarrollo/testing (datos anonimizados):** `database: "dwh"` (requiere migraciones ejecutadas)

### 4. Configurar entorno

```bash
cp env .env
# Editar .env si necesitas CI_ENVIRONMENT = production
```

### 5. Instalar dependencias

```bash
composer install --no-dev --optimize-autoloader
```

### 6. Permisos

```bash
chmod -R 755 writable/
chmod 755 start-port8101.sh
chmod 644 public/index.php
mkdir -p writable/{cache,logs,session,uploads}
```

### 7. Iniciar el servidor

**Opción A - Script (recomendado para pruebas):**
```bash
./start-port8101.sh
```

**Opción B - Comando directo:**
```bash
php spark serve --host=0.0.0.0 --port=8101
```

**Opción C - Producción con systemd (ver sección abajo)**

---

## 🌐 Configuración Nginx (producción)

Para exponer el DWH detrás de Nginx en el puerto 8101:

```nginx
# Proxy al DWH API
location /nexfile/ {
    proxy_pass http://127.0.0.1:8101/nexfile/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 🔄 Servicio systemd (producción)

Crear `/etc/systemd/system/dwh-nexfile.service`:

```ini
[Unit]
Description=DWH Nexfile API
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/ruta/destino/DWH
ExecStart=/usr/bin/php spark serve --host=127.0.0.1 --port=8101
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable dwh-nexfile
sudo systemctl start dwh-nexfile
sudo systemctl status dwh-nexfile
```

---

## ✅ Verificación

```bash
# Health / raíz
curl http://localhost:8101/

# Customers
curl "http://localhost:8101/nexfile/customers?nd_cliente=10004&perpage=5"

# Orders
curl "http://localhost:8101/nexfile/orders?customer_dms=10004&perpage=5"

# Invoices
curl "http://localhost:8101/nexfile/invoices?id_agency=1&delivery_month=3&delivery_year=2025&perpage=5"
```

O usar el script de pruebas:
```bash
./scripts/test-apis.sh http://localhost:8101
```

---

## 📋 Checklist de Deploy

- [ ] Archivos DWH copiados al servidor
- [ ] `app/Config/database-config.json` configurado
- [ ] `.env` creado (desde `env`)
- [ ] `composer install --no-dev --optimize-autoloader` ejecutado
- [ ] Permisos en `writable/` correctos
- [ ] Servidor iniciado en puerto 8101
- [ ] Frontend apunta a `http://IP:8101/nexfile/...` (ver `FE/src/environments/environment.prod.ts`)

---

## 🔗 Integración con Frontend

El frontend usa las URLs del DWH en `FE/src/environments/environment.prod.ts`:

```typescript
vanguardia: {
  apiUrl: 'http://74.208.78.55:8101/nexfile/customers',
  ordersApiUrl: 'http://74.208.78.55:8101/nexfile/orders',
  invoicesApiUrl: 'http://74.208.78.55:8101/nexfile/invoices'
}
```

Asegúrate de que la IP/puerto coincidan con donde despliegas el DWH.

---

## 📂 Migraciones (solo si usas BD `dwh` local)

Si usas la base de datos `dwh` con datos anonimizados, ejecuta las migraciones en orden según `DB/README.md`:

```bash
php scripts/run-migration-001.php
php scripts/populate-nexfile-customers.php
php scripts/run-migration-007.php
# ... etc (ver DB/README.md)
```
