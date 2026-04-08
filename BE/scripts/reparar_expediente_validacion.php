#!/usr/bin/env php
<?php
/**
 * Diagnóstico y reparación de expedientes (File) para que aparezcan en la pantalla de validación.
 *
 * Requisito del listado: Client existente, HeaderClient (IdClient = File.IdClient) y
 * Client_Total_Relation para la misma agencia del expediente.
 *
 * Caso típico: File.IdClient apunta a un Client.Id inexistente o falta HeaderClient/CTR.
 * Solución A (recomendada): enlazar el expediente al Client correcto usando la vista
 * view_client_relations con el nd cliente DMS (--ndCliente) y la agencia.
 *
 * Uso:
 *   php scripts/reparar_expediente_validacion.php --pedido=19759 --agencia=7
 *   php scripts/reparar_expediente_validacion.php --pedido=19759 --agencia=7 --ndCliente=12345 --apply
 *   php scripts/reparar_expediente_validacion.php --file=17457 --ndCliente=12345 --apply
 *
 * Opciones:
 *   --pedido       IdOrderTotal (número de pedido DMS)
 *   --agencia      Agency.Id interno (ej. 7 = KIA ALTARIA)
 *   --file         Id del expediente (File.Id); si se omite con --pedido, se elige un File (ver --prefer-estado)
 *   --ndCliente    IdTotalDealer / nd DMS del cliente; debe existir fila en view_client_relations para esa agencia
 *   --apply        Ejecutar cambios (sin esto solo se muestra diagnóstico y SQL propuesto)
 *   --prefer-estado IdCurrentState preferido si hay varios File mismo pedido (default: 1 = Integración)
 *
 * Conexión: intenta BE/config/database-config.json; si no existe, usa valores por defecto del script.
 */

declare(strict_types=1);

function loadMysqliFromConfig(): mysqli
{
    $paths = [
        __DIR__ . '/../config/database-config.json',
        __DIR__ . '/../app/Config/database-config.json',
    ];
    $hostname = getenv('DB_HOST') ?: '127.0.0.1';
    $port = (int) (getenv('DB_PORT') ?: 3306);
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';
    $database = getenv('DB_NAME') ?: 'single_file';

    foreach ($paths as $p) {
        if (!is_readable($p)) {
            continue;
        }
        $json = json_decode((string) file_get_contents($p), true);
        if (!empty($json['database'])) {
            $d = $json['database'];
            $hostname = $d['hostname'] ?? $hostname;
            $port = (int) ($d['port'] ?? $port);
            $username = $d['username'] ?? $username;
            $password = $d['password'] ?? $password;
            $database = $d['database'] ?? $database;
            break;
        }
    }

    $mysqli = @new mysqli($hostname, $username, $password, $database, $port);
    if ($mysqli->connect_error) {
        $databaseAlt = 'singlefile_db';
        $mysqli = new mysqli($hostname, $username, $password, $databaseAlt, $port);
        if ($mysqli->connect_error) {
            throw new RuntimeException('Conexión: ' . $mysqli->connect_error);
        }
    }
    $mysqli->set_charset('utf8mb4');

    return $mysqli;
}

function parseArgs(array $argv): array
{
    $o = [
        'file' => null,
        'pedido' => null,
        'agencia' => null,
        'ndCliente' => null,
        'apply' => false,
        'prefer_estado' => 1,
    ];
    foreach ($argv as $i => $arg) {
        if ($i === 0) {
            continue;
        }
        if ($arg === '--apply') {
            $o['apply'] = true;
            continue;
        }
        if (preg_match('/^--file=(.+)$/', $arg, $m)) {
            $o['file'] = (int) trim($m[1]);
            continue;
        }
        if (preg_match('/^--pedido=(.+)$/', $arg, $m)) {
            $o['pedido'] = trim($m[1]);
            continue;
        }
        if (preg_match('/^--agencia=(.+)$/', $arg, $m)) {
            $o['agencia'] = (int) trim($m[1]);
            continue;
        }
        if (preg_match('/^--ndCliente=(.+)$/', $arg, $m)) {
            $o['ndCliente'] = trim($m[1]);
            continue;
        }
        if (preg_match('/^--prefer-estado=(.+)$/', $arg, $m)) {
            $o['prefer_estado'] = (int) trim($m[1]);
            continue;
        }
        if ($arg === '--help' || $arg === '-h') {
            $o['help'] = true;
        }
    }

    return $o;
}

function printHelp(): void
{
    $f = basename(__FILE__);
    echo <<<TXT

{$f} — Reparar expediente para validación (Mesa de control)

  php {$f} --pedido=19759 --agencia=7 [--file=17457] [--ndCliente=ND] [--apply]

Variables de entorno opcionales (si no hay database-config.json):
  DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME

TXT;
}

