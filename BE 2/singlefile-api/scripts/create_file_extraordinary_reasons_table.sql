-- Script para crear la tabla File_Extraordinary_Reasons
-- Ejecutar en la base de datos singlefile_db

USE singlefile_db;

-- 1. Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS File_Extraordinary_Reasons (
    Id BIGINT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(500) NOT NULL,
    IdTypeReason BIGINT,
    Enabled TINYINT(1) DEFAULT 1,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IdLastUserUpdate BIGINT DEFAULT 0,
    PRIMARY KEY (Id)
);

-- 2. Insertar datos de ejemplo con formato mixto
INSERT INTO File_Extraordinary_Reasons (Name, IdTypeReason, Enabled) VALUES
('Excepción por documentación incompleta', 6, 1),
('Excepción por plazo vencido', 6, 1),
('Cancelación por solicitud del usuario', 7, 1),
('Cancelación por documentación incorrecta', 7, 1),
('Excepción por fuerza mayor', 6, 1),
('Cancelación por duplicado', 7, 1),
('Excepción por error del sistema', 6, 1),
('Cancelación por falta de información', 7, 1);

-- 3. Crear índices para mejor rendimiento
CREATE INDEX idx_file_extraordinary_reasons_enabled ON File_Extraordinary_Reasons(Enabled);
CREATE INDEX idx_file_extraordinary_reasons_type ON File_Extraordinary_Reasons(IdTypeReason);
CREATE INDEX idx_file_extraordinary_reasons_registration ON File_Extraordinary_Reasons(RegistrationDate);
CREATE INDEX idx_file_extraordinary_reasons_update ON File_Extraordinary_Reasons(UpdateDate);

-- 4. Verificar los datos insertados
SELECT Id, Name, IdTypeReason, Enabled, RegistrationDate, UpdateDate FROM File_Extraordinary_Reasons ORDER BY Id;
