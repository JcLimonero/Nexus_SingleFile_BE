-- ============================================================================
-- MIGRACIÓN 022: Insertar Sub-Estados de Archivo relacionados con Liberación
-- ============================================================================
-- Descripción: Inserta los sub-estados relacionados con el estado "Liberación"
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Obtener el ID del estado "Liberación"
SET @id_liberacion = (SELECT Id FROM file_status WHERE Name = 'Liberación' LIMIT 1);

-- Insertar sub-estados relacionados con Liberación
INSERT INTO `file_sub_status` 
(`Id`, `IdFileStatus`, `Name`, `RegistrationDate`, `UpdateDate`, `Enabled`) 
VALUES
(1, @id_liberacion, 'Placas', NOW(), NOW(), 1),
(2, @id_liberacion, 'Seguro', NOW(), NOW(), 1),
(3, @id_liberacion, 'Accesorio', NOW(), NOW(), 1),
(4, @id_liberacion, 'PDI', NOW(), NOW(), 1),
(5, @id_liberacion, 'Detallado', NOW(), NOW(), 1),
(6, @id_liberacion, 'Entrega Unidad', NOW(), NOW(), 1)
ON DUPLICATE KEY UPDATE
    `IdFileStatus` = @id_liberacion,
    `UpdateDate` = NOW();

-- Verificar inserción
SELECT 'Migración 022 completada: Sub-estados de Liberación insertados' AS status;

-- Mostrar sub-estados relacionados con Liberación
SELECT 
    fss.Id,
    fss.Name AS SubStatusName,
    fs.Name AS StatusName,
    fss.IdFileStatus,
    fss.Enabled
FROM file_sub_status fss
LEFT JOIN file_status fs ON fss.IdFileStatus = fs.Id
WHERE fss.IdFileStatus = @id_liberacion
ORDER BY fss.Id;
