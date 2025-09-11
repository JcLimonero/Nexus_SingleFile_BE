-- Script para corregir el AUTO_INCREMENT en File_Extraordinary_Reasons
-- Ejecutar en la base de datos singlefile_db

USE singlefile_db;

-- 1. Eliminar la restricción de clave foránea temporalmente
ALTER TABLE File_Extraordinary_Reasons DROP FOREIGN KEY file_extraordinary_reasons_ibfk_1;

-- 2. Agregar AUTO_INCREMENT al campo Id
ALTER TABLE File_Extraordinary_Reasons MODIFY COLUMN Id INT NOT NULL AUTO_INCREMENT;

-- 3. Recrear la restricción de clave foránea
ALTER TABLE File_Extraordinary_Reasons 
ADD CONSTRAINT file_extraordinary_reasons_ibfk_1 
FOREIGN KEY (IdTypeReason) REFERENCES File_Extraordinary_Type(Id);

-- 4. Verificar la estructura final
DESCRIBE File_Extraordinary_Reasons;

-- 5. Verificar que no haya registros con ID = 0
SELECT Id, Name FROM File_Extraordinary_Reasons WHERE Id = 0;

-- 6. Mostrar el rango de IDs
SELECT MIN(Id), MAX(Id) FROM File_Extraordinary_Reasons;
