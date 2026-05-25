/**
 * Schema migrations executed against a fresh target database.
 *
 * IMPORTANT: this is a TS mirror of the CI4 migrations under BE/app/Database/Migrations.
 * When BE adds a migration, port it here too. Tests in WIZARD verify both sides stay aligned.
 *
 * Statements run in order, each as a single query. Idempotent constructs are preferred
 * (CREATE TABLE IF NOT EXISTS, etc.) so re-runs are safe.
 */

export interface Migration {
  name: string;
  sql: string;
}

export const schemaMigrations: Migration[] = [
  // Phase A1 — client_group
  {
    name: 'create_client_group',
    sql: `CREATE TABLE IF NOT EXISTS client_group (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      id_last_user_update BIGINT UNSIGNED NULL,
      UNIQUE KEY uq_client_group_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  },

  // NOTE: the full schema migrations (tables process, customer_type, file_state, etc.)
  // are added here in subsequent commits as we implement WIZARD step 3.
  // For now this file only contains the new additions specific to the
  // procesos-configurables feature, so the wizard runs against an already-cloned schema.
  // TODO: port the full BE/app/Database/Migrations set, or alternatively bundle the
  // SQL dump from BE/scripts/export-schema.sql and exec it as a single batch.
];
