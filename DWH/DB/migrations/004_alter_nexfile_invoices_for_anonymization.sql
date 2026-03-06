-- Convertir columnas de nexfile_invoices a VARCHAR para datos anonimizados/inventados
USE dwh;

-- Modificar columnas que pueden ser INT en la vista pero necesitamos texto
ALTER TABLE nexfile_invoices
  MODIFY COLUMN vin VARCHAR(20) NULL,
  MODIFY COLUMN chassis VARCHAR(20) NULL,
  MODIFY COLUMN model VARCHAR(100) NULL,
  MODIFY COLUMN version VARCHAR(50) NULL,
  MODIFY COLUMN external_color VARCHAR(50) NULL,
  MODIFY COLUMN internal_color VARCHAR(50) NULL,
  MODIFY COLUMN consultantName VARCHAR(100) NULL,
  MODIFY COLUMN ndConsultant VARCHAR(20) NULL,
  MODIFY COLUMN customerDMS VARCHAR(50) NULL,
  MODIFY COLUMN connectionstring VARCHAR(100) NULL,
  MODIFY COLUMN amount DECIMAL(15,2) NULL;
