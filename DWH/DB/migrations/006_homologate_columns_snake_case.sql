-- Homologar nombres de columnas a snake_case en las 3 tablas
-- Ejecutar: php scripts/run-migration-006.php
USE dwh;

-- nexfile_orders
-- ALTER TABLE nexfile_orders CHANGE COLUMN idAgency id_agency VARCHAR(10);
-- ALTER TABLE nexfile_orders CHANGE COLUMN consultantName consultant_name VARCHAR(100);
-- ALTER TABLE nexfile_orders CHANGE COLUMN ndConsultant nd_consultant VARCHAR(20);
-- ALTER TABLE nexfile_orders CHANGE COLUMN customerDMS customer_dms VARCHAR(20);
-- ALTER TABLE nexfile_orders CHANGE COLUMN connectionstring connection_string VARCHAR(100);

-- nexfile_customers
-- ALTER TABLE nexfile_customers CHANGE COLUMN idAgency id_agency INT;
-- ALTER TABLE nexfile_customers CHANGE COLUMN ndDMS nd_cliente VARCHAR(50);
-- ALTER TABLE nexfile_customers CHANGE COLUMN connectionstring connection_string VARCHAR(100);

-- nexfile_invoices
-- ALTER TABLE nexfile_invoices CHANGE COLUMN idAgency id_agency INT;
-- ALTER TABLE nexfile_invoices CHANGE COLUMN consultantName consultant_name VARCHAR(100);
-- ALTER TABLE nexfile_invoices CHANGE COLUMN ndConsultant nd_consultant VARCHAR(20);
-- ALTER TABLE nexfile_invoices CHANGE COLUMN customerDMS customer_dms VARCHAR(50);
