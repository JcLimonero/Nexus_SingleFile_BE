-- Corregir AUTO_INCREMENT en file_share_token
-- Error: Duplicate entry '0' for key 'file_share_token.PRIMARY'
-- Causa: La columna id no tiene AUTO_INCREMENT

-- Ejecutar contra tu base de datos (ajusta el nombre si es distinto)
-- mysql -u usuario -p nombre_bd < fix_file_share_token_auto_increment.sql

-- 1. Agregar AUTO_INCREMENT a la columna id
ALTER TABLE `file_share_token` MODIFY COLUMN `id` BIGINT NOT NULL AUTO_INCREMENT;

-- 2. Si la tabla está vacía o tiene id=0, reiniciar el contador
-- (Opcional: solo si hay filas con id=0)
-- UPDATE file_share_token SET id = 1 WHERE id = 0;
-- ALTER TABLE file_share_token AUTO_INCREMENT = 1;

-- 3. Verificar
DESCRIBE file_share_token;
