<?php
/**
 * Script para verificar la versión de PHP
 */

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  VERIFICACIÓN DE VERSIÓN DE PHP\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$currentVersion = PHP_VERSION;
$requiredVersion = '8.1';
$targetVersion = '8.4.11';

echo "Versión actual de PHP: $currentVersion\n";
echo "Versión requerida mínima: $requiredVersion\n";
echo "Versión objetivo: $targetVersion\n\n";

if (version_compare($currentVersion, $requiredVersion, '>=')) {
    echo "✅ Versión de PHP compatible con CodeIgniter 4\n";
} else {
    echo "❌ Versión de PHP incompatible. Se requiere PHP $requiredVersion o superior\n";
}

if (version_compare($currentVersion, $targetVersion, '==')) {
    echo "✅ Versión de PHP coincide con el objetivo ($targetVersion)\n";
} else {
    echo "⚠️  Versión de PHP no coincide con el objetivo ($targetVersion)\n";
}

echo "\n";
echo "Información adicional:\n";
echo "  - SAPI: " . PHP_SAPI . "\n";
echo "  - Sistema operativo: " . PHP_OS . "\n";
echo "  - Ruta de PHP: " . PHP_BINARY . "\n";
echo "\n";

// Verificar extensiones importantes
echo "Extensiones PHP instaladas:\n";
$requiredExtensions = ['mysqli', 'pdo', 'mbstring', 'json', 'curl', 'openssl', 'fileinfo'];
foreach ($requiredExtensions as $ext) {
    $status = extension_loaded($ext) ? '✅' : '❌';
    echo "  $status $ext\n";
}

echo "\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n";
