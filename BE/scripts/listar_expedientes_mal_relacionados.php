#!/usr/bin/env php
<?php
/**
 * Lista expedientes (File) mal relacionados respecto al listado de validación y sugiere
 * el Client.Id con el que deberían enlazarse cuando se puede inferir.
 *
 * Fuentes de sugerencia (en orden de prioridad):
 *  1) otro_File_mismo_pedido: existe otro File con el mismo IdAgency + IdOrderTotal ya bien relacionado.
 *  2) CTR_nd_igual_pedido: existe Client_Total_Relation en esa agencia cuyo IdTotalDealer (nd DMS)
 *     coincide con el número de pedido (heurística; en algunos dealers pedido ≠ nd cliente).
 *  3) sin_sugerencia: no se pudo inferir (revisar manualmente / importación Vanguardia).
 *
 * Uso:
 *   php scripts/listar_expedientes_mal_relacionados.php
 *   php scripts/listar_expedientes_mal_relacionados.php --agencia=7 --csv
 *
 * Conexión: BE/config/database-config.json o DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
 */

declare(strict_types=1);

function loadMysqli(): mysqli
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
        $mysqli = new mysqli($hostname, $username, $password, 'singlefile_db', $port);
        if ($mysqli->connect_error) {
            throw new RuntimeException('Conexión: ' . $mysqli->connect_error);
        }
    }
    $mysqli->set_charset('utf8mb4');

    return $mysqli;
}

function nombreCliente(mysqli $mysqli, int $idClient): string
{
    $st = $mysqli->prepare('SELECT RazonSocial, Name, LastName, MotherLastName FROM Client WHERE Id = ? LIMIT 1');
    $st->bind_param('i', $idClient);
    $st->execute();
    $r = $st->get_result()->fetch_assoc();
    $st->close();
    if (!$r) {
        return '';
    }
    $rz = trim((string) ($r['RazonSocial'] ?? ''));
    if ($rz !== '') {
        return $rz;
    }

    return trim(
        ($r['Name'] ?? '') . ' ' . ($r['LastName'] ?? '') . ' ' . ($r['MotherLastName'] ?? '')
    );
}

$agencia = null;
$csv = false;
$excluirCancelados = true;
$limite = 0;

foreach ($argv as $i => $arg) {
    if ($i === 0) {
        continue;
    }
    if ($arg === '--csv') {
        $csv = true;
        continue;
    }
    if (preg_match('/^--agencia=(\d+)$/', $arg, $m)) {
        $agencia = (int) $m[1];
        continue;
    }
    if (preg_match('/^--limite=(\d+)$/', $arg, $m)) {
        $limite = (int) $m[1];
        continue;
    }
    if (preg_match('/^--solo-cancelados=(0|1)$/', $arg, $m)) {
        $excluirCancelados = $m[1] === '0';
        continue;
    }
    if ($arg === '--help' || $arg === '-h') {
        echo "Uso: php " . basename(__FILE__) . " [--agencia=ID] [--csv] [--limite=N] [--solo-cancelados=0|1]\n";
        exit(0);
    }
}

$mysqli = loadMysqli();

$sql = "
SELECT
    f.Id AS id_file,
    f.IdOrderTotal AS pedido,
    f.IdAgency AS id_agencia,
    a.Name AS agencia,
    f.IdClient AS id_client_file,
    f.IdCurrentState AS id_estado,
    fs.Name AS estado,
    p.Name AS proceso,
    p.Enabled AS proceso_habilitado,
    CASE
        WHEN c.Id IS NULL THEN 'Client inexistente (File.IdClient huérfano)'
        WHEN hc.Id IS NULL THEN 'Sin HeaderClient para ese Client.Id'
        WHEN ctr.Id IS NULL THEN 'Sin Client_Total_Relation (cliente-agencia)'
        ELSE 'OK'
    END AS motivo,
    (
        SELECT f2.IdClient
        FROM File f2
        INNER JOIN Client c2 ON c2.Id = f2.IdClient
        INNER JOIN HeaderClient hc2 ON hc2.IdClient = f2.IdClient
        INNER JOIN Client_Total_Relation ctr2 ON ctr2.idHeaderClient = hc2.Id AND ctr2.IdAgency = f2.IdAgency
        WHERE f2.IdAgency = f.IdAgency
          AND TRIM(CAST(f2.IdOrderTotal AS CHAR)) = TRIM(CAST(f.IdOrderTotal AS CHAR))
          AND f2.Id <> f.Id
        ORDER BY f2.Id
        LIMIT 1
    ) AS id_sugerido_por_hermano,
    (
        SELECT hc3.IdClient
        FROM Client_Total_Relation ctr3
        INNER JOIN HeaderClient hc3 ON hc3.Id = ctr3.idHeaderClient
        WHERE ctr3.IdAgency = f.IdAgency
          AND TRIM(CAST(ctr3.IdTotalDealer AS CHAR)) = TRIM(CAST(f.IdOrderTotal AS CHAR))
        LIMIT 1
    ) AS id_sugerido_por_ctr_nd,
    (
        SELECT TRIM(CAST(ctr3.IdTotalDealer AS CHAR))
        FROM Client_Total_Relation ctr3
        INNER JOIN HeaderClient hc3 ON hc3.Id = ctr3.idHeaderClient
        WHERE ctr3.IdAgency = f.IdAgency
          AND TRIM(CAST(ctr3.IdTotalDealer AS CHAR)) = TRIM(CAST(f.IdOrderTotal AS CHAR))
        LIMIT 1
    ) AS nd_ctr_coincide_pedido
FROM File f
INNER JOIN Agency a ON a.Id = f.IdAgency
LEFT JOIN Client c ON c.Id = f.IdClient
LEFT JOIN HeaderClient hc ON hc.IdClient = f.IdClient
LEFT JOIN Client_Total_Relation ctr
    ON ctr.idHeaderClient = hc.Id
    AND ctr.IdAgency = f.IdAgency
