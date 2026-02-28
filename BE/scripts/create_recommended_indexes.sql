-- ============================================================================
-- SCRIPT DE CREACIÓN DE ÍNDICES RECOMENDADOS
-- Generado automáticamente: 2026-02-28 08:07:14
-- ============================================================================

-- Índices de alta prioridad
-- ============================================================================

-- Búsquedas por ClientHeader + Agency
CREATE INDEX `idx_client_dms_relation_idHeaderClient_IdAgency` ON `client_dms_relation` (`idHeaderClient`, `IdAgency`);

-- Búsquedas por IdDMS + agencia + fecha
CREATE INDEX `idx_order_IdDMS_idagency_RegistrationDate` ON `order` (`IdDMS`, `idagency`, `RegistrationDate` DESC);

-- Índices de prioridad media
-- ============================================================================

-- Analytics con filtros de fecha
CREATE INDEX `idx_expedient_RegistrationDate` ON `expedient` (`RegistrationDate` DESC);

-- Búsquedas por fecha de expiración
CREATE INDEX `idx_file_document_ExpirationDate` ON `file_document` (`ExpirationDate`);

-- Filtros por documentos activos
CREATE INDEX `idx_file_document_Enabled` ON `file_document` (`Enabled`);

