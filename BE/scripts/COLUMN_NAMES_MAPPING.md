# Mapeo de Nombres de Columnas: PascalCase → snake_case

## Estándar Objetivo
Convertir todos los nombres de columnas de PascalCase a snake_case para ser consistente con los nombres de tablas.

## Mapeo de Columnas Comunes

### Columnas de Identificación
- `Id` → `id`
- `IdProcess` → `id_process`
- `IdAgency` → `id_agency`
- `IdClient` → `id_client`
- `IdCustomerType` → `id_customer_type`
- `IdOperationType` → `id_operation_type`
- `IdDocumentType` → `id_document_type`
- `IdFile` → `id_file`
- `IdCurrentState` → `id_current_state`
- `IdCurrentStatus` → `id_current_status`
- `IdDocumentError` → `id_document_error`
- `IdLastUserUpdate` → `id_last_user_update`
- `IdUserRol` → `id_user_rol`
- `IdUserTotal` → `id_user_total`
- `IdSeller` → `id_seller`
- `IdOrder` → `id_order`
- `IdOrderTotal` → `id_order_total`
- `IdInventory` → `id_inventory`
- `IdCompany` → `id_company`
- `IdAgencyDMS` → `id_agency_dms`
- `IdDMS` → `id_dms`
- `IdProcessType` → `id_process_type`
- `IdSubProcess` → `id_sub_process`
- `IdConfigurationProcess` → `id_configuration_process`
- `Idconfiguration_process` → `id_configuration_process`
- `IdValidation` → `id_validation`
- `idClientHeader` → `id_client_header`

### Columnas de Fechas
- `RegistrationDate` → `registration_date`
- `UpdateDate` → `update_date`
- `ExpirationDate` → `expiration_date`
- `ExperationDate` → `expiration_date` (error de ortografía)
- `CreatedDate` → `created_date`
- `AttentionDate` → `attention_date`
- `CloseDate` → `close_date`
- `AgendDate` → `agend_date`
- `AgendHour` → `agend_hour`

### Columnas de Estado y Configuración
- `Enabled` → `enabled`
- `Required` → `required`
- `ReqExpiration` → `req_expiration`
- `AvailableToClient` → `available_to_client`
- `DocumentAutoUpload` → `document_auto_upload`

### Columnas de Texto y Descripción
- `Name` → `name`
- `Description` → `description`
- `Comment` → `comment`
- `PathDocument` → `path_document`
- `ServerPath` → `server_path`
- `UserPass` → `user_pass`
- `Pass` → `pass`
- `Mail` → `mail`
- `User` → `user`
- `Username` → `username`

### Columnas de Relaciones y Referencias
- `DefaultAgency` → `default_agency`
- `CarType` → `car_type`
- `Year` → `year`
- `Model` → `model`
- `VIN` → `vin`
- `RefreshToken` → `refresh_token`
- `AgencyConnection` → `agency_connection`

### Columnas Específicas de Tablas

#### Tabla: `expedient` (File)
- `IdClient` → `id_client`
- `IdOrder` → `id_order`
- `IdCustomerType` → `id_customer_type`
- `IdOperation` → `id_operation`
- `IdProcess` → `id_process`
- `IdAgency` → `id_agency`
- `IdSeller` → `id_seller`
- `IdCurrentState` → `id_current_state`
- `IdOrderTotal` → `id_order_total`
- `IdInventory` → `id_inventory`
- `LastUserUpdate` → `last_user_update`
- `IdLastUserUpdate` → `id_last_user_update`

#### Tabla: `file_document` (DocumentByFile)
- `IdFile` → `id_file`
- `IdDocumentType` → `id_document_type`
- `IdCurrentStatus` → `id_current_status`
- `IdDocumentError` → `id_document_error`
- `IdValidation` → `id_validation`
- `PathDocument` → `path_document`
- `ServerPath` → `server_path`
- `LastUserUpdate` → `last_user_update`
- `IdLastUserUpdate` → `id_last_user_update`
- `ExperationDate` → `expiration_date`

#### Tabla: `configuration_process`
- `IdProcess` → `id_process`
- `IdAgency` → `id_agency`
- `IdCustomerType` → `id_customer_type`
- `IdOperationType` → `id_operation_type`

#### Tabla: `configuration_process_document_type`
- `IdDocumentType` → `id_document_type`
- `IdConfigurationProcess` → `id_configuration_process`
- `Idconfiguration_process` → `id_configuration_process` (inconsistencia)

#### Tabla: `document_type`
- `IdProcessType` → `id_process_type`
- `IdSubProcess` → `id_sub_process`
- `ReqExpiration` → `req_expiration`
- `AvailableToClient` → `available_to_client`
- `DocumentAutoUpload` → `document_auto_upload`

#### Tabla: `user`
- `IdUserRol` → `id_user_rol`
- `IdUserTotal` → `id_user_total`
- `DefaultAgency` → `default_agency`
- `UserPass` → `user_pass`

#### Tabla: `agency`
- `IdCompany` → `id_company`
- `IdAgencyDMS` → `id_agency_dms`

#### Tabla: `order_by_car`
- `IdDMS` → `id_dms`
- `CarType` → `car_type`

#### Tabla: `client_dms_relation`
- `IdAgency` → `id_agency`
- `IdDMS` → `id_dms`
- `idClientHeader` → `id_client_header`

#### Tabla: `client_header`
- `IdClient` → `id_client`

#### Tabla: `user_refresh_token`
- `IdUser` → `id_user`
- `RefreshToken` → `refresh_token`
- `ExpirationDate` → `expiration_date`
- `CreatedDate` → `created_date`

## Notas Importantes

1. **MySQL Case Sensitivity**: MySQL en Windows con `lower_case_table_names=1` es case-insensitive para nombres de columnas también, pero es mejor práctica usar nombres consistentes.

2. **Cambios en BD Requeridos**: Si la BD tiene las columnas en PascalCase, será necesario crear una migración para renombrarlas a snake_case.

3. **Compatibilidad**: Algunos nombres pueden tener variaciones (ej: `Idconfiguration_process` vs `IdConfigurationProcess`). Se debe usar la versión consistente.

4. **Errores de Ortografía**: Ya corregidos:
   - `ExperationDate` → `ExpirationDate` → `expiration_date`
   - `IdInventary` → `IdInventory` → `id_inventory`
   - `IdCostumerType` → `IdCustomerType` → `id_customer_type`
