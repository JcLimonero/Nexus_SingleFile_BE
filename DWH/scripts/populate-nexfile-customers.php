#!/usr/bin/env php
<?php
/**
 * Crea tabla nexfile_customers con el mismo número de clientes que nexfile_orders.
 * Los clientes se obtienen de view_single_file_client (agencias que coinciden).
 * ndCliente = customerDMS de nexfile_orders para mantener relación.
 *
 * Uso: php scripts/populate-nexfile-customers.php
 */

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

$conn = [
    'host' => $db['hostname'] ?? '127.0.0.1',
    'user' => $db['username'] ?? '',
    'pass' => $db['password'] ?? '',
    'port' => $db['port'] ?? 3306,
    'charset' => $db['charset'] ?? 'utf8mb4',
];

$dwh = new mysqli($conn['host'], $conn['user'], $conn['pass'], 'dwh', $conn['port']);
$vgd = new mysqli($conn['host'], $conn['user'], $conn['pass'], 'vgd_dwh_prod', $conn['port']);

foreach ([$dwh, $vgd] as $m) {
    if ($m->connect_error) {
        fwrite(STDERR, "Error conexión: " . $m->connect_error . "\n");
        exit(1);
    }
    $m->set_charset($conn['charset']);
}

// 1. Obtener customer_dms distintos de nexfile_orders (misma cantidad de clientes)
$res = $dwh->query("SELECT DISTINCT customer_dms, id_agency FROM nexfile_orders ORDER BY id_agency, customer_dms");
$customerList = [];
while ($r = $res->fetch_assoc()) {
    $customerList[] = ['customer_dms' => trim($r['customer_dms'] ?? $r['customerDMS'] ?? ''), 'id_agency' => trim($r['id_agency'] ?? $r['idAgency'] ?? '')];
}

$numClients = count($customerList);
echo "Clientes únicos en nexfile_orders: $numClients\n";

if ($numClients === 0) {
    fwrite(STDERR, "Error: nexfile_orders está vacía. Ejecutar primero la migración 001.\n");
    exit(1);
}

// 2. Obtener columnas de la vista
$colsRes = $vgd->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'vgd_dwh_prod' AND TABLE_NAME = 'view_single_file_client' ORDER BY ORDINAL_POSITION");
$viewCols = [];
while ($r = $colsRes->fetch_assoc()) {
    $viewCols[] = $r['COLUMN_NAME'];
}

$ndCol = null;
foreach (['nd_cliente', 'ndCliente', 'nd_dms', 'ndDMS'] as $c) {
    if (in_array($c, $viewCols, true)) {
        $ndCol = $c;
        break;
    }
}
$agencyCol = null;
foreach (['id_agency', 'idAgency'] as $c) {
    if (in_array($c, $viewCols, true)) {
        $agencyCol = $c;
        break;
    }
}
if (!$ndCol) {
    fwrite(STDERR, "Error: Vista sin columna nd_cliente/ndCliente. Columnas: " . implode(', ', $viewCols) . "\n");
    exit(1);
}

// 3. Crear tabla nexfile_customers
$dwh->query("DROP TABLE IF EXISTS nexfile_customers");
$dwh->query("CREATE TABLE nexfile_customers AS SELECT * FROM vgd_dwh_prod.view_single_file_client WHERE 1 = 0");
$dwh->query("ALTER TABLE nexfile_customers ADD COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY FIRST");

// 4. Obtener N clientes de la vista (de las mismas agencias)
$agencies = array_unique(array_column($customerList, 'id_agency'));
$agList = "'" . implode("','", array_map([$vgd, 'real_escape_string'], $agencies)) . "'";
$agencyColEsc = $agencyCol ? "`" . str_replace('`', '``', $agencyCol) . "`" : '1';

$viewRes = $vgd->query("SELECT * FROM view_single_file_client WHERE $agencyColEsc IN ($agList) ORDER BY RAND() LIMIT $numClients");
$templates = [];
while ($r = $viewRes->fetch_assoc()) {
    $templates[] = $r;
}

// Si la vista devuelve menos, repetir o usar los que hay
while (count($templates) < $numClients) {
    $viewRes2 = $vgd->query("SELECT * FROM view_single_file_client WHERE $agencyColEsc IN ($agList) LIMIT 1");
    if ($viewRes2 && $row = $viewRes2->fetch_assoc()) {
        $templates[] = $row;
    } else {
        break;
    }
}

$inserted = 0;
$colList = implode(', ', array_map(fn($c) => "`" . str_replace('`', '``', $c) . "`", $viewCols));
$placeholders = implode(', ', array_fill(0, count($viewCols), '?'));

$stmt = $dwh->prepare("INSERT INTO nexfile_customers ($colList) VALUES ($placeholders)");
if (!$stmt) {
    fwrite(STDERR, "Error prepare: " . $dwh->error . "\n");
    exit(1);
}

for ($i = 0; $i < $numClients; $i++) {
    $customerDms = $customerList[$i]['customer_dms'] ?? $customerList[$i]['customerDMS'] ?? '';
    $template = $templates[$i % count($templates)] ?? $templates[0];
    $template[$ndCol] = $customerDms;
    if ($agencyCol) {
        $template[$agencyCol] = $customerList[$i]['id_agency'] ?? $customerList[$i]['idAgency'] ?? '';
    }

    $types = '';
    $vals = [];
    foreach ($viewCols as $col) {
        $v = $template[$col] ?? null;
        $vals[] = $v;
        $types .= is_int($v) ? 'i' : (is_float($v) ? 'd' : 's');
    }
    $stmt->bind_param($types, ...$vals);
    $stmt->execute();
    $inserted++;
    if ($inserted % 20 === 0) {
        echo "Insertados: $inserted\n";
    }
}

$stmt->close();
$dwh->close();
$vgd->close();

echo "Listo. $inserted clientes en nexfile_customers.\n";
