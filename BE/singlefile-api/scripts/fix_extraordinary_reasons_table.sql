-- Script para corregir la estructura de la tabla File_Extraordinary_Reasons
-- Ejecutar en la base de datos singlefile_db

USE singlefile_db;

-- 1. Corregir el campo Id para que sea AUTO_INCREMENT
ALTER TABLE File_Extraordinary_Reasons MODIFY COLUMN Id INT NOT NULL AUTO_INCREMENT;

-- 2. Verificar que la tabla tenga la estructura correcta
DESCRIBE File_Extraordinary_Reasons;

-- 3. Verificar que los índices estén correctos
SHOW INDEX FROM File_Extraordinary_Reasons;
