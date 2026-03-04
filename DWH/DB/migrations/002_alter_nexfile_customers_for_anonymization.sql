-- Convertir columnas de nexfile_customers a VARCHAR para datos anonimizados
USE dwh;

ALTER TABLE nexfile_customers
  MODIFY COLUMN bussines_name VARCHAR(200),
  MODIFY COLUMN name VARCHAR(100),
  MODIFY COLUMN paternal_surname VARCHAR(100),
  MODIFY COLUMN maternal_surname VARCHAR(100),
  MODIFY COLUMN rfc VARCHAR(20),
  MODIFY COLUMN curp VARCHAR(20),
  MODIFY COLUMN phone VARCHAR(20),
  MODIFY COLUMN mobile_phone VARCHAR(20),
  MODIFY COLUMN mail VARCHAR(150);

-- Agregar connectionstring (omitir si ya existe)
-- ALTER TABLE nexfile_customers ADD COLUMN connectionstring VARCHAR(100);

-- Agregar tipo_cliente: 'moral' o 'fisica' (omitir si ya existe)
-- ALTER TABLE nexfile_customers ADD COLUMN tipo_cliente VARCHAR(10);
