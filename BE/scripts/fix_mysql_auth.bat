@echo off
REM Script para solucionar el error de autenticación MySQL en Windows
REM Error: "The server requested authentication method unknown to the client [auth_gssapi_client]"

echo ========================================
echo Solucionando Error de Autenticacion MySQL
echo ========================================
echo.

REM Verificar si MySQL está en el PATH
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL no esta en el PATH
    echo.
    echo Por favor, ejecuta el siguiente comando SQL manualmente:
    echo.
    echo ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '00@Limonero';
    echo FLUSH PRIVILEGES;
    echo.
    pause
    exit /b 1
)

echo Conectando a MySQL...
echo Por favor, ingresa la contraseña del usuario root cuando se solicite
echo.

REM Ejecutar comando SQL para cambiar método de autenticación
mysql -u root -p -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '00@Limonero'; FLUSH PRIVILEGES;"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Problema solucionado exitosamente!
    echo ========================================
    echo.
    echo El metodo de autenticacion ha sido cambiado a mysql_native_password
    echo Ahora puedes reiniciar el servidor del backend.
    echo.
) else (
    echo.
    echo ========================================
    echo Error al ejecutar el comando
    echo ========================================
    echo.
    echo Por favor, ejecuta manualmente los siguientes comandos SQL:
    echo.
    echo ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '00@Limonero';
    echo FLUSH PRIVILEGES;
    echo.
)

pause

