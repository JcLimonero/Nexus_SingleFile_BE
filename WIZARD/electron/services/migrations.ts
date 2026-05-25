/**
 * Schema migrations executed against a freshly-created tenant database.
 *
 * SCOPE NOTE: This is a CURATED SUBSET of the BE/app/Database/Migrations chain.
 * It includes only the tables that the wizard inserts into during the provision
 * step (user, company, agency, client_group + junctions, plus the catalog
 * tables that receive seed data). It is enough to get a tenant up and running
 * with the wizard, but the full ~40-table NexFile schema must be applied
 * separately — either by pointing `BE/.env` at the new DB and running
 * `php spark migrate`, or by mirroring the production schema via
 * `php spark db:clone-schema --target=<dbname>` from a reference DB.
 *
 * If you add a new migration to BE/ that the wizard needs, port it here too.
 */

export interface Migration {
  name: string;
  sql: string;
}

export const schemaMigrations: Migration[] = [
  {
    name: 'create_user_role',
    sql: `CREATE TABLE IF NOT EXISTS user_role (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      id_last_user_update BIGINT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_user_role_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_user',
    sql: `CREATE TABLE IF NOT EXISTS \`user\` (
      id BIGINT NOT NULL AUTO_INCREMENT,
      mail VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(200) NULL,
      id_user_role BIGINT NULL,
      default_agency BIGINT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_user_mail (mail)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_client_group',
    sql: `CREATE TABLE IF NOT EXISTS client_group (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      description TEXT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_client_group_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_company',
    sql: `CREATE TABLE IF NOT EXISTS company (
      id BIGINT NOT NULL AUTO_INCREMENT,
      id_client_group BIGINT NULL,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_company_client_group (id_client_group)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_agency',
    sql: `CREATE TABLE IF NOT EXISTS agency (
      id BIGINT NOT NULL AUTO_INCREMENT,
      id_company BIGINT NULL,
      name VARCHAR(200) NOT NULL,
      address VARCHAR(500) NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_agency_company (id_company)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_process',
    sql: `CREATE TABLE IF NOT EXISTS process (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      id_last_user_update BIGINT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_process_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_file_state',
    sql: `CREATE TABLE IF NOT EXISTS expedient_state (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      requires_payment_voucher TINYINT(1) NOT NULL DEFAULT 0,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      id_last_user_update BIGINT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_file_sub_state',
    sql: `CREATE TABLE IF NOT EXISTS expedient_sub_state (
      id BIGINT NOT NULL AUTO_INCREMENT,
      id_expedient_state BIGINT NULL,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_customer_type',
    sql: `CREATE TABLE IF NOT EXISTS customer_type (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_operation_type',
    sql: `CREATE TABLE IF NOT EXISTS operation_type (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_payment_method',
    sql: `CREATE TABLE IF NOT EXISTS payment_method (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_document_type',
    sql: `CREATE TABLE IF NOT EXISTS document_type (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      required TINYINT(1) NOT NULL DEFAULT 0,
      req_expiration TINYINT(1) NOT NULL DEFAULT 0,
      id_sale_type BIGINT NULL,
      id_sub_sale_type BIGINT NULL,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_file_reasons',
    sql: `CREATE TABLE IF NOT EXISTS expedient_reason (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      id_type_reason BIGINT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_document_file_error',
    sql: `CREATE TABLE IF NOT EXISTS document_error (
      id BIGINT NOT NULL AUTO_INCREMENT,
      description VARCHAR(500) NOT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_file_exception_reason',
    sql: `CREATE TABLE IF NOT EXISTS expedient_exception_reason (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      id_type_reason BIGINT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_client_group_process',
    sql: `CREATE TABLE IF NOT EXISTS client_group_process (
      id BIGINT NOT NULL AUTO_INCREMENT,
      id_client_group BIGINT NOT NULL,
      id_sale_type BIGINT NOT NULL,
      display_order INT DEFAULT 0,
      enabled TINYINT(1) DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_cgp (id_client_group, id_sale_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    name: 'create_client_group_phase',
    sql: `CREATE TABLE IF NOT EXISTS client_group_phase (
      id BIGINT NOT NULL AUTO_INCREMENT,
      id_client_group BIGINT NOT NULL,
      id_expedient_state BIGINT NOT NULL,
      display_order INT DEFAULT 0,
      enabled TINYINT(1) DEFAULT 1,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_cgph (id_client_group, id_expedient_state)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
];
