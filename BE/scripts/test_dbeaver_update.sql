-- ============================================================================
-- SCRIPT SQL PARA ACTUALIZAR EMAIL EN DBEAVER
-- ============================================================================
-- Este script puede ejecutarse directamente en DBeaver SQL Editor
-- para evitar el error "PRIMARY KEY missing in result set"
-- ============================================================================

-- Primero, ver los usuarios actuales
SELECT Id, Name, Mail FROM `user` ORDER BY Id;

-- ============================================================================
-- ACTUALIZAR EMAIL DE UN USUARIO ESPECÍFICO
-- ============================================================================
-- Reemplaza [ID] con el ID del usuario
-- Reemplaza [NUEVO_EMAIL] con el nuevo email

UPDATE `user` 
SET `Mail` = '[NUEVO_EMAIL]', 
    `UpdateDate` = NOW() 
WHERE `Id` = [ID];

-- Ejemplo: Actualizar email del usuario con ID 1
-- UPDATE `user` 
-- SET `Mail` = 'admin@nexusqtech.com', 
--     `UpdateDate` = NOW() 
-- WHERE `Id` = 1;

-- ============================================================================
-- VERIFICAR EL CAMBIO
-- ============================================================================
-- Después de ejecutar el UPDATE, verifica con:
-- SELECT Id, Name, Mail, UpdateDate FROM `user` WHERE `Id` = [ID];

-- ============================================================================
-- ACTUALIZAR MÚLTIPLES USUARIOS
-- ============================================================================
-- Si necesitas actualizar múltiples usuarios a la vez:

-- Actualizar todos los emails que contengan '@sistema.com'
-- UPDATE `user` 
-- SET `Mail` = REPLACE(`Mail`, '@sistema.com', '@nexusqtech.com'), 
--     `UpdateDate` = NOW() 
-- WHERE `Mail` LIKE '%@sistema.com';

-- ============================================================================
-- INSTRUCCIONES PARA DBEAVER
-- ============================================================================
-- 1. Abre DBeaver
-- 2. Conecta a la base de datos 'nexfile'
-- 3. Click derecho en la tabla 'user' → SQL Editor → New SQL Script
-- 4. Copia y pega el comando UPDATE que necesites
-- 5. Reemplaza [ID] y [NUEVO_EMAIL] con los valores reales
-- 6. Selecciona el comando SQL completo
-- 7. Presiona Ctrl+Enter o haz clic en Execute SQL (▶️)
-- 8. Verifica el mensaje de éxito
-- 9. Ejecuta el SELECT para verificar el cambio
