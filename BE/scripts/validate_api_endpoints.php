<?php
/**
 * Valida que las rutas de la API respondan correctamente (no 404/500).
 * Uso: php validate_api_endpoints.php [baseUrl] [--token=JWT]
 * Ejemplo: php validate_api_endpoints.php http://localhost:8080
 *          php validate_api_endpoints.php http://localhost:8080 --token=eyJ...
 */

$baseUrl = $argv[1] ?? 'http://localhost:8080';
$token = null;
foreach (array_slice($argv, 2) as $arg) {
    if (strpos($arg, '--token=') === 0) {
        $token = substr($arg, 8);
        break;
    }
}

$baseUrl = rtrim($baseUrl, '/');

// Lista de endpoints: método, path (sin /api), requiere auth típicamente
$endpoints = [
    // auth
    ['POST', 'auth/login'],
    ['POST', 'auth/update-email'],
    ['POST', 'auth/verify'],
    ['POST', 'auth/refresh'],
    ['POST', 'auth/logout'],
    // password
    ['POST', 'password/change'],
    ['GET', 'password/migration-status'],
    // agency
    ['GET', 'agency'],
    ['GET', 'agency?enabled=true'],
    ['GET', 'agency/search'],
    ['GET', 'agency/regions'],
    ['GET', 'agency/stats'],
    ['GET', 'agency/1'],
    // client-search
    ['GET', 'client-search/search'],
    ['GET', 'client-search/by-agency/1'],
    ['GET', 'client-search/1'],
    // process
    ['GET', 'process'],
    ['GET', 'process/search'],
    ['GET', 'process/stats'],
    ['GET', 'process/1'],
    // operation-type
    ['GET', 'operation-type'],
    ['GET', 'operation-type/search'],
    ['GET', 'operation-type/stats'],
    ['GET', 'operation-type/1'],
    // costumer-type
    ['GET', 'costumer-type'],
    ['GET', 'costumer-type/search'],
    ['GET', 'costumer-type/active'],
    ['GET', 'costumer-type/1'],
    // document-type
    ['GET', 'document-type'],
    ['GET', 'document-type/search'],
    ['GET', 'document-type/active'],
    ['GET', 'document-type/1'],
    // documento-requerido
    ['GET', 'documento-requerido'],
    ['GET', 'documento-requerido/stats'],
    // configuration-process
    ['GET', 'configuration-process/enabled'],
    ['GET', 'configuration-process/enabled-by-agency/1'],
    // user-activity-logs
    ['GET', 'user-activity-logs'],
    ['GET', 'user-activity-logs/stats'],
    // analytics (algunos representativos)
    ['GET', 'analytics/dashboard'],
    ['GET', 'analytics/widget-document-statistics'],
    ['GET', 'analytics/widget-process-statistics'],
    ['GET', 'analytics/widget-agency-statistics'],
    ['GET', 'analytics/widget-system-overview-metrics'],
    // file-status, file-sub-status, file-reason
    ['GET', 'file-status'],
    ['GET', 'file-status/active'],
    ['GET', 'file-status/1'],
    ['GET', 'file-sub-status'],
    ['GET', 'file-sub-status/active'],
    ['GET', 'file-reason'],
    ['GET', 'file-reason/active'],
    // file-extraordinary-reason
    ['GET', 'file-extraordinary-reason'],
    ['GET', 'file-extraordinary-reason/active'],
    // document
    ['GET', 'document'],
    ['GET', 'document/search'],
    ['GET', 'document/stats'],
    // user
    ['GET', 'user'],
    ['GET', 'user/search'],
    ['GET', 'user/stats'],
    ['GET', 'user/check-username'],
    ['GET', 'user/check-email'],
    // user-role
    ['GET', 'user-role'],
    ['GET', 'user-role/active'],
    // user profile (requiere auth)
    ['GET', 'user/profile'],
    ['GET', 'user/profile-image/get'],
    ['GET', 'user/profile-image/info'],
    // client
    ['GET', 'client/search'],
    // files
    ['GET', 'files/by-agency-client'],
    ['GET', 'files/by-client'],
    // documents
    ['GET', 'documents/required'],
    ['GET', 'documents/get-file-name'],
    // clients-validation
    ['GET', 'clients-validation/clientes'],
    ['GET', 'clients-validation/estadisticas'],
    ['GET', 'clients-validation/documentos'],
    ['GET', 'clients-validation/diagnostico'],
];

function request(string $baseUrl, string $method, string $path, ?string $token = null): array {
    $url = $baseUrl . '/api/' . $path;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 3,
CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_NOBODY => $method === 'HEAD' || $method === 'OPTIONS',
        CURLOPT_HTTPHEADER => array_filter([
            'Content-Type: application/json',
            'Accept: application/json',
            $token ? 'Authorization: Bearer ' . $token : null,
        ]),
    ]);
    if ($method === 'POST' && in_array($path, ['auth/login'], true)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => 'test@test.com',
            'password' => 'test',
        ]));
    }
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['code' => $code, 'body' => $body ?: '', 'error' => $err ?: null];
}

function checkOptions(string $baseUrl, string $path): bool {
    $r = request($baseUrl, 'OPTIONS', $path);
    return $r['code'] === 200 && empty($r['error']);
}

echo "=== Validación de APIs ===\n";
echo "Base URL: {$baseUrl}\n";
echo "Token: " . ($token ? 'Sí' : 'No') . "\n\n";

$ok = 0;
$fail = 0;
$skip = 0;
$details = [];

foreach ($endpoints as [$method, $path]) {
    $uri = "/api/{$path}";
    $r = request($baseUrl, $method, $path, $token);
    $code = $r['code'];
    $err = $r['error'];

    if ($err) {
        $status = 'ERROR';
        $msg = $err;
        $fail++;
    } elseif ($code === 404) {
        $status = '404';
        $msg = 'No encontrado';
        $fail++;
    } elseif ($code >= 500) {
        $status = '5xx';
        $msg = "HTTP {$code}";
        $fail++;
    } elseif ($code === 401 || $code === 403) {
        $status = 'AUTH';
        $msg = $code === 401 ? 'No autorizado' : 'Prohibido';
        $skip++;
    } elseif ($code >= 200 && $code < 400) {
        $status = 'OK';
        $msg = "HTTP {$code}";
        $ok++;
    } else {
        $status = 'OTHER';
        $msg = "HTTP {$code}";
        $ok++; // 400/422 = validación, consideramos ruta existente
    }

    $details[] = [$method, $uri, $status, $msg];
}

// OPTIONS en una muestra
echo "--- Preflight OPTIONS (muestra) ---\n";
$optPaths = ['agency', 'auth/login', 'user/profile', 'files/by-agency-client'];
foreach ($optPaths as $p) {
    $okOpt = checkOptions($baseUrl, $p);
    echo ($okOpt ? '  OK' : '  FAIL') . "  OPTIONS /api/{$p}\n";
}
echo "\n";

echo "--- Respuestas por endpoint ---\n";
foreach ($details as [$method, $uri, $status, $msg]) {
    $badge = $status === 'OK' ? '  OK ' : ($status === 'AUTH' ? ' AUTH' : 'FAIL');
    echo sprintf("  %s  %-6s %-50s %s\n", $badge, $method, $uri, $msg);
}

echo "\n--- Resumen ---\n";
echo "  OK:   {$ok}\n";
echo "  AUTH: {$skip} (requieren token)\n";
echo "  FAIL: {$fail}\n";

exit($fail > 0 ? 1 : 0);
