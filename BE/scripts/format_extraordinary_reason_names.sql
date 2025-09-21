-- Script para formatear nombres existentes en File_Extraordinary_Reasons
-- Convierte todos los nombres a formato de mayúsculas y minúsculas

USE singlefile_db;

-- Función para formatear nombres (equivalente a ucwords(strtolower()) en PHP)
DELIMITER $$
CREATE FUNCTION IF NOT EXISTS format_name(input_name VARCHAR(500)) 
RETURNS VARCHAR(500)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE result VARCHAR(500);
    DECLARE i INT DEFAULT 1;
    DECLARE word VARCHAR(100);
    DECLARE formatted_word VARCHAR(100);
    
    -- Convertir a minúsculas y trim
    SET result = LOWER(TRIM(input_name));
    
    -- Capitalizar primera letra de cada palabra
    WHILE i <= LENGTH(result) DO
        -- Si es la primera letra o después de un espacio
        IF i = 1 OR SUBSTRING(result, i-1, 1) = ' ' THEN
            -- Capitalizar la letra
            SET word = SUBSTRING(result, i, 1);
            SET formatted_word = UPPER(word);
            SET result = CONCAT(LEFT(result, i-1), formatted_word, SUBSTRING(result, i+1));
        END IF;
        SET i = i + 1;
    END WHILE;
    
    RETURN result;
END$$
DELIMITER ;

-- Mostrar nombres antes del cambio
SELECT 'ANTES DEL CAMBIO:' as estado;
SELECT Id, Name, format_name(Name) as Name_Formateado 
FROM File_Extraordinary_Reasons 
ORDER BY Id;

-- Actualizar todos los nombres
UPDATE File_Extraordinary_Reasons 
SET Name = format_name(Name);

-- Mostrar nombres después del cambio
SELECT 'DESPUÉS DEL CAMBIO:' as estado;
SELECT Id, Name 
FROM File_Extraordinary_Reasons 
ORDER BY Id;

-- Eliminar la función temporal
DROP FUNCTION IF EXISTS format_name;

-- Verificar el resultado final
SELECT 'RESULTADO FINAL:' as estado;
SELECT COUNT(*) as total_registros_actualizados 
FROM File_Extraordinary_Reasons;