$opts = parseArgs($argv);
if (!empty($opts['help']) || ($opts['file'] === null || $opts['file'] <= 0) && ($opts['pedido'] === null || $opts['pedido'] === '' || ($opts['agencia'] ?? 0) <= 0)) {
    printHelp();
    if (empty($opts['help'])) {
        fwrite(STDERR, "Error: indique --file=ID o --pedido + --agencia.\n");
        exit(1);
    }
    exit(0);
}

try {
    $mysqli = loadMysqliFromConfig();
} catch (Throwable $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}

$idFile = $opts['file'] ?? 0;
$idAgency = $opts['agencia'] ?? 0;
$pedidoNorm = $opts['pedido'] !== null && $opts['pedido'] !== '' ? trim((string) $opts['pedido']) : '';

if ($idFile <= 0) {
    if ($pedidoNorm === '' || $idAgency <= 0) {
        fwrite(STDERR, "Con --pedido hace falta --agencia (Agency.Id interno).\n");
        exit(1);
    }
    $st = $mysqli->prepare(
        'SELECT f.Id, f.IdClient, f.IdAgency, f.IdOrderTotal, f.IdCurrentState, f.IdProcess, fs.Name AS estado_nombre
         FROM File f
         LEFT JOIN File_Status fs ON fs.Id = f.IdCurrentState
         WHERE f.IdAgency = ? AND TRIM(CAST(f.IdOrderTotal AS CHAR)) = ?
         ORDER BY (f.IdCurrentState = ?) DESC, f.Id DESC'
    );
    $pref = $opts['prefer_estado'];
    $st->bind_param('isi', $idAgency, $pedidoNorm, $pref);
    $st->execute();
    $res = $st->get_result();
    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }
    $st->close();
    if (count($rows) === 0) {
        fwrite(STDERR, "No hay File con pedido \"{$pedidoNorm}\" y IdAgency={$idAgency}.\n");
        exit(1);
    }
    if (count($rows) > 1) {
        echo "⚠️  Hay " . count($rows) . " expedientes con el mismo pedido y agencia:\n";
        foreach ($rows as $r) {
            echo "    File.Id={$r['Id']}  IdCurrentState={$r['IdCurrentState']} ({$r['estado_nombre']})  IdProcess={$r['IdProcess']}\n";
        }
        $picked = $rows[0];
        foreach ($rows as $r) {
            if ((int) $r['IdCurrentState'] === $opts['prefer_estado']) {
                $picked = $r;
                break;
            }
        }
        $idFile = (int) $picked['Id'];
        echo "→ Se usa File.Id={$idFile} (preferencia estado {$opts['prefer_estado']}). Use --file= para otro.\n\n";
    } else {
        $idFile = (int) $rows[0]['Id'];
    }
}

echo "═══════════════════════════════════════════════════════════════\n";
echo "  Expediente File.Id = {$idFile}\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

$sqlFile = 'SELECT f.Id, f.IdClient, f.IdAgency, f.IdOrderTotal, f.IdCurrentState, f.IdProcess,
       a.Name AS agencia, p.Name AS proceso, p.Enabled AS proceso_ok, fs.Name AS estado
       FROM File f
       INNER JOIN Agency a ON a.Id = f.IdAgency
       LEFT JOIN Process p ON p.Id = f.IdProcess
       LEFT JOIN File_Status fs ON fs.Id = f.IdCurrentState
       WHERE f.Id = ?';
$st = $mysqli->prepare($sqlFile);
$st->bind_param('i', $idFile);
$st->execute();
$file = $st->get_result()->fetch_assoc();
$st->close();

if (!$file) {
    fwrite(STDERR, "File.Id={$idFile} no existe.\n");
    exit(1);
}

$idClient = (int) $file['IdClient'];
$idAgency = (int) $file['IdAgency'];

echo "Pedido DMS (IdOrderTotal): {$file['IdOrderTotal']}\n";
echo "Agencia: {$file['agencia']} (IdAgency={$idAgency})\n";
echo "Proceso: {$file['proceso']} (habilitado: {$file['proceso_ok']})\n";
echo "Estado: {$file['estado']} (IdCurrentState={$file['IdCurrentState']})\n";
echo "File.IdClient (debe ser Client.Id): {$idClient}\n\n";

$clientOk = false;
$st = $mysqli->prepare('SELECT Id, RazonSocial, Name, LastName FROM Client WHERE Id = ? LIMIT 1');
$st->bind_param('i', $idClient);
$st->execute();
$client = $st->get_result()->fetch_assoc();
$st->close();
if ($client) {
    $clientOk = true;
    $nombre = trim((string) ($client['RazonSocial'] ?? ''));
    if ($nombre === '') {
        $nombre = trim(($client['Name'] ?? '') . ' ' . ($client['LastName'] ?? ''));
    }
    echo "✅ Client existe: Id={$client['Id']} — {$nombre}\n";
} else {
    echo "❌ Client NO existe para Id={$idClient} (expediente huérfano).\n";
}

