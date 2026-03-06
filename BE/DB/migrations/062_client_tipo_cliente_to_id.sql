-- ============================================================================
-- MIGRACIÓN 062: Cambiar client.tipo_cliente de texto a ID
-- ============================================================================
-- Antes: VARCHAR con 'fisica' | 'moral'
-- Después: BIGINT con 1 = Persona Física, 2 = Persona Moral (FK a customer_type)
-- Fecha: 2026-03-06
-- ============================================================================

-- 1. Migrar datos existentes: 'fisica' -> 1, 'moral' -> 2
UPDATE `client` SET `tipo_cliente` = CASE
    WHEN LOWER(TRIM(`tipo_cliente`)) = 'moral' THEN '2'
    WHEN LOWER(TRIM(`tipo_cliente`)) = 'fisica' THEN '1'
    ELSE NULL
END
WHERE `tipo_cliente` IS NOT NULL AND TRIM(`tipo_cliente`) != '';

-- 2. Cambiar tipo de columna a BIGINT
ALTER TABLE `client` MODIFY COLUMN `tipo_cliente` BIGINT NULL DEFAULT NULL;

-- 3. Agregar FK a customer_type (opcional, para integridad)
-- ALTER TABLE `client` ADD CONSTRAINT `fk_client_tipo_cliente` 
--   FOREIGN KEY (`tipo_cliente`) REFERENCES `customer_type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

SELECT 'Migración 062 completada: tipo_cliente ahora usa IDs (1=física, 2=moral)' AS status;
