-- Script para actualizar la tabla user_activity_logs existente
-- Ejecutar este script en tu base de datos MySQL

-- 1. Agregar el campo change_details
ALTER TABLE `user_activity_logs` 
ADD COLUMN `change_details` TEXT DEFAULT NULL COMMENT 'Detalles específicos del cambio realizado' AFTER `description`;

-- 2. Actualizar registros existentes para que no queden NULL
UPDATE `user_activity_logs` 
SET `change_details` = 'Registro histórico - sin detalles disponibles' 
WHERE `change_details` IS NULL;

-- 3. Verificar la estructura actualizada
DESCRIBE `user_activity_logs`;

-- 4. Mostrar algunos registros con el nuevo campo
SELECT id, username, action, description, change_details, created_at 
FROM `user_activity_logs` 
LIMIT 5;

-- 5. Verificar que el campo se agregó correctamente
SELECT COUNT(*) as total_registros,
       COUNT(change_details) as registros_con_detalles
FROM `user_activity_logs`;
