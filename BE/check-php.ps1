# Script para verificar PHP en Windows
# Uso: .\check-php.ps1

Write-Host "=== Verificacion de PHP ===" -ForegroundColor Cyan

# Buscar PHP en ubicaciones comunes
$phpPaths = @(
    "C:\php\php.exe",
    "C:\xampp\php\php.exe",
    "C:\wamp\bin\php\php*\php.exe",
    "C:\Program Files\PHP\php.exe",
    "C:\Program Files (x86)\PHP\php.exe"
)

$phpFound = $false
$phpPath = $null

# Buscar PHP
foreach ($path in $phpPaths) {
    $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
    if ($resolved) {
        $phpPath = $resolved.Path
        $phpFound = $true
        break
    }
}

# Tambien buscar en PATH
if (-not $phpFound) {
    $phpInPath = Get-Command php -ErrorAction SilentlyContinue
    if ($phpInPath) {
        $phpPath = $phpInPath.Source
        $phpFound = $true
    }
}

if ($phpFound) {
    Write-Host "PHP encontrado en: $phpPath" -ForegroundColor Green
    & $phpPath -v
    $phpDir = Split-Path $phpPath -Parent
    Write-Host ""
    Write-Host "Para usar PHP, ejecuta:" -ForegroundColor Yellow
    Write-Host "  `$env:Path += ';$phpDir'" -ForegroundColor White
    Write-Host "  O usa la ruta completa" -ForegroundColor White
} else {
    Write-Host "PHP no encontrado en el sistema" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones para instalar PHP:" -ForegroundColor Yellow
    Write-Host "1. Descargar desde: https://windows.php.net/download/" -ForegroundColor White
    Write-Host "2. Usar Chocolatey: choco install php" -ForegroundColor White
    Write-Host "3. Usar XAMPP: https://www.apachefriends.org/" -ForegroundColor White
    Write-Host "4. Usar WAMP: https://www.wampserver.com/" -ForegroundColor White
    Write-Host ""
    Write-Host "Despues de instalar, agrega PHP al PATH del sistema." -ForegroundColor Yellow
}
