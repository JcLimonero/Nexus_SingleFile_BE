-- ============================================================================
-- MIGRACIÓN 055: Insertar Rol Demo
-- ============================================================================
-- Descripción: Inserta el rol Demo (id 15) para presentaciones a clientes.
--              Tiene permisos de administrador pero oculta IDs en tablas.
--              No está disponible para selección al crear/editar usuarios.
-- Prioridad: MEDIA
-- ============================================================================

INSERT INTO `user_role` (`id`, `name`, `enabled`, `registration_date`, `update_date`) VALUES
(15, 'Demo', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `enabled` = VALUES(`enabled`),
    `update_date` = NOW();

SELECT 'Migración 055 completada: Rol Demo insertado' AS status;
