-- Quitar columna chassis y ajustar inventory para 10 dígitos
-- Ejecutar: php scripts/run-migration-005.php
USE dwh;

-- ALTER TABLE nexfile_orders DROP COLUMN chassis;
-- ALTER TABLE nexfile_orders MODIFY COLUMN inventory VARCHAR(15);
