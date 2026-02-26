-- Agregar columna Amount a OrderByCar para costo del expediente (usado en vista AML)
-- Ejecutar manualmente si la columna no existe (ignorar error si ya existe)

ALTER TABLE `OrderByCar` ADD COLUMN `Amount` DECIMAL(15,2) DEFAULT NULL COMMENT 'Costo del expediente (AML)';
