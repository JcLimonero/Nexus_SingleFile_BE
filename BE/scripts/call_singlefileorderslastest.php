#!/usr/bin/env php
<?php
/**
 * Llamada independiente a Vanguardia singlefileorderslastest (misma construcción que Support::fetchClienteNdFromVanguardiaOrdersLastest).
 *
 * Uso:
 *   php scripts/call_singlefileorderslastest.php --id-agency=DMS --order-dms=PEDIDO
 *   php scripts/call_singlefileorderslastest.php --id-agency=DMS --order-dms=PEDIDO --connectionstring=...
 *   php scripts/call_singlefileorderslastest.php ... --dry-run    # solo muestra URL y cabeceras, no hace GET
 *
 * Opcional: --customer-dms= solo si necesitas probar ese filtro (no se usa en el panel de soporte).
 *
 * Variables de entorno (desde BE/.env): VANGUARDIA_PROVIDER_TOKEN, opcionalmente VANGUARDIA_ORDERS_URL
 */

declare(strict_types=1);

$root = dirname(__DIR__);
chdir($root);

require $root . '/vendor/autoload.php';

if (is_file($root . '/.env')) {
    $dotenv = new CodeIgniter\Config\DotEnv($root);
    $dotenv->load();
}

$opts = getopt('', [
    'id-agency:',
    'order-dms:',
    'customer-dms::',
    'connectionstring::',
    'base-url::',
    'perpage::',
    'dry-run',
    'help',
]);

if (isset($opts['help']) || $opts === false) {
    fwrite(STDERR, <<<TXT
singlefileorderslastest — prueba independiente (igual query que panel soporte)

Opciones:
  --id-agency=        IdAgency DMS (Agency.IdAgency)
  --order-dms=        Número de pedido DMS
  --connectionstring= Opcional (Agency.AgencyConnection)
  --customer-dms=     Opcional; solo para pruebas (el panel no envía customerDMS)
  --base-url=         Sustituye VANGUARDIA_ORDERS_URL
  --perpage=          Por defecto 50
  --dry-run           Imprime URL y cabeceras; no ejecuta la petición
  --help              Esta ayuda

TXT);
    exit(isset($opts['help']) ? 0 : 1);
}

$idAgency = trim((string) ($opts['id-agency'] ?? ''));
$orderDms = trim((string) ($opts['order-dms'] ?? ''));
$customerDms = isset($opts['customer-dms']) ? trim((string) $opts['customer-dms']) : '';
$connection = isset($opts['connectionstring']) ? trim((string) $opts['connectionstring']) : '';
$perpage = isset($opts['perpage']) ? max(1, (int) $opts['perpage']) : 50;
$dryRun = isset($opts['dry-run']);

if ($idAgency === '' || $orderDms === '') {
    fwrite(STDERR, "Faltan --id-agency o --order-dms.\n");
    exit(1);
}

$base = isset($opts['base-url']) ? trim((string) $opts['base-url']) : (getenv('VANGUARDIA_ORDERS_URL') ?: 'https://apisvanguardia.com:400/vgd/singlefileorderslastest');
$base = $base !== '' ? $base : 'https://apisvanguardia.com:400/vgd/singlefileorderslastest';

$query = [
    'idAgency' => $idAgency,
    'order_dms' => $orderDms,
    'perpage' => $perpage,
];
if ($connection !== '') {
    $query['connectionstring'] = $connection;
}
if ($customerDms !== '') {
    $query['customerDMS'] = $customerDms;
}

$url = rtrim($base, '?&') . '?' . http_build_query($query);

$token = getenv('VANGUARDIA_PROVIDER_TOKEN') ?: '';
$token = is_string($token) ? trim($token) : '';

echo "=== singlefileorderslastest (independiente) ===\n\n";
echo "Query params (orden lógico):\n";
echo json_encode($query, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
echo "URL completa:\n{$url}\n\n";

if ($token === '') {
    echo "AVISO: VANGUARDIA_PROVIDER_TOKEN vacío; la API puede responder 401.\n\n";
} else {
    $masked = strlen($token) > 12 ? substr($token, 0, 8) . '…' . substr($token, -4) : '***';
    echo "X-Provider-Token: {$masked} (longitud " . strlen($token) . ")\n\n";
}

if ($dryRun) {
    echo "--dry-run: no se envió la petición.\n";
    exit(0);
}

if ($token === '') {
    fwrite(STDERR, "Sin token no tiene sentido llamar; use .env o export VANGUARDIA_PROVIDER_TOKEN=...\n");
    exit(1);
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'X-Provider-Token: ' . $token,
        'Accept: application/json',
        'Accept-Encoding: identity',
        'User-Agent: SingleFile-scripts/call_singlefileorderslastest',
    ],
    CURLOPT_SSL_VERIFYPEER => true,
]);

$body = curl_exec($ch);
$errno = curl_errno($ch);
$err = curl_error($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP {$httpCode}\n";
if ($errno !== 0) {
    echo "cURL error {$errno}: {$err}\n";
    exit(1);
}

$decoded = json_decode((string) $body, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
    echo "\nCuerpo (JSON formateado):\n";
    echo json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} else {
    echo "\nCuerpo (texto, primeros 4000 chars):\n";
    echo substr((string) $body, 0, 4000) . (strlen((string) $body) > 4000 ? "\n…" : '') . "\n";
}

exit($httpCode >= 200 && $httpCode < 300 ? 0 : 2);
