@echo off
echo 🚀 Iniciando SingleFile Development Environment...

REM Verificar si el puerto 3500 está en uso
netstat -an | findstr :3500 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3500 está en uso. Deteniendo proceso...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3500') do taskkill /f /pid %%a
    timeout /t 2 /nobreak >nul
)

REM Verificar si el puerto 3600 está en uso
netstat -an | findstr :3600 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3600 está en uso. Deteniendo proceso...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3600') do taskkill /f /pid %%a
    timeout /t 2 /nobreak >nul
)

REM Iniciar Backend en puerto 3500
echo 🔧 Iniciando Backend en puerto 3500...
cd ..\BE\singlefile-api
start "Backend" php spark serve --host=0.0.0.0 --port=3500

REM Esperar a que el backend esté listo
echo ⏳ Esperando a que el backend esté listo...
timeout /t 5 /nobreak >nul

REM Iniciar Frontend en puerto 3600
echo 🎨 Iniciando Frontend en puerto 3600...
cd ..\..\FE
start "Frontend" ng serve --port 3600

echo.
echo 🎉 SingleFile Development Environment iniciado exitosamente!
echo.
echo 📱 Frontend: http://localhost:3600
echo 🔧 Backend:  http://localhost:3500
echo 📡 API Proxy: http://localhost:3600/api -^> http://localhost:3500/api
echo.
pause
