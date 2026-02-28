-- ============================================================================
-- MIGRACIÓN 028: Marcar Documentos como Disponibles para Cliente
-- ============================================================================
-- Descripción: Marca documentos específicos con AvailableToClient = 1
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Marcar documentos como disponibles para cliente
UPDATE `document_type` 
SET `AvailableToClient` = 1, `UpdateDate` = NOW() 
WHERE `Name` IN (
    'Identificacion Oficial',
    'CURP',
    'RFC',
    'Constancia de Situación Fiscal',
    'Comprobante de Domicilio',
    'Formato de Uso de CFDI',
    'Acta Constitutiva',
    'Poder de Representante Legal',
    'Identificacion Oficial Apoderado',
    'Beneficiario Controlador',
    'Carta Compromiso de Pago',
    'Factura Original Endosada',
    'Refrendos Consecutivos Ultimos 5 Años',
    'Constancia de Verificacion Vehicular'
);

-- Verificar documentos marcados
SELECT 'Migración 028 completada: Documentos marcados como disponibles para cliente' AS status;

SELECT Id, Name, AvailableToClient 
FROM `document_type` 
WHERE `AvailableToClient` = 1 
ORDER BY Name;
