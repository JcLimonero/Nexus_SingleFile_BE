-- Script para agregar el campo change_details a la tabla user_activity_logs
-- Ejecutar este script en tu base de datos MySQL

-- Agregar el campo change_details
ALTER TABLE `user_activity_logs` 
ADD COLUMN `change_details` TEXT DEFAULT NULL COMMENT 'Detalles específicos del cambio realizado' AFTER `description`;

-- Actualizar registros existentes para que no queden NULL
UPDATE `user_activity_logs` 
SET `change_details` = 'Registro histórico - sin detalles disponibles' 
WHERE `change_details` IS NULL;

-- Verificar la estructura actualizada
DESCRIBE `user_activity_logs`;

-- Mostrar algunos registros con el nuevo campo
SELECT id, username, action, description, change_details, created_at 
FROM `user_activity_logs` 
LIMIT 5;
