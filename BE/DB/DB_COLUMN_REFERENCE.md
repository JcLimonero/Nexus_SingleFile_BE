# Referencia de columnas - Base de datos NEXFILE (snake_case)

**Migración 038 aplicada - Todas las columnas en snake_case**

## Tablas principales del API

### user
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| name | varchar(600) |
| enabled | tinyint |
| id_user_rol | bigint |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| user | varchar(50) |
| pass | varchar(255) |
| mail | varchar(500) |
| id_user_total | bigint |
| default_agency | bigint |
| user_pass | varchar(255) |
| password_migrated | tinyint |
| profile_image | longtext |
| image_type | varchar(50) |
| image_size | int |

### agency
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| name | varchar(600) |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| enabled | tinyint |
| id_agency_dms | varchar(50) |
| id_company | bigint |

### process
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| name | varchar(600) |
| enabled | tinyint |
| registration_date | timestamp |
| id_last_user_update | bigint |
| update_date | timestamp |

### document_type
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| name | varchar(600) |
| registration_date | timestamp |
| update_date | timestamp |
| enabled | tinyint |
| id_last_user_update | bigint |
| req_expiration | tinyint |
| id_process_type | bigint |
| required | tinyint |
| id_sub_process | bigint |
| document_auto_upload | tinyint |
| available_to_client | tinyint |

### user_role
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| name | varchar(600) |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| enabled | tinyint |

### agency_user
| Columna | Tipo |
|---------|------|
| id_user | bigint |
| id_agency | bigint |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| enabled | tinyint |

### process_user
| Columna | Tipo |
|---------|------|
| id_user | bigint |
| id_process | bigint |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| enabled | tinyint |

### order (Migración 039)
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| number | varchar(50) |
| car_type | varchar(200) |
| year | int |
| vin | varchar(50) |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| enabled | tinyint(1) |
| model | varchar(200) |
| advisor | varchar(200) |
| id_dms | varchar(50) |
| id_agency | varchar(100) |
| amount | double |

### payment_method (Migración 042)
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| name | varchar(600) |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |
| enabled | tinyint |

### config (Migración 043)
| Columna | Tipo |
|---------|------|
| id | bigint PRI |
| config_key | varchar(255) |
| config_value | text |
| category | varchar(100) |
| description | varchar(500) |
| sensitive | tinyint |
| registration_date | timestamp |
| update_date | timestamp |
| id_last_user_update | bigint |

**Categorías:** `backblaze`, `orders_api`, `document_types`

**Claves:** backblaze_key_id, backblaze_application_key, backblaze_bucket_id, backblaze_bucket_name, backblaze_endpoint, orders_api_url, orders_api_key, orders_api_user, orders_api_password, id_document_type_liquidacion

---

**BE y FE deben usar estos nombres exactos (snake_case) en requests/responses.**
