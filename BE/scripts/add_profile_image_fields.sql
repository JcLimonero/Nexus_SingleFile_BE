-- Script para agregar campos de imagen de perfil a la tabla Users
-- Ejecutar este script en la base de datos

-- Agregar campos para la imagen en la tabla de usuarios
ALTER TABLE Users ADD COLUMN profile_image LONGTEXT NULL;
ALTER TABLE Users ADD COLUMN image_type VARCHAR(50) NULL;
ALTER TABLE Users ADD COLUMN image_size INT NULL;

-- Agregar comentarios para documentar los campos
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Imagen de perfil del usuario en formato base64', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'Users', 
    @level2type = N'COLUMN', @level2name = N'profile_image';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Tipo MIME de la imagen (ej: image/jpeg, image/png)', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'Users', 
    @level2type = N'COLUMN', @level2name = N'image_type';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Tamaño de la imagen en bytes', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'Users', 
    @level2type = N'COLUMN', @level2name = N'image_size';

-- Crear índice para mejorar el rendimiento de consultas por imagen
CREATE INDEX IX_Users_ProfileImage ON Users(profile_image) WHERE profile_image IS NOT NULL;
