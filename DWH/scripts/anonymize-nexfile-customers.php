#!/usr/bin/env php
<?php
/**
 * Anonimiza datos sensibles en dwh.nexfile_customers
 * Mantiene ndCliente (enlace con nexfile_orders) y connectionstring por idAgency
 *
 * Uso: php scripts/anonymize-nexfile-customers.php
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
$faker->seed(12346);

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

// Obtener columnas (solo string para anonimizar)
$colsRes = $mysqli->query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_customers' AND COLUMN_NAME != 'id' ORDER BY ORDINAL_POSITION");
$allCols = [];
$stringCols = [];
$numericTypes = ['int', 'bigint', 'smallint', 'tinyint', 'mediumint', 'decimal', 'float', 'double'];
while ($r = $colsRes->fetch_assoc()) {
    $allCols[] = $r['COLUMN_NAME'];
    if (!in_array(strtolower($r['DATA_TYPE']), $numericTypes, true)) {
        $stringCols[] = $r['COLUMN_NAME'];
    }
}

function findCol(array $cols, array $candidates): ?string {
    foreach ($candidates as $c) {
        if (in_array($c, $cols, true)) {
            return $c;
        }
    }
    return null;
}

$nameCol = findCol($stringCols, ['name', 'nombre', 'Name', 'FirstName', 'firstName']);
$paternalCol = findCol($stringCols, ['paternal_surname', 'last_name', 'apellidoPaterno', 'LastName', 'lastName']);
$maternalCol = findCol($stringCols, ['maternal_surname', 'mother_last_name', 'apellidoMaterno', 'MotherLastName', 'motherLastName']);
$bussinesCol = findCol($stringCols, ['bussines_name', 'business_name', 'razonSocial', 'RazonSocial', 'BusinessName']);
$rfcCol = findCol($stringCols, ['rfc', 'RFC']);
$curpCol = findCol($stringCols, ['curp', 'CURP']);
$phoneCol = findCol($stringCols, ['phone', 'telefono', 'TelNumber', 'telNumber', 'Phone']);
$mobileCol = findCol($stringCols, ['mobile_phone', 'telefono2', 'TelNumber2', 'telNumber2', 'MobilePhone']);
$mailCol = findCol($stringCols, ['mail', 'email', 'Email', 'Mail']);
$connCol = findCol($stringCols, ['connection_string', 'connectionstring', 'ConnectionString']);
$agencyCol = findCol($allCols, ['id_agency', 'idAgency']);

$result = $mysqli->query("SELECT id FROM nexfile_customers");
if (!$result) {
    fwrite(STDERR, "Error: " . $mysqli->error . "\n");
    exit(1);
}

$updates = [];
$params = [];
if ($nameCol) $updates[] = "`$nameCol` = ?";
if ($paternalCol) $updates[] = "`$paternalCol` = ?";
if ($maternalCol) $updates[] = "`$maternalCol` = ?";
if ($bussinesCol) $updates[] = "`$bussinesCol` = ?";
if ($rfcCol) $updates[] = "`$rfcCol` = ?";
if ($curpCol) $updates[] = "`$curpCol` = ?";
if ($phoneCol) $updates[] = "`$phoneCol` = ?";
if ($mobileCol) $updates[] = "`$mobileCol` = ?";
if ($mailCol) $updates[] = "`$mailCol` = ?";
if ($connCol) $updates[] = "`$connCol` = ?";

$tipoCol = findCol($stringCols, ['client_type']) ?? (in_array('client_type', $allCols, true) ? 'client_type' : null);
if ($tipoCol) $updates[] = "`$tipoCol` = ?";

if (empty($updates)) {
    fwrite(STDERR, "Error: No se encontraron columnas para anonimizar. Columnas string: " . implode(', ', $stringCols) . "\n");
    exit(1);
}

$sql = "UPDATE nexfile_customers SET " . implode(', ', $updates) . " WHERE id = ?";
$stmt = $mysqli->prepare($sql);
if (!$stmt) {
    fwrite(STDERR, "Error prepare: " . $mysqli->error . "\n");
    exit(1);
}

$rows = [];
$res2 = $mysqli->query("SELECT id, " . ($agencyCol ? "`$agencyCol`" : "NULL") . " AS id_agency FROM nexfile_customers");
while ($r = $res2->fetch_assoc()) {
    $rows[] = $r;
}

$count = 0;
foreach ($rows as $row) {
    $id = $row['id'];
    $idAgency = trim((string) ($row['id_agency'] ?? $row['idAgency'] ?? ''));
    $connectionstring = $agencyConnection[$idAgency] ?? 'KiaConnection';

    // ~30% persona moral (empresa), 70% persona física (individual)
    $esEmpresa = $faker->boolean(30);

    if ($esEmpresa) {
        $tipoVal = 'moral';
        $nameVal = '';
        $paternalVal = '';
        $maternalVal = '';
        $bussinesVal = $faker->company;
        $rfcVal = $faker->regexify('[A-Z]{3}[0-9]{6}[A-Z0-9]{3}'); // RFC persona moral
        $curpVal = ''; // Empresas no tienen CURP
    } else {
        $tipoVal = 'fisica';
        $nameVal = $faker->firstName;
        $paternalVal = $faker->lastName;
        $maternalVal = $faker->lastName;
        $bussinesVal = trim("$nameVal $paternalVal $maternalVal"); // Persona física: nombre completo
        $rfcVal = $faker->regexify('[A-Z]{4}[0-9]{6}[A-Z0-9]{3}'); // RFC persona física
        $curpVal = $faker->regexify('[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}');
    }

    $bind = [];
    $types = '';
    if ($nameCol) { $bind[] = $nameVal; $types .= 's'; }
    if ($paternalCol) { $bind[] = $paternalVal; $types .= 's'; }
    if ($maternalCol) { $bind[] = $maternalVal; $types .= 's'; }
    if ($bussinesCol) { $bind[] = $bussinesVal; $types .= 's'; }
    if ($rfcCol) { $bind[] = $rfcVal; $types .= 's'; }
    if ($curpCol) { $bind[] = $curpVal; $types .= 's'; }
    if ($phoneCol) { $bind[] = $faker->numerify('55########'); $types .= 's'; }
    if ($mobileCol) { $bind[] = $faker->numerify('55########'); $types .= 's'; }
    if ($mailCol) { $bind[] = $faker->email; $types .= 's'; }
    if ($connCol) { $bind[] = $connectionstring; $types .= 's'; }
    if ($tipoCol) { $bind[] = $tipoVal; $types .= 's'; }
    $bind[] = $id;
    $types .= 'i';

    $stmt->bind_param($types, ...$bind);
    $stmt->execute();
    $count++;
    if ($count % 20 === 0) {
        echo "Procesados: $count\n";
    }
}

$stmt->close();
$mysqli->close();

echo "Listo. $count clientes anonimizados.\n";
