-- Script para insertar datos de prueba para la API de documentos
-- Ejecutar este script en tu base de datos MySQL

-- Verificar si ya existen datos de prueba
SET @clienteExists = (SELECT COUNT(*) FROM Client WHERE Name = 'Cliente Prueba API');
SET @procesoExists = (SELECT COUNT(*) FROM Process WHERE Name = 'Proceso Prueba API');
SET @agenciaExists = (SELECT COUNT(*) FROM Agency WHERE Name = 'Agencia Prueba API');

-- Insertar agencia de prueba si no existe
INSERT INTO Agency (Id, Name, RegistrationDate, UpdateDate, IdLastUserUpdate, Enabled, SubFix, IdAgency)
SELECT 999, 'Agencia Prueba API', NOW(), NOW(), 1, 1, 'TEST', 'TEST001'
WHERE @agenciaExists = 0;

-- Insertar proceso de prueba si no existe
INSERT INTO Process (Id, Name, Enabled, RegistrationDate, IdLastUserUpdate, UpdateDate)
SELECT 999, 'Proceso Prueba API', 1, NOW(), 1, NOW()
WHERE @procesoExists = 0;

-- Insertar cliente de prueba si no existe
INSERT INTO Client (Id, Name, LastName, MotherLastName, RFC, CURP, TelNumber, TelNumber2, RegistrationDate, UpdateDate, IdLastUserUpdate, Adviser, Email, RazonSocial, AgencyOrigin)
SELECT 999, 'Cliente Prueba API', 'Apellido', 'Materno', 'TEST123456789', 'TEST123456789', '5551234567', '5551234568', NOW(), NOW(), 1, 'Asesor Prueba', 'test@example.com', 'Razón Social Prueba API', 'TEST001'
WHERE @clienteExists = 0;

-- Insertar header del cliente
INSERT INTO HeaderClient (Id, IdClient)
SELECT 999, 999
WHERE NOT EXISTS (SELECT 1 FROM HeaderClient WHERE Id = 999);

-- Insertar pedido de prueba
INSERT INTO OrderByCar (Id, Number, CarType, Year, VIN, RegistrationDate, UpdateDate, IdLastUserUpdate, Modelo, Asesor, IdTotalDealer)
SELECT 999, 'PED-999-API', 'Sedán', 2024, 'VIN999API123456789', NOW(), NOW(), 1, 'Modelo Prueba', 'Asesor Prueba', 'DEALER999'
WHERE NOT EXISTS (SELECT 1 FROM OrderByCar WHERE Id = 999);

-- Insertar archivo de prueba
INSERT INTO File (Id, IdClient, IdOrder, IdCostumerType, IdOperation, IdProcess, RegistrationDate, UpdateDate, LastUserUpdate, IdAgency, IdSeller, IdLastUserUpdate, Description, IdCurrentState, IdOrderTotal, AttentionDate, CloseDate, AgendHour, AgendDate, IdInventary)
SELECT 999, 999, 999, 1, 1, 999, NOW(), NOW(), 1, 999, 1, 1, 'Archivo de prueba para API', 1, 'ORDER999', CURDATE(), CURDATE(), '09:00:00', CURDATE(), 'INV999'
WHERE NOT EXISTS (SELECT 1 FROM File WHERE Id = 999);

-- Insertar tipos de documento de prueba si no existen
INSERT INTO DocumentType (Id, Name, RegistrationDate, UpdateDate, Enabled, IdLastUserUpdate, ReqExpiration, IdProcessType, Required, IdSubProcess, DocumentAutoUpload)
SELECT 999, 'Documento Prueba API', NOW(), NOW(), 1, 1, 0, 999, 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM DocumentType WHERE Id = 999);

-- Insertar estatus de documento de prueba si no existen
INSERT INTO DocumentFile_Status (Id, Description)
SELECT 999, 'Estatus Prueba API'
WHERE NOT EXISTS (SELECT 1 FROM DocumentFile_Status WHERE Id = 999);

-- Insertar usuario de prueba si no existe
INSERT INTO User (Id, Name, Enabled, IdUserRol, RegistrationDate, UpdateDate, IdLastUserUpdate, User, Pass, Mail, IdUserTotal, DefaultAgency)
SELECT 999, 'Usuario Prueba API', 1, 1, NOW(), NOW(), 1, 'testuser', 'testpass', 'test@example.com', 999, 999
WHERE NOT EXISTS (SELECT 1 FROM User WHERE Id = 999);

-- Insertar documentos de prueba
INSERT INTO DocumentByFile (Id, Name, Comment, ExperationDate, PathDocument, Enabled, RegistrationDate, UpdateDate, LastUserUpdate, IdFile, IdValidation, IdDocumentType, IdCurrentStatus, IdDocumentError, ServerPath)
SELECT 999, 'Documento Prueba 1', 'Comentario de prueba para API', DATE_ADD(NOW(), INTERVAL 1 YEAR), '/test/path/documento1.pdf', 1, NOW(), NOW(), 1, 999, 'VAL999', 999, 999, NULL, '/server/test'
WHERE NOT EXISTS (SELECT 1 FROM DocumentByFile WHERE Id = 999);

INSERT INTO DocumentByFile (Id, Name, Comment, ExperationDate, PathDocument, Enabled, RegistrationDate, UpdateDate, LastUserUpdate, IdFile, IdValidation, IdDocumentType, IdCurrentStatus, IdDocumentError, ServerPath)
SELECT 998, 'Documento Prueba 2', 'Segundo documento de prueba', DATE_ADD(NOW(), INTERVAL 6 MONTH), '/test/path/documento2.pdf', 1, NOW(), NOW(), 1, 999, 'VAL998', 999, 999, NULL, '/server/test'
WHERE NOT EXISTS (SELECT 1 FROM DocumentByFile WHERE Id = 998);

-- Mostrar resumen de datos insertados
SELECT 
    'Datos de prueba insertados' as Mensaje,
    (SELECT COUNT(*) FROM Agency WHERE Id = 999) as Agencias,
    (SELECT COUNT(*) FROM Process WHERE Id = 999) as Procesos,
    (SELECT COUNT(*) FROM Client WHERE Id = 999) as Clientes,
    (SELECT COUNT(*) FROM File WHERE Id = 999) as Archivos,
    (SELECT COUNT(*) FROM DocumentByFile WHERE IdFile = 999) as Documentos;

-- Mostrar datos de prueba para verificar
SELECT 
    'Datos de prueba disponibles' as Seccion,
    f.Id as FileId,
    f.IdOrder as PedidoId,
    c.Name as Cliente,
    p.Name as Proceso,
    a.Name as Agencia,
    COUNT(dbf.Id) as TotalDocumentos
FROM File f
JOIN HeaderClient hc ON f.IdClient = hc.Id
JOIN Client c ON hc.IdClient = c.Id
JOIN Process p ON f.IdProcess = p.Id
JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN DocumentByFile dbf ON f.Id = dbf.IdFile
WHERE f.Id = 999
GROUP BY f.Id, f.IdOrder, c.Name, p.Name, a.Name;

