@echo off
REM ============================================================
REM  NexFile WIZARD launcher (Windows)
REM
REM  Double-click this file to launch the desktop wizard.
REM  On first run it installs npm dependencies (~3-5 minutes).
REM  Subsequent runs go straight to launching Electron.
REM
REM  Requirements:
REM   - Node.js 20+ installed and on PATH
REM   - config\central.env present at the repo root (one level up)
REM ============================================================

setlocal

REM cd to the directory this script lives in (works even when launched
REM from a different working directory)
cd /d "%~dp0"

echo.
echo === NexFile WIZARD ===
echo Directory: %CD%
echo.

REM Verify Node is available
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found on PATH. Install Node 20+ from https://nodejs.org and re-run.
    pause
    exit /b 1
)

REM Show which Node we're using
for /f "tokens=*" %%i in ('node --version') do set NODEVER=%%i
echo Node version: %NODEVER%

REM Install dependencies on first run
if not exist "node_modules\@angular\core" (
    echo.
    echo Dependencies missing. Running npm install...
    echo This takes 3-5 minutes the first time.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Fix the error above and re-run.
        pause
        exit /b 1
    )
)

REM Warn if central.env is missing — wizard still works but Step 2 won't auto-fill
if not exist "..\config\central.env" (
    echo.
    echo [WARN] ..\config\central.env not found.
    echo The wizard will still run, but Step 2 won't pre-fill — you'll have to
    echo type the central DB credentials manually.
    echo.
    echo Copy ..\config\central.env.template to ..\config\central.env and edit it.
    echo.
    pause
)

REM Launch the wizard
echo.
echo Launching wizard... (Ctrl+C to abort)
echo.
call npm start

REM Keep window open after wizard closes so the user sees any error trace
echo.
echo Wizard closed. Press any key to exit.
pause >nul
endlocal
