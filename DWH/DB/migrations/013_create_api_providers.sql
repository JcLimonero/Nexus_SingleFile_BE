-- ============================================================================
-- MIGRACIÓN 013: Tabla api_providers - Control de proveedores que consumen APIs
-- ============================================================================
-- Almacena proveedores autorizados con su token para validar llamadas a nexfile/*
-- Header esperado: X-Provider-Token o Authorization: Bearer <token>
-- ============================================================================

USE dwh;

CREATE TABLE IF NOT EXISTS api_providers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_name VARCHAR(100) NOT NULL COMMENT 'Nombre del proveedor (ej: Nexus BE, Backend Producción)',
  provider_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código único del proveedor',
  token VARCHAR(255) NOT NULL COMMENT 'Token/API key para autenticación',
  enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_token (token(64)),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
