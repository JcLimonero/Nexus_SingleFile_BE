-- Script para actualizar la tabla File_Extraordinary_Reasons existente
-- Ejecutar en la base de datos singlefile_db

USE singlefile_db;

-- 1. Renombrar columnas existentes si es necesario
ALTER TABLE File_Extraordinary_Reasons CHANGE COLUMN Comment Name VARCHAR(500) NOT NULL;
ALTER TABLE File_Extraordinary_Reasons CHANGE COLUMN IdExtraordinaryType IdTypeReason BIGINT;

-- 2. Agregar columnas faltantes
ALTER TABLE File_Extraordinary_Reasons 
ADD COLUMN Enabled TINYINT(1) DEFAULT 1 AFTER IdTypeReason,
ADD COLUMN RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER Enabled,
ADD COLUMN UpdateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER RegistrationDate,
ADD COLUMN IdLastUserUpdate BIGINT DEFAULT 0 AFTER UpdateDate;

-- 3. Crear índices para mejor rendimiento (ignorar errores si ya existen)
CREATE INDEX idx_file_extraordinary_reasons_enabled ON File_Extraordinary_Reasons(Enabled);
CREATE INDEX idx_file_extraordinary_reasons_type ON File_Extraordinary_Reasons(IdTypeReason);
CREATE INDEX idx_file_extraordinary_reasons_registration ON File_Extraordinary_Reasons(RegistrationDate);
CREATE INDEX idx_file_extraordinary_reasons_update ON File_Extraordinary_Reasons(UpdateDate);

-- 4. Actualizar datos existentes con valores por defecto
UPDATE File_Extraordinary_Reasons SET 
    Enabled = 1,
    RegistrationDate = CURRENT_TIMESTAMP,
    UpdateDate = CURRENT_TIMESTAMP,
    IdLastUserUpdate = 0
WHERE Enabled IS NULL;

-- 5. Verificar la estructura final
DESCRIBE File_Extraordinary_Reasons;

-- 6. Verificar los datos
SELECT Id, Name, IdTypeReason, Enabled, RegistrationDate, UpdateDate FROM File_Extraordinary_Reasons ORDER BY Id;
