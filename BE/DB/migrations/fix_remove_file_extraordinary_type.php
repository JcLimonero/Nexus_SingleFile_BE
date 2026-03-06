<?php
/**
 * Eliminar foreign key y luego la tabla file_extraordinary_type
 */

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== Eliminando file_extraordinary_type ===\n\n";

// Buscar foreign keys que referencian file_extraordinary_type
echo "🔍 Buscando foreign keys que referencian file_extraordinary_type...\n";

$result = $mysqli->query("
    SELECT 
        TABLE_NAME,
        CONSTRAINT_NAME
    FROM information_schema.table_constraints
    WHERE table_schema = DATABASE()
    AND constraint_type = 'FOREIGN KEY'
    AND CONSTRAINT_NAME LIKE '%extraordinary%'
");

$fksToRemove = [];
while ($row = $result->fetch_assoc()) {
    $fksToRemove[] = [
        'table' => $row['TABLE_NAME'],
        'constraint' => $row['CONSTRAINT_NAME']
    ];
    echo "  Encontrada FK: {$row['CONSTRAINT_NAME']} en tabla {$row['TABLE_NAME']}\n";
}

if (empty($fksToRemove)) {
    echo "  ⚠️  No se encontraron foreign keys\n";
} else {
    echo "\n🗑️  Eliminando foreign keys...\n";
    foreach ($fksToRemove as $fk) {
        echo "  Eliminando {$fk['constraint']} de {$fk['table']}... ";
        if ($mysqli->query("ALTER TABLE `{$fk['table']}` DROP FOREIGN KEY `{$fk['constraint']}`")) {
            echo "✅\n";
        } else {
            echo "❌ Error: " . $mysqli->error . "\n";
        }
    }
}

// Ahora eliminar la tabla
echo "\n🗑️  Eliminando tabla file_extraordinary_type... ";
if ($mysqli->query("DROP TABLE IF EXISTS `file_extraordinary_type`")) {
    echo "✅ Eliminada\n";
} else {
    echo "❌ Error: " . $mysqli->error . "\n";
}

// Verificar
$result = $mysqli->query("SHOW TABLES LIKE 'file_extraordinary_type'");
if ($result && $result->num_rows == 0) {
    echo "\n✅ Tabla file_extraordinary_type eliminada correctamente\n";
} else {
    echo "\n⚠️  La tabla aún existe\n";
}

$mysqli->close();
