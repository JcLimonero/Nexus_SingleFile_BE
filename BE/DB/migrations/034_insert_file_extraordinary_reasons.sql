-- ============================================================================
-- MIGRACIÓN 034: Insertar motivos extraordinarios en file_extraordinary_reasons
-- ============================================================================
-- Descripción: Inserta motivos extraordinarios en la tabla file_extraordinary_reasons
--              Todos los nombres están en formato Title Case
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Insertar motivos extraordinarios (usando INSERT IGNORE para evitar duplicados)
-- Nota: Los nombres están en Title Case (no en MAYÚSCULAS)
INSERT IGNORE INTO `file_extraordinary_reasons` 
(`Id`, `Name`, `IdTypeReason`, `Enabled`, `RegistrationDate`, `UpdateDate`, `IdLastUserUpdate`) 
VALUES
(1, 'Error Datos Cliente', NULL, 1, NOW(), NOW(), 1),
(2, 'Error en Fecha', NULL, 1, NOW(), NOW(), 1),
(3, 'Error en Domicilio', NULL, 1, NOW(), NOW(), 1),
(4, 'Error en Precio', NULL, 1, NOW(), NOW(), 1),
(5, 'Error en RFC', NULL, 1, NOW(), NOW(), 1),
(6, 'Error en Datos Vehiculo', NULL, 1, NOW(), NOW(), 1),
(7, 'Error en el Sistema', NULL, 1, NOW(), NOW(), 1),
(8, 'Error en Uso CFDI', NULL, 1, NOW(), NOW(), 1),
(9, 'Error por Adenda', NULL, 1, NOW(), NOW(), 1),
(10, 'Venta Caida', NULL, 1, NOW(), NOW(), 1),
(11, 'Credito No Autorizado', NULL, 1, NOW(), NOW(), 1),
(12, 'No Pago', NULL, 1, NOW(), NOW(), 1),
(13, 'Cambio de Opinión de Cliente', NULL, 1, NOW(), NOW(), 1),
(14, 'No Llego la Unidad', NULL, 1, NOW(), NOW(), 1),
(15, 'Autorizacion de Direccion', NULL, 1, NOW(), NOW(), 1),
(16, 'Venta de Socio', NULL, 1, NOW(), NOW(), 1),
(17, 'Cierre de Mes', NULL, 1, NOW(), NOW(), 1),
(18, 'Autorizacion Dir. Marca', NULL, 1, NOW(), NOW(), 1);

-- Verificar inserción
SELECT 'Migración 034 completada: Motivos extraordinarios insertados' AS status;
SELECT Id, Name, IdTypeReason, Enabled FROM `file_extraordinary_reasons` ORDER BY Id;
