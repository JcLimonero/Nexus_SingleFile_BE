#!/usr/bin/env php
<?php
/**
 * Pobla nexfile_invoices:
 * - 60%: datos de nexfile_orders (coinciden por idAgency + order_dms)
 * - 40%: registros inventados con Faker
 *
 * Requiere: migración 003 y nexfile_orders poblada (y anonimizada).
 * Uso: php scripts/populate-nexfile-invoices.php
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

$dwh = new mysqli(
    $db['hostname'] ?? '127.0.0.1',
    $db['username'] ?? '',
    $db['password'] ?? '',
    'dwh',
    $db['port'] ?? 3306
);

if ($dwh->connect_error) {
    fwrite(STDERR, "Error conexión: " . $dwh->connect_error . "\n");
    exit(1);
}
$dwh->set_charset($db['charset'] ?? 'utf8mb4');

$faker = Faker\Factory::create('es_ES');
$faker->seed(12348);

$agencyConnection = [
    '48410047' => 'QuiterConnection', '9001' => 'OmodaConnection', '9002' => 'OmodaConnection',
    '187' => 'ChireyConnection', '99999' => 'GeelyConnection', '88888' => 'GeelyConnection',
    '73001' => 'MotonovaConnection', '1356' => 'AudiConnection', '10018' => 'BMWConnection',
    '2003' => 'HondaConnection', '10017' => 'HondaConnection', '10082' => 'HondaConnection',
    '10202' => 'HondaConnection', '63' => 'HondaConnection', '1' => 'KiaConnection',
    '2' => 'KiaConnection', '70012' => 'MotonovaConnection', '9000' => 'OmodaConnection',
    '1000' => 'KiaConnection',
];

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

function quitarAnioDelModelo(?string $model): ?string
{
    if ($model === null || $model === '') return $model;
    return trim(preg_replace('/\s+20\d{2}$/', '', $model));
}
$versiones = ['Base', 'Confort', 'Sport', 'Premium', 'Limited', 'Exclusive'];
$colores = ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Blanco Perlado', 'Negro Metálico'];

function generarVin(): string
{
    $chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    $vin = '';
    for ($i = 0; $i < 17; $i++) {
        $vin .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $vin;
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

// 1. Columnas de nexfile_invoices y nexfile_orders
$invColsRes = $dwh->query("SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_invoices' AND COLUMN_NAME != 'id' ORDER BY ORDINAL_POSITION");
$invCols = [];
$invTypes = [];
$invNullable = [];
while ($r = $invColsRes->fetch_assoc()) {
    $invCols[] = $r['COLUMN_NAME'];
    $invTypes[$r['COLUMN_NAME']] = strtolower($r['DATA_TYPE'] ?? '');
    $invNullable[$r['COLUMN_NAME']] = ($r['IS_NULLABLE'] ?? 'YES') === 'YES';
}

$ordColsRes = $dwh->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_orders'");
$ordCols = [];
while ($r = $ordColsRes->fetch_assoc()) {
    $ordCols[] = $r['COLUMN_NAME'];
}

$colMap = [];
$aliasMap = ['chassis' => 'vin', 'vin' => 'vin', 'orderdms' => 'order_dms', 'numeropedido' => 'order_dms', 'idagency' => 'id_agency', 'customerdms' => 'customer_dms'];
foreach ($invCols as $ic) {
    $oc = $aliasMap[strtolower($ic)] ?? null;
    if ($oc && in_array($oc, $ordCols, true)) {
        $colMap[$ic] = $oc;
    } else {
        $oc = findCol($ordCols, [$ic, str_replace('_', '', $ic)]);
        if (!$oc && preg_match('/^([a-z]+)_([a-z]+)$/i', $ic, $m)) {
            $oc = findCol($ordCols, [$m[1] . ucfirst($m[2]), ucfirst($m[1]) . $m[2]]);
        }
        $colMap[$ic] = $oc;
    }
}

// 2. Obtener todas las órdenes
$ordersRes = $dwh->query("SELECT * FROM nexfile_orders");
$orders = [];
while ($r = $ordersRes->fetch_assoc()) {
    $orders[] = $r;
}
$numOrders = count($orders);
echo "Órdenes en nexfile_orders: $numOrders\n";

if ($numOrders === 0) {
    fwrite(STDERR, "Error: nexfile_orders está vacía. Ejecutar migración 001 y anonymize-nexfile-orders.\n");
    exit(1);
}

// 3. Calcular 60% coincidentes (de órdenes), 40% inventados
$totalDesired = (int) round($numOrders / 0.6);
$numMatching = min($numOrders, (int) ceil(0.6 * $totalDesired));
$numInvented = $totalDesired - $numMatching;

echo "A insertar: $numMatching desde órdenes + $numInvented inventados = $totalDesired\n";

// 4. Pool para inventados
$poolCustomerDMS = [];
for ($i = 0; $i < max(30, (int) ($numInvented * 0.5)); $i++) {
    $poolCustomerDMS[] = $faker->numerify('#####');
}

$agencies = array_values(array_unique(array_filter(array_map(function ($o) {
    return trim((string) ($o['id_agency'] ?? $o['idAgency'] ?? ''));
}, $orders))));

// 5. Truncar
$dwh->query("TRUNCATE TABLE nexfile_invoices");

$colList = implode(', ', array_map(fn($c) => "`" . str_replace('`', '``', $c) . "`", $invCols));
$placeholders = implode(', ', array_fill(0, count($invCols), '?'));
$stmt = $dwh->prepare("INSERT INTO nexfile_invoices ($colList) VALUES ($placeholders)");
if (!$stmt) {
    fwrite(STDERR, "Error prepare: " . $dwh->error . "\n");
    exit(1);
}

$inserted = 0;

// 6. Insertar desde órdenes (60%)
shuffle($orders);
$toInsertFromOrders = array_slice($orders, 0, $numMatching);
foreach ($toInsertFromOrders as $order) {
    $vals = [];
    $types = '';
    foreach ($invCols as $ic) {
        $oc = $colMap[$ic];
        $v = $oc ? ($order[$oc] ?? null) : null;
        if ($v === null && in_array(strtolower($ic), ['delivery_month', 'deliverymonth'], true)) {
            $v = $faker->numberBetween(1, 12);
        } elseif ($v === null && in_array(strtolower($ic), ['delivery_year', 'deliveryyear'], true)) {
            $v = $faker->numberBetween(2023, 2025);
        }
        if ($v === null && in_array(strtolower($ic), ['release_date', 'releasedate'], true)) {
            $v = $faker->randomElement(['2025-11-15', '2025-11-20', '2025-12-01', '2025-12-10', '2026-01-05', '2026-01-15']);
        }
        if ($v === null && in_array(strtolower($ic), ['bussines_name', 'bussinesname', 'razon_social', 'razonsocial'], true)) {
            $v = $faker->company;
        }
        if ($v === null && in_array(strtolower($ic), ['tipo_cliente', 'tipocliente'], true)) {
            $v = $faker->randomElement(['fisica', 'moral']);
        }
        if ($v === null && in_array(strtolower($ic), ['tipo_operacion', 'tipooperacion'], true)) {
            $v = $faker->randomElement(['Compra', 'Venta']);
        }
        if ($v === null && in_array(strtolower($ic), ['tipo_proceso', 'tipoproceso'], true)) {
            $v = $faker->randomElement(['Integración', 'Liquidación', 'Liberación']);
        }
        $dt = $invTypes[$ic] ?? '';
        if ($v !== null && in_array($dt, ['int', 'bigint', 'smallint', 'tinyint', 'mediumint'], true) && !is_numeric($v)) {
            $v = is_string($v) && $v !== '' ? (int) preg_replace('/\D/', '', $v) : null;
        }
        if (in_array(strtolower($ic), ['model', 'modelo'], true) && is_string($v)) {
            $v = quitarAnioDelModelo($v);
        }
        if (in_array(strtolower($ic), ['year', 'model_year', 'delivery_year', 'deliveryyear'], true) && $v !== null && (int) $v < 2025) {
            $v = $faker->randomElement([2025, 2026]);
        }
        if ($v === null && !($invNullable[$ic] ?? true)) {
            $v = in_array($dt, ['int', 'bigint', 'smallint', 'tinyint', 'mediumint'], true) ? 0
                : (in_array($dt, ['decimal', 'float', 'double'], true) ? 0.0 : '');
        }
        $vals[] = $v;
        $types .= is_int($v) ? 'i' : (is_float($v) ? 'd' : 's');
    }
    $stmt->bind_param($types, ...$vals);
    $stmt->execute();
    $inserted++;
    if ($inserted % 50 === 0) echo "Insertados: $inserted\n";
}

// 7. Insertar inventados (40%)
for ($i = 0; $i < $numInvented; $i++) {
    $idAgency = $agencies[array_rand($agencies)];
    $connectionstring = $agencyConnection[$idAgency] ?? 'KiaConnection'; // inventar order_dms único
    $orderDms = $faker->numerify('########');
    $row = [];
    foreach ($invCols as $ic) {
        $icLower = strtolower($ic);
        if (in_array($icLower, ['idagency', 'id_agency'])) {
            $row[$ic] = $idAgency;
        } elseif (in_array($icLower, ['order_dms', 'orderdms', 'numeropedido'])) {
            $row[$ic] = $orderDms;
        } elseif (in_array($icLower, ['connectionstring', 'connection_string'])) {
            $row[$ic] = $connectionstring;
        } elseif (in_array($icLower, ['consultantname', 'consultant_name'])) {
            $row[$ic] = $faker->name;
        } elseif (in_array($icLower, ['ndconsultant', 'nd_consultant'])) {
            $row[$ic] = $faker->numerify('######');
        } elseif (in_array($icLower, ['customerdms', 'customer_dms'])) {
            $row[$ic] = $poolCustomerDMS[array_rand($poolCustomerDMS)];
        } elseif (in_array($icLower, ['vin', 'chassis'])) {
            $row[$ic] = generarVin();
        } elseif (in_array($icLower, ['model', 'modelo'])) {
            $row[$ic] = in_array($invTypes[$ic] ?? '', ['int', 'bigint', 'smallint', 'tinyint'], true)
                ? $faker->numberBetween(1, 999)
                : getModeloPorConnection($modelosPorMarca, $connectionstring);
        } elseif (in_array($icLower, ['version', 'version_name'])) {
            $row[$ic] = in_array($invTypes[$ic] ?? '', ['int', 'bigint', 'smallint', 'tinyint'], true)
                ? $faker->numberBetween(1, 99)
                : $versiones[array_rand($versiones)];
        } elseif (in_array($icLower, ['external_color', 'externalcolor', 'colores'])) {
            $row[$ic] = $colores[array_rand($colores)];
        } elseif (in_array($icLower, ['internal_color', 'internalcolor'])) {
            $row[$ic] = $colores[array_rand($colores)];
        } elseif (in_array($icLower, ['amount', 'monto', 'total'])) {
            $row[$ic] = $faker->randomFloat(2, 150000, 850000);
        } elseif (in_array($icLower, ['delivery_month', 'deliverymonth'])) {
            $row[$ic] = $faker->numberBetween(1, 12);
        } elseif (in_array($icLower, ['delivery_year', 'deliveryyear', 'year', 'model_year'])) {
            $row[$ic] = $faker->randomElement([2025, 2026]);
        } elseif (in_array($icLower, ['release_date', 'releasedate'])) {
            $row[$ic] = $faker->randomElement(['2025-11-15', '2025-11-20', '2025-12-01', '2025-12-10', '2026-01-05', '2026-01-15']);
        } elseif (in_array($icLower, ['bussines_name', 'bussinesname', 'razon_social', 'razonsocial'])) {
            $row[$ic] = $faker->company;
        } elseif (in_array($icLower, ['tipo_cliente', 'tipocliente'])) {
            $row[$ic] = $faker->randomElement(['fisica', 'moral']);
        } elseif (in_array($icLower, ['tipo_operacion', 'tipooperacion'])) {
            $row[$ic] = $faker->randomElement(['Compra', 'Venta']);
        } elseif (in_array($icLower, ['tipo_proceso', 'tipoproceso'])) {
            $row[$ic] = $faker->randomElement(['Integración', 'Liquidación', 'Liberación']);
        } else {
            $row[$ic] = null;
        }
    }
    foreach ($invCols as $ic) {
        if (($row[$ic] ?? null) === null && !($invNullable[$ic] ?? true)) {
            $dt = $invTypes[$ic] ?? '';
            $icLower = strtolower($ic);
            if (in_array($dt, ['int', 'bigint', 'smallint', 'tinyint', 'mediumint'], true)) {
                $row[$ic] = 0;
            } elseif (in_array($dt, ['decimal', 'float', 'double'], true)) {
                $row[$ic] = 0.0;
            } elseif (in_array($icLower, ['vin', 'chassis'])) {
                $row[$ic] = generarVin();
            } else {
                $row[$ic] = '';
            }
        }
    }
    $vals = [];
    $types = '';
    foreach ($invCols as $ic) {
        $v = $row[$ic] ?? null;
        $vals[] = $v;
        $types .= is_int($v) ? 'i' : (is_float($v) ? 'd' : 's');
    }
    $stmt->bind_param($types, ...$vals);
    $stmt->execute();
    $inserted++;
    if ($inserted % 50 === 0) echo "Insertados: $inserted\n";
}

$stmt->close();
$dwh->close();

echo "Listo. $inserted facturas en nexfile_invoices ($numMatching desde órdenes + $numInvented inventadas).\n";