$idHeader = null;
$st = $mysqli->prepare('SELECT Id FROM HeaderClient WHERE IdClient = ? LIMIT 1');
$st->bind_param('i', $idClient);
$st->execute();
$rowHc = $st->get_result()->fetch_assoc();
$st->close();
if ($rowHc) {
    $idHeader = (int) $rowHc['Id'];
    echo "✅ HeaderClient: Id={$idHeader}\n";
} else {
    echo "❌ No hay HeaderClient para IdClient={$idClient}\n";
}

$ctrOk = false;
if ($idHeader !== null) {
    $st = $mysqli->prepare(
        'SELECT Id, IdTotalDealer FROM Client_Total_Relation WHERE idHeaderClient = ? AND IdAgency = ? LIMIT 1'
    );
    $st->bind_param('ii', $idHeader, $idAgency);
    $st->execute();
    $ctr = $st->get_result()->fetch_assoc();
    $st->close();
    if ($ctr) {
        $ctrOk = true;
        echo "✅ Client_Total_Relation: Id={$ctr['Id']} nd={$ctr['IdTotalDealer']}\n";
    } else {
        echo "❌ No hay Client_Total_Relation para este HeaderClient y IdAgency={$idAgency}\n";
    }
}

$cancelled = ((int) $file['IdCurrentState'] === 5);
if ($cancelled) {
    echo "\n⚠️  Expediente en estado Cancelado: no aparece en validación con filtro de no cancelados.\n";
}

$procOk = (int) ($file['proceso_ok'] ?? 0) === 1;
if (!$procOk) {
    echo "\n⚠️  Proceso deshabilitado: el listado de validación exige p.Enabled = 1.\n";
}

$wouldShow = $clientOk && $idHeader !== null && $ctrOk && !$cancelled && $procOk;
echo "\n--- Resumen ---\n";
echo $wouldShow
    ? "✅ Cumple condiciones para aparecer en validación (con filtros por defecto).\n"
    : "❌ NO cumple; hay que corregir datos o estado.\n";

$ndCliente = $opts['ndCliente'] ?? '';
if ($ndCliente === '') {
    echo "\nPara enlazar desde view_client_relations, ejecute de nuevo con:\n";
    echo "  --ndCliente=<nd_DMS_del_cliente_en_esta_agencia>\n";
    echo "Ese nd debe existir en la vista para idAgencia={$idAgency} (mismo criterio que el API de integración).\n";
    $mysqli->close();
    exit($wouldShow ? 0 : 2);
}

echo "\n--- Búsqueda en view_client_relations ---\n";
$st = $mysqli->prepare(
    'SELECT idCliente, IdHeaderClient, ndCliente, cliente
     FROM view_client_relations
     WHERE TRIM(CAST(ndCliente AS CHAR)) = ? AND idAgency = ?
     LIMIT 1'
);
$st->bind_param('si', $ndCliente, $idAgency);
$st->execute();
$vrow = $st->get_result()->fetch_assoc();
$st->close();

if (!$vrow || empty($vrow['idCliente'])) {
    fwrite(STDERR, "No hay fila en view_client_relations para ndCliente=\"{$ndCliente}\" e idAgency={$idAgency}.\n");
    fwrite(STDERR, "Importe o cree el cliente (HeaderClient + Client_Total_Relation) antes de enlazar.\n");
    $mysqli->close();
    exit(1);
}

$idClienteVista = (int) $vrow['idCliente'];
echo "Vista: idCliente (Client.Id) = {$idClienteVista}, ndCliente={$vrow['ndCliente']}, cliente={$vrow['cliente']}\n";

$updateSql = sprintf(
    'UPDATE `File` SET IdClient = %d WHERE Id = %d AND IdAgency = %d;',
    $idClienteVista,
    $idFile,
    $idAgency
);
echo "\nSQL propuesto:\n{$updateSql}\n";

if (!$opts['apply']) {
    echo "\n(modo simulación; añada --apply para ejecutar)\n";
    $mysqli->close();
    exit(0);
}

$st = $mysqli->prepare('UPDATE `File` SET IdClient = ? WHERE Id = ? AND IdAgency = ?');
$st->bind_param('iii', $idClienteVista, $idFile, $idAgency);
if (!$st->execute()) {
    fwrite(STDERR, "Error UPDATE: " . $st->error . "\n");
    exit(1);
}
$affected = $st->affected_rows;
$st->close();
echo "\n✅ UPDATE ejecutado. Filas afectadas: {$affected}\n";
echo "Verifique en validación (agencia + proceso) que el expediente {$idFile} sea visible.\n";

$mysqli->close();
exit(0);
