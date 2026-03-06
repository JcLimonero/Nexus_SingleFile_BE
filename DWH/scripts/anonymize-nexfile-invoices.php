#!/usr/bin/env php
<?php
/**
 * Anonimiza datos sensibles en dwh.nexfile_invoices
 * Mantiene idAgency, order_dms, connectionstring para coherencia con nexfile_orders
 *
 * Uso: php scripts/anonymize-nexfile-invoices.php
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
$faker->seed(12347);

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
    $chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    $vin = '';
    for ($i = 0; $i < 17; $i++) {
        $vin .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $vin;
}

// Obtener columnas de nexfile_invoices
$colsRes = $mysqli->query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_invoices' AND COLUMN_NAME != 'id' ORDER BY ORDINAL_POSITION");
$allCols = [];
$stringCols = [];
$numericTypes = ['int', 'bigint', 'smallint', 'tinyint', 'mediumint', 'decimal', 'float', 'double'];
while ($r = $colsRes->fetch_assoc()) {
    $allCols[] = $r['COLUMN_NAME'];
    if (!in_array(strtolower($r['DATA_TYPE']), $numericTypes, true)) {
        $stringCols[] = $r['COLUMN_NAME'];
    }
}

function findCol(array $cols, array $candidates): ?string
{
    foreach ($candidates as $c) {
        if (in_array($c, $cols, true)) {
            return $c;
        }
    }
    return null;
}

$consultantCol = findCol($stringCols, ['consultant_name', 'consultantName']);
$ndConsultantCol = findCol($allCols, ['nd_consultant', 'ndConsultant']);
$customerCol = findCol($stringCols, ['customer_dms', 'customerDMS']);
$connCol = findCol($stringCols, ['connection_string', 'connectionstring']);
$vinCol = findCol($stringCols, ['vin']);
$chassisCol = findCol($stringCols, ['chassis']);
$modelCol = findCol($stringCols, ['model', 'modelo']);
$versionCol = findCol($stringCols, ['version', 'version_name']);
$extColorCol = findCol($stringCols, ['external_color', 'externalColor', 'colores']);
$intColorCol = findCol($stringCols, ['internal_color', 'internalColor']);
$amountCol = findCol($allCols, ['amount', 'monto', 'total']);
$inventoryCol = findCol($allCols, ['inventory', 'inventario']);
$agencyCol = findCol($allCols, ['id_agency', 'idAgency']);
$orderDmsCol = findCol($allCols, ['order_dms', 'orderDMS', 'numeroPedido']);
$yearCol = findCol($allCols, ['year', 'model_year', 'delivery_year']);

$updates = [];
if ($consultantCol) $updates[] = "`$consultantCol` = ?";
if ($ndConsultantCol) $updates[] = "`$ndConsultantCol` = ?";
if ($customerCol) $updates[] = "`$customerCol` = ?";
if ($connCol) $updates[] = "`$connCol` = ?";
if ($vinCol) $updates[] = "`$vinCol` = ?";
if ($chassisCol) $updates[] = "`$chassisCol` = ?";
if ($modelCol) $updates[] = "`$modelCol` = ?";
if ($versionCol) $updates[] = "`$versionCol` = ?";
if ($extColorCol) $updates[] = "`$extColorCol` = ?";
if ($intColorCol) $updates[] = "`$intColorCol` = ?";
if ($amountCol) $updates[] = "`$amountCol` = ?";
if ($inventoryCol) $updates[] = "`$inventoryCol` = ?";
if ($yearCol) $updates[] = "`$yearCol` = ?";

if (empty($updates)) {
    fwrite(STDERR, "Error: No se encontraron columnas para anonimizar\n");
    exit(1);
}

$sql = "UPDATE nexfile_invoices SET " . implode(', ', $updates) . " WHERE id = ?";
$stmt = $mysqli->prepare($sql);
if (!$stmt) {
    fwrite(STDERR, "Error prepare: " . $mysqli->error . "\n");
    exit(1);
}

// Cargar órdenes: (id_agency|order_dms) -> datos de la unidad
$ordersMap = [];
$ordRes = $mysqli->query("SELECT id_agency, order_dms, model, version, external_color, internal_color, vin, customer_dms, inventory, amount, year FROM nexfile_orders");
if ($ordRes) {
    while ($o = $ordRes->fetch_assoc()) {
        $key = trim((string) ($o['id_agency'] ?? $o['idAgency'] ?? '')) . '|' . trim((string) ($o['order_dms'] ?? ''));
        $ordersMap[$key] = $o;
    }
}
echo "Órdenes cargadas para coincidencia: " . count($ordersMap) . "\n";

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
$versiones = ['Base', 'Confort', 'Sport', 'Premium', 'Limited'];
$colores = ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul'];

$numClientes = max(20, (int) (count($allCols) * 2));
$poolCustomerDMS = [];
for ($i = 0; $i < $numClientes; $i++) {
    $poolCustomerDMS[] = $faker->numerify('#####');
}

$selectCols = ['id'];
if ($agencyCol) $selectCols[] = "`$agencyCol` AS id_agency";
if ($orderDmsCol) $selectCols[] = "`$orderDmsCol` AS order_dms";
$result = $mysqli->query("SELECT " . implode(', ', $selectCols) . " FROM nexfile_invoices");
$fakerYear = [2025, 2026];
if (!$result) {
    fwrite(STDERR, "Error: " . $mysqli->error . "\n");
    exit(1);
}

$count = 0;
$matched = 0;
while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $idAgency = trim((string) ($row['id_agency'] ?? $row['idAgency'] ?? ''));
    $orderDms = trim((string) ($row['order_dms'] ?? ''));
    $orderKey = $idAgency . '|' . $orderDms;
    $order = $ordersMap[$orderKey] ?? null;
    $connectionstring = $agencyConnection[$idAgency] ?? 'KiaConnection';

    $bind = [];
    $types = '';
    if ($consultantCol) { $bind[] = $faker->name; $types .= 's'; }
    if ($ndConsultantCol) { $bind[] = $faker->numerify('######'); $types .= 's'; }
    if ($customerCol) {
        $bind[] = $order ? ($order['customer_dms'] ?? $order['customerDMS'] ?? '') : $poolCustomerDMS[array_rand($poolCustomerDMS)];
        $types .= 's';
    }
    if ($connCol) { $bind[] = $connectionstring; $types .= 's'; }
    if ($vinCol) {
        $bind[] = $order ? ($order['vin'] ?? generarVin()) : generarVin();
        $types .= 's';
    }
    if ($chassisCol) {
        $bind[] = $order ? ($order['vin'] ?? generarVin()) : generarVin();
        $types .= 's';
    }
    if ($modelCol) {
        $bind[] = $order ? ($order['model'] ?? getModeloPorConnection($modelosPorMarca, $connectionstring)) : getModeloPorConnection($modelosPorMarca, $connectionstring);
        $types .= 's';
    }
    if ($versionCol) {
        $bind[] = $order ? ($order['version'] ?? $versiones[array_rand($versiones)]) : $versiones[array_rand($versiones)];
        $types .= 's';
    }
    if ($extColorCol) {
        $bind[] = $order ? ($order['external_color'] ?? $colores[array_rand($colores)]) : $colores[array_rand($colores)];
        $types .= 's';
    }
    if ($intColorCol) {
        $bind[] = $order ? ($order['internal_color'] ?? $colores[array_rand($colores)]) : $colores[array_rand($colores)];
        $types .= 's';
    }
    if ($amountCol) {
        $bind[] = $order ? ($order['amount'] ?? $faker->randomFloat(2, 150000, 850000)) : $faker->randomFloat(2, 150000, 850000);
        $types .= 'd';
    }
    if ($inventoryCol) {
        $bind[] = $order ? ($order['inventory'] ?? $faker->numerify('##########')) : $faker->numerify('##########');
        $types .= 's';
    }
    if ($yearCol) {
        $bind[] = $order ? ($order['year'] ?? $faker->randomElement($fakerYear)) : $faker->randomElement($fakerYear);
        $types .= 'i';
    }
    $bind[] = $id;
    $types .= 'i';

    if ($order) $matched++;

    $stmt->bind_param($types, ...$bind);
    $stmt->execute();
    $count++;
    if ($count % 50 === 0) {
        echo "Procesados: $count\n";
    }
}

$stmt->close();
$mysqli->close();

echo "Listo. $count facturas anonimizadas ($matched coinciden con órdenes).\n";
