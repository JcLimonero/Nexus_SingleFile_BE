#!/usr/bin/env php
<?php
/**
 * Anonimiza datos sensibles en dwh.nexfile_orders
 * Mantiene estructura realista con Faker
 *
 * Uso: php scripts/anonymize-nexfile-orders.php
 */

require __DIR__ . '/../vendor/autoload.php';

$baseDir = dirname(__DIR__);
$configPath = $baseDir . '/app/Config/database-config.json';

if (!is_file($configPath)) {
    fwrite(STDERR, "Error: No se encuentra database-config.json\n");
    exit(1);
}

$config = json_decode(file_get_contents($configPath), true);
$db = $config['database'] ?? null;
if (!$db) {
    fwrite(STDERR, "Error: Configuración de BD no válida\n");
    exit(1);
}

$mysqli = new mysqli(
    $db['hostname'] ?? '127.0.0.1',
    $db['username'] ?? '',
    $db['password'] ?? '',
    'dwh',
    $db['port'] ?? 3306
);

if ($mysqli->connect_error) {
    fwrite(STDERR, "Error de conexión: " . $mysqli->connect_error . "\n");
    exit(1);
}

$mysqli->set_charset($db['charset'] ?? 'utf8mb4');

$faker = Faker\Factory::create('es_ES');
$faker->seed(12345);

// Modelos por marca (sin año; año va en columna year). Solo 2025+
$modelosPorMarca = [
    'KiaConnection' => ['Rio', 'Forte', 'Cerato', 'K5', 'Sportage', 'Sorento', 'Seltos', 'Soul', 'Stonic', 'Carnival', 'EV6', 'Niro'],
    'HondaConnection' => ['Civic', 'Accord', 'HR-V', 'CR-V', 'Pilot', 'Fit', 'City', 'BR-V', 'Odyssey'],
    'AudiConnection' => ['A3', 'A4', 'Q3', 'Q5', 'Q7', 'A6', 'e-tron', 'Q4 e-tron'],
    'GeelyConnection' => ['Coolray', 'Azkarra', 'Emgrand', 'Tugella', 'Geometry C'],
    'OmodaConnection' => ['C5', 'C3', 'E5'],
    'ChireyConnection' => ['Tiggo', 'Arrizo', 'Omoda'],
    'QuiterConnection' => ['Varios'],
    'MotonovaConnection' => ['Varios'],
    'BMWConnection' => ['Serie 3', 'Serie 5', 'X3', 'X5'],
];

function getModeloPorConnection(array $modelosPorMarca, string $connection): string
{
    $modelos = $modelosPorMarca[$connection] ?? $modelosPorMarca['KiaConnection'];
    return $modelos[array_rand($modelos)];
}

$versiones = ['Base', 'Confort', 'Sport', 'Premium', 'Limited', 'Exclusive', 'Touring'];

$colores = ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Blanco Perlado', 'Negro Metálico'];

// Mapeo idAgency -> connectionstring
$agencyConnection = [
    '48410047' => 'QuiterConnection',
    '9001' => 'OmodaConnection',
    '9002' => 'OmodaConnection',
    '187' => 'ChireyConnection',
    '99999' => 'GeelyConnection',
    '88888' => 'GeelyConnection',
    '73001' => 'MotonovaConnection',
    '1356' => 'AudiConnection',
    '10018' => 'BMWConnection',
    '2003' => 'HondaConnection',
    '10017' => 'HondaConnection',
    '10082' => 'HondaConnection',
    '10202' => 'HondaConnection',
    '63' => 'HondaConnection',
    '1' => 'KiaConnection',
    '2' => 'KiaConnection',
    '70012' => 'MotonovaConnection',
    '9000' => 'OmodaConnection',
    '1000' => 'KiaConnection',
];

function generarVin(): string
{
    $chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // Sin I, O, Q
    $vin = '';
    for ($i = 0; $i < 17; $i++) {
        $vin .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $vin;
}

// Verificar si existe columna year
$yearCol = null;
$yr = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_orders' AND COLUMN_NAME IN ('year', 'model_year') LIMIT 1");
if ($yr && $r = $yr->fetch_assoc()) {
    $yearCol = $r['COLUMN_NAME'];
}

$invCol = null;
$inv = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_orders' AND COLUMN_NAME IN ('inventory', 'inventario') LIMIT 1");
if ($inv && $r = $inv->fetch_assoc()) {
    $invCol = $r['COLUMN_NAME'];
}

$updCols = "consultant_name = ?, nd_consultant = ?, customer_dms = ?, connection_string = ?, vin = ?, model = ?, version = ?, external_color = ?, internal_color = ?, amount = ?";
if ($yearCol) {
    $updCols .= ", `$yearCol` = ?";
}
if ($invCol) {
    $updCols .= ", `$invCol` = ?";
}
$stmt = $mysqli->prepare("UPDATE nexfile_orders SET $updCols WHERE id = ?");

if (!$stmt) {
    fwrite(STDERR, "Error prepare: " . $mysqli->error . "\n");
    exit(1);
}

$result = $mysqli->query("SELECT id, id_agency FROM nexfile_orders");
if (!$result) {
    fwrite(STDERR, "Error: " . $mysqli->error . "\n");
    exit(1);
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

// Pool de customerDMS: ~35% únicos para que algunos clientes tengan varias compras entre agencias
$numClientes = max(20, (int) (count($rows) * 0.35));
$poolCustomerDMS = [];
for ($i = 0; $i < $numClientes; $i++) {
    $poolCustomerDMS[] = $faker->numerify('#####');
}

$count = 0;
foreach ($rows as $row) {
    $id = $row['id'];
    $idAgency = trim((string) ($row['id_agency'] ?? ''));
    $connectionstring = $agencyConnection[$idAgency] ?? 'KiaConnection'; // Fallback
    $consultantName = $faker->name;
    $ndConsultant = $faker->numerify('######');
    $customerDMS = $poolCustomerDMS[array_rand($poolCustomerDMS)]; // Aleatorio del pool -> repeticiones
    $vin = generarVin();
    $model = getModeloPorConnection($modelosPorMarca, $connectionstring);
    $version = $versiones[array_rand($versiones)];
    $external_color = $colores[array_rand($colores)];
    $internal_color = $colores[array_rand($colores)];
    $amount = $faker->randomFloat(2, 150000, 850000);
    $year = $faker->randomElement([2025, 2026]);
    $inventory = $faker->numerify('##########'); // 10 dígitos

    if ($yearCol && $invCol) {
        $stmt->bind_param('sssssssssdisi', $consultantName, $ndConsultant, $customerDMS, $connectionstring, $vin, $model, $version, $external_color, $internal_color, $amount, $year, $inventory, $id);
    } elseif ($yearCol) {
        $stmt->bind_param('sssssssssdii', $consultantName, $ndConsultant, $customerDMS, $connectionstring, $vin, $model, $version, $external_color, $internal_color, $amount, $year, $id);
    } elseif ($invCol) {
        $stmt->bind_param('sssssssssdsi', $consultantName, $ndConsultant, $customerDMS, $connectionstring, $vin, $model, $version, $external_color, $internal_color, $amount, $inventory, $id);
    } else {
        $stmt->bind_param('sssssssssdi', $consultantName, $ndConsultant, $customerDMS, $connectionstring, $vin, $model, $version, $external_color, $internal_color, $amount, $id);
    }
    $stmt->execute();
    $count++;
    if ($count % 20 === 0) {
        echo "Procesados: $count\n";
    }
}

$stmt->close();
$mysqli->close();

echo "Listo. $count registros anonimizados.\n";