LEFT JOIN File_Status fs ON fs.Id = f.IdCurrentState
LEFT JOIN Process p ON p.Id = f.IdProcess
WHERE
    c.Id IS NULL
    OR hc.Id IS NULL
    OR ctr.Id IS NULL
";

$params = [];
$types = '';

if ($agencia !== null) {
    $sql .= ' AND f.IdAgency = ?';
    $params[] = $agencia;
    $types .= 'i';
}

if ($excluirCancelados) {
    $sql .= ' AND f.IdCurrentState <> 5';
}

$sql .= ' ORDER BY f.IdAgency, f.IdOrderTotal, f.Id';

if ($limite > 0) {
    $sql .= ' LIMIT ' . (int) $limite;
}

if ($params === []) {
    $result = $mysqli->query($sql);
} else {
    $st = $mysqli->prepare($sql);
    $st->bind_param($types, ...$params);
    $st->execute();
    $result = $st->get_result();
}

if (!$result) {
    fwrite(STDERR, $mysqli->error . "\n");
    exit(1);
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $idH = isset($row['id_sugerido_por_hermano']) && $row['id_sugerido_por_hermano'] !== null && $row['id_sugerido_por_hermano'] !== ''
        ? (int) $row['id_sugerido_por_hermano']
        : 0;
    $idC = isset($row['id_sugerido_por_ctr_nd']) && $row['id_sugerido_por_ctr_nd'] !== null && $row['id_sugerido_por_ctr_nd'] !== ''
        ? (int) $row['id_sugerido_por_ctr_nd']
        : 0;

    $idFinal = 0;
    $fuente = 'sin_sugerencia';
    if ($idH > 0) {
        $idFinal = $idH;
        $fuente = 'otro_File_mismo_pedido';
    } elseif ($idC > 0) {
        $idFinal = $idC;
        $fuente = 'CTR_nd_igual_pedido';
    }

    $row['id_cliente_sugerido'] = $idFinal > 0 ? (string) $idFinal : '';
    $row['fuente_sugerencia'] = $fuente;
    $row['nombre_cliente_sugerido'] = $idFinal > 0 ? nombreCliente($mysqli, $idFinal) : '';
    if ($fuente === 'CTR_nd_igual_pedido' && !empty($row['nd_ctr_coincide_pedido'])) {
        $row['nota_nd'] = 'nd en CTR=' . $row['nd_ctr_coincide_pedido'];
    } else {
        $row['nota_nd'] = '';
    }

    unset($row['id_sugerido_por_hermano'], $row['id_sugerido_por_ctr_nd'], $row['nd_ctr_coincide_pedido']);
    $rows[] = $row;
}

$count = count($rows);

if ($csv) {
    $cols = [
        'id_file', 'pedido', 'id_agencia', 'agencia', 'id_client_file', 'id_estado', 'estado',
        'proceso', 'proceso_habilitado', 'motivo',
        'id_cliente_sugerido', 'nombre_cliente_sugerido', 'fuente_sugerencia', 'nota_nd',
    ];
    echo implode(';', $cols) . "\n";
    foreach ($rows as $r) {
        $line = [];
        foreach ($cols as $c) {
            $v = $r[$c] ?? '';
            $v = str_replace(["\r", "\n", ';'], [' ', ' ', ','], (string) $v);
            $line[] = $v;
        }
        echo implode(';', $line) . "\n";
    }
} else {
    echo "Expedientes mal relacionados: {$count}\n";
    if ($agencia !== null) {
        echo "Filtro IdAgency = {$agencia}\n";
    }
    if ($excluirCancelados) {
        echo "(Excluye cancelados; --solo-cancelados=0 para incluirlos)\n";
    }
    echo "\nSugerencias: (1) otro expediente válido con mismo pedido+agencia; (2) CTR con nd = número de pedido (revisar).\n\n";
    echo str_repeat('=', 140) . "\n";
    printf(
        "%-7s %-10s %-4s %-18s %-9s %-6s %-14s %-5s %-32s %-10s %-26s %-22s %s\n",
        'File.Id',
        'Pedido',
        'Ag',
        'Agencia',
        'IdClient',
        'Est',
        'Estado',
        'Proc?',
        'Motivo',
        'IdClientOK',
        'Cliente sugerido',
        'Fuente',
        'Nota'
    );
    echo str_repeat('-', 140) . "\n";
    foreach ($rows as $r) {
        printf(
            "%-7s %-10s %-4s %-18s %-9s %-6s %-14s %-5s %-32s %-10s %-26s %-22s %s\n",
            (string) $r['id_file'],
            substr((string) ($r['pedido'] ?? ''), 0, 10),
            (string) $r['id_agencia'],
            substr((string) ($r['agencia'] ?? ''), 0, 18),
            (string) ($r['id_client_file'] ?? ''),
            (string) ($r['id_estado'] ?? ''),
            substr((string) ($r['estado'] ?? ''), 0, 14),
            isset($r['proceso_habilitado']) ? (string) (int) $r['proceso_habilitado'] : '',
            substr((string) ($r['motivo'] ?? ''), 0, 32),
            $r['id_cliente_sugerido'] !== '' ? $r['id_cliente_sugerido'] : '—',
            substr((string) ($r['nombre_cliente_sugerido'] ?? ''), 0, 26),
            substr((string) ($r['fuente_sugerencia'] ?? ''), 0, 22),
            substr((string) ($r['nota_nd'] ?? ''), 0, 30)
        );
    }
    echo str_repeat('=', 140) . "\n";
    echo "Total: {$count}\n";
}

$mysqli->close();
exit(0);
