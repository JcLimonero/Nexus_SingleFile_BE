-- ============================================================================
-- SCRIPT SQL PARA ACTUALIZAR EMAIL DE USUARIOS MANUALMENTE
-- ============================================================================
-- Este script puede ejecutarse directamente en phpMyAdmin, MySQL Workbench,
-- DBeaver o cualquier cliente MySQL
-- ============================================================================

-- Ver usuarios actuales y sus emails
SELECT Id, Name, Mail FROM `user` ORDER BY Id;

-- ============================================================================
-- OPCIÓN 1: Actualizar email de un usuario específico
-- ============================================================================
-- Reemplaza [ID] con el ID del usuario y [NUEVO_EMAIL] con el nuevo email
-- UPDATE `user` SET `Mail` = '[NUEVO_EMAIL]', `UpdateDate` = NOW() WHERE `Id` = [ID];

-- Ejemplo: Actualizar email del usuario con ID 1
-- UPDATE `user` SET `Mail` = 'admin@nexusqtech.com', `UpdateDate` = NOW() WHERE `Id` = 1;

-- ============================================================================
-- OPCIÓN 2: Actualizar todos los emails que contengan un dominio específico
-- ============================================================================
-- Actualizar todos los emails de @sistema.com a @nexusqtech.com
-- UPDATE `user` 
-- SET `Mail` = REPLACE(`Mail`, '@sistema.com', '@nexusqtech.com'), 
--     `UpdateDate` = NOW() 
-- WHERE `Mail` LIKE '%@sistema.com';

-- ============================================================================
-- OPCIÓN 3: Actualizar email usando el nombre de usuario
-- ============================================================================
-- UPDATE `user` 
-- SET `Mail` = CONCAT(`user`, '@nexusqtech.com'), 
--     `UpdateDate` = NOW() 
-- WHERE `Id` = [ID];

-- ============================================================================
-- VERIFICAR CAMBIOS
-- ============================================================================
-- Después de ejecutar un UPDATE, verifica el cambio con:
-- SELECT Id, Name, Mail, UpdateDate FROM `user` WHERE `Id` = [ID];

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Si estás usando phpMyAdmin:
--    - Ve a la tabla 'user'
--    - Haz clic en "SQL" en la barra superior
--    - Pega el comando UPDATE y ejecuta
--    - O usa la pestaña "Editar" en el registro específico
--
-- 2. Si estás usando MySQL Workbench:
--    - Abre una nueva query tab
--    - Ejecuta el comando UPDATE
--    - Verifica que autocommit esté activado (icono de autocommit en la barra)
--
-- 3. Si estás usando DBeaver:
--    - Abre SQL Editor
--    - Ejecuta el comando UPDATE
--    - Confirma la transacción si es necesario
--
-- 4. Si recibes un error de "read-only" o "no se puede editar":
--    - Verifica que estés editando la tabla 'user' y no una vista
--    - Verifica los permisos de tu usuario de base de datos
--    - Intenta ejecutar el UPDATE directamente en la pestaña SQL
--    - Cierra y vuelve a abrir la conexión
