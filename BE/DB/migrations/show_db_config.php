<?php
/**
 * Mostrar configuración de base de datos
 */

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "=== CONFIGURACIÓN DE BASE DE DATOS ===\n\n";
echo "Host: " . $db['hostname'] . "\n";
echo "Puerto: " . $db['port'] . "\n";
echo "Base de Datos: " . $db['database'] . "\n";
echo "Usuario: " . $db['username'] . "\n";
echo "Password: " . str_repeat('*', strlen($db['password'])) . "\n";
echo "\n";
echo "⚠️  Las migraciones se ejecutarán en esta base de datos.\n";
echo "¿Confirmas que es la base de datos correcta? (s/n): ";
