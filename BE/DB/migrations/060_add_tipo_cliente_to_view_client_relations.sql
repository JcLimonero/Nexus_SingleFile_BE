-- ============================================================================
-- MIGRACIÓN 060: Agregar tipo_cliente a vista view_client_relations
-- ============================================================================
-- Para que la búsqueda de clientes devuelva tipo_cliente (fisica/moral)
-- Fecha: 2026-03-03
-- ============================================================================

DROP VIEW IF EXISTS `view_client_relations`;

CREATE VIEW `view_client_relations` AS
SELECT
    hc.`id_client` AS idCliente,
    COALESCE(ctr.`id_dms`, '') AS ndCliente,
    TRIM(CONCAT(COALESCE(c.`name`, ''), ' ', COALESCE(c.`last_name`, ''), ' ', COALESCE(c.`mother_last_name`, ''))) AS cliente,
    hc.`id` AS IdClientHeader,
    c.`name` AS nombre,
    c.`last_name` AS apellidoPaterno,
    c.`mother_last_name` AS apellidoMaterno,
    c.`RFC` AS rfc,
    c.`email` AS email,
    c.`tel_number` AS telefono,
    c.`tel_number2` AS telefono2,
    c.`razon_social` AS razonSocial,
    c.`CURP` AS curp,
    c.`tipo_cliente` AS tipoCliente,
    c.`adviser` AS asesor,
    c.`agency_origin` AS agenciaOrigen,
    c.`registration_date` AS fechaRegistro,
    c.`update_date` AS fechaActualizacion,
    ctr.`id_agency` AS idAgency
FROM `client_header` hc
INNER JOIN `client_dms_relation` ctr ON hc.`id` = ctr.`id_client_header`
INNER JOIN `client` c ON c.`id` = hc.`id_client`;
