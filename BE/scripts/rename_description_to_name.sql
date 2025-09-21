-- Script para renombrar columna Description a Name y actualizar valores
-- Ejecutar en la base de datos singlefile_db

USE singlefile_db;

-- 1. Renombrar la columna Description a Name
ALTER TABLE File_Reasons CHANGE COLUMN Description Name VARCHAR(500) NOT NULL;

-- 2. Actualizar los valores para que tengan formato mixto (primera letra mayúscula)
UPDATE File_Reasons SET Name = 'Aprobación 1' WHERE Id = 1;
UPDATE File_Reasons SET Name = 'Aprobación 2' WHERE Id = 2;
UPDATE File_Reasons SET Name = 'Documento vencido' WHERE Id = 3;
UPDATE File_Reasons SET Name = 'Documento no legible' WHERE Id = 4;
UPDATE File_Reasons SET Name = 'Aprobación 3' WHERE Id = 5;
UPDATE File_Reasons SET Name = 'Dcto. vencido y no legible' WHERE Id = 6;
UPDATE File_Reasons SET Name = 'Dcto. no corresponde al proceso' WHERE Id = 7;
UPDATE File_Reasons SET Name = 'Información no completa' WHERE Id = 8;
UPDATE File_Reasons SET Name = 'Documento incompleto' WHERE Id = 9;
UPDATE File_Reasons SET Name = 'Firma no coincide' WHERE Id = 10;

-- 3. Verificar los cambios
SELECT Id, Name, IdTypeReason, Enabled FROM File_Reasons ORDER BY Id;
