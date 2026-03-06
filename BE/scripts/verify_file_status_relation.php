<?php
/**
 * Verificación de la relación file_status ↔ file_sub_status
 * 
 * Comprueba:
 * 1. Estructura de file_sub_status (columna id_file_status o IdFileStatus)
 * 2. Foreign key hacia file_status
 * 3. Datos: qué file_status tienen file_sub_status relacionados
 * 
 * Uso: php verify_file_status_relation.php
 * O desde BE: php scripts/verify_file_status_relation.php
 */

// Usar conexión directa mysqli (evita requerir PHP 8.1+ de CodeIgniter)
$basePath = dirname(__DIR__);
$configFile = $basePath . '/app/Config/Database.php';
$config = [
    'hostname' => '127.0.0.1',
    'username' => 'root',
    'password' => 'root',
    'database' => 'single_file',
    'port'     => 3306,
];
// Prioridad: database-config.json (usado en producción) > Database.php
$jsonConfig = $basePath . '/app/Config/database-config.json';
if (file_exists($jsonConfig)) {
    $json = json_decode(file_get_contents($jsonConfig), true);
    if (!empty($json['database'])) {
        $d = $json['database'];
        $config['hostname'] = $d['hostname'] ?? $config['hostname'];
        $config['username'] = $d['username'] ?? $config['username'];
        $config['password'] = $d['password'] ?? $config['password'];
        $config['database'] = $d['database'] ?? $config['database'];
        $config['port'] = (int)($d['port'] ?? $config['port']);
    }
} elseif (file_exists($configFile)) {
    $content = file_get_contents($configFile);
    if (preg_match("/'hostname'\s*=>\s*'([^']+)'/", $content, $m)) $config['hostname'] = $m[1];
    if (preg_match("/'username'\s*=>\s*'([^']+)'/", $content, $m)) $config['username'] = $m[1];
    if (preg_match("/'password'\s*=>\s*'([^']*)'/", $content, $m)) $config['password'] = $m[1];
    if (preg_match("/'database'\s*=>\s*'([^']+)'/", $content, $m)) $config['database'] = $m[1];
    if (preg_match("/'port'\s*=>\s*(\d+)/", $content, $m)) $config['port'] = (int)$m[1];
}
$config['hostname'] = getenv('DB_HOST') ?: $config['hostname'];
$config['username'] = getenv('DB_USER') ?: $config['username'];
$config['password'] = getenv('DB_PASS') ?: $config['password'];
$config['database'] = getenv('DB_NAME') ?: $config['database'];
$config['port'] = getenv('DB_PORT') ? (int)getenv('DB_PORT') : $config['port'];

$mysqli = new mysqli($config['hostname'], $config['username'], $config['password'], $config['database'], $config['port']);
if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}
$mysqli->set_charset('utf8mb4');

echo "============================================================================\n";
echo "VERIFICACIÓN: Relación file_status ↔ file_sub_status\n";
echo "============================================================================\n\n";

// 1. Estructura de file_sub_status
echo "1. ESTRUCTURA DE file_sub_status\n";
echo "--------------------------------\n";
$result = $mysqli->query("SHOW COLUMNS FROM file_sub_status");
if (!$result) {
    die("   ❌ Error: " . $mysqli->error . "\n");
}
$idColName = null;
while ($row = $result->fetch_assoc()) {
    if ($row['Field'] === 'id_file_status' || $row['Field'] === 'IdFileStatus') {
        echo "   ✅ Columna: {$row['Field']} ({$row['Type']}, {$row['Null']})\n";
        $idColName = $row['Field'];
    }
}
if (!$idColName) {
    echo "   ❌ No existe columna id_file_status ni IdFileStatus\n";
    $idColName = 'id_file_status';
}

// 2. Foreign keys
echo "\n2. FOREIGN KEYS en file_sub_status\n";
echo "-----------------------------------\n";
$result = $mysqli->query("
    SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'file_sub_status'
      AND REFERENCED_TABLE_NAME IS NOT NULL
");
$found = false;
while ($row = $result->fetch_assoc()) {
    echo "   ✅ {$row['CONSTRAINT_NAME']}: {$row['COLUMN_NAME']} -> {$row['REFERENCED_TABLE_NAME']}.{$row['REFERENCED_COLUMN_NAME']}\n";
    $found = true;
}
if (!$found) {
    echo "   ⚠️ No se encontró FK hacia file_status\n";
}

// 3. Datos: file_status y sus file_sub_status
// Detectar nombres de columna en file_status (id vs Id)
$fsIdCol = 'id';
$r = $mysqli->query("SHOW COLUMNS FROM file_status");
while ($row = $r->fetch_assoc()) {
    if (strtolower($row['Field']) === 'id') {
        $fsIdCol = $row['Field'];
        break;
    }
}

echo "\n3. DATOS: file_status y file_sub_status relacionados\n";
echo "-----------------------------------------------------\n";
$query = "
    SELECT fs.`{$fsIdCol}` AS fs_id, fs.name AS fs_name,
           fss.id AS fss_id, fss.name AS fss_name, fss.`{$idColName}` AS id_file_status
    FROM file_status fs
    LEFT JOIN file_sub_status fss ON fss.`{$idColName}` = fs.`{$fsIdCol}`
    ORDER BY fs.`{$fsIdCol}`, fss.id
";
$result = $mysqli->query($query);
$rows = [];
if ($result) {
    while ($r = $result->fetch_assoc()) {
        $rows[] = $r;
    }
}

$byStatus = [];
foreach ($rows as $r) {
    $sid = $r['fs_id'];
    if (!isset($byStatus[$sid])) {
        $byStatus[$sid] = ['name' => $r['fs_name'], 'sub' => []];
    }
    if ($r['fss_id'] !== null) {
        $byStatus[$sid]['sub'][] = ['id' => $r['fss_id'], 'name' => $r['fss_name']];
    }
}

foreach ($byStatus as $id => $data) {
    $count = count($data['sub']);
    $icon = $count > 0 ? '✅' : '⚠️';
    echo sprintf("   %s file_status id=%d (%s): %d sub-estados\n", $icon, $id, $data['name'], $count);
    if ($count > 0) {
        foreach ($data['sub'] as $s) {
            echo sprintf("      - id=%d: %s\n", $s['id'], $s['name']);
        }
    } else {
        echo "      (ningún registro en file_sub_status con {$idColName} = {$id})\n";
    }
}

echo "\n============================================================================\n";
echo "RESUMEN\n";
echo "============================================================================\n";
$integracion = null;
foreach ($byStatus as $id => $d) {
    if (stripos($d['name'], 'Integración') !== false) {
        $integracion = ['id' => $id, 'count' => count($d['sub'])];
        break;
    }
}
if ($integracion) {
    if ($integracion['count'] === 0) {
        echo "Integración (id={$integracion['id']}) NO tiene sub-estados en file_sub_status.\n";
        echo "Esto es esperado: la migración 022 solo insertó sub-estados para Liberación.\n";
        echo "Si necesitas sub-estados para Integración, crea una migración que los inserte.\n";
    } else {
        echo "Integración (id={$integracion['id']}) tiene {$integracion['count']} sub-estados.\n";
    }
}
echo "\n";
