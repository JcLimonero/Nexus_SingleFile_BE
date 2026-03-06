-- Script para solucionar el error de autenticación MySQL
-- Error: "The server requested authentication method unknown to the client [auth_gssapi_client]"
-- 
-- Este script cambia el método de autenticación del usuario a mysql_native_password
-- que es compatible con PHP MySQLi

-- IMPORTANTE: Este script debe ejecutarse en el servidor MySQL (192.168.190.140)
-- como usuario administrador con permisos para modificar usuarios

-- Cambiar método de autenticación para el usuario vgd_testing
-- Nota: El host puede ser '%' (cualquier host) o una IP específica
ALTER USER 'vgd_testing'@'%' IDENTIFIED WITH mysql_native_password BY '00@DealerSolutions';
FLUSH PRIVILEGES;

-- Si el usuario está restringido a una IP específica, usa:
-- ALTER USER 'vgd_testing'@'192.168.190.140' IDENTIFIED WITH mysql_native_password BY '00@DealerSolutions';
-- FLUSH PRIVILEGES;

-- Verificar el método de autenticación actual
SELECT user, host, plugin FROM mysql.user WHERE user = 'vgd_testing';

