<?php
/**
 * Exports reference catalog rows from the live `nexfile` DB into DEFAULTS/<table>.json
 * for the WIZARD desktop app to consume as seed values.
 *
 * Run from BE/:
 *   php scripts/export-defaults.php
 *
 * Output goes to: <repo>/DEFAULTS/*.json
 */

require __DIR__ . '/../vendor/autoload.php';

// Minimal CI4 constants so Database::connect() boots
define('FCPATH', __DIR__ . '/../public/');
define('WRITEPATH', __DIR__ . '/../writable/');
define('APPPATH', __DIR__ . '/../app/');
define('ROOTPATH', __DIR__ . '/../');
define('SYSTEMPATH', __DIR__ . '/../vendor/codeigniter4/framework/system/');

$paths = new \Config\Paths();
$bootArgs = ['SCRIPT_NAME' => 'spark', 'argv' => ['spark'], 'argc' => 1];
\CodeIgniter\Boot::bootSpark($paths);

$db = \Config\Database::connect();

/** Tables to fully export (schema-allowed catalogs) */
$exportTables = [
    // Catálogos básicos
    'process',
    'customer_type',
    'operation_type',
    'payment_method',
    'file_status',       // exporta con nombre actual; el WIZARD lo usa como file_state
    'file_sub_status',   // idem para file_sub_state
    // Documentos y motivos
    'document_type',
    'configuration_process_document_type',
    'file_reasons',
    'document_file_error',
    'document_file_status',
    // PLD / file extras (los seedea el wizard si están presentes)
    // Roles
    'user_role',
];

/** Tables exported but stripped of `config_value` to ship empty keys only */
$emptyValueTables = [
    'config',
];

/** file_exception_reason: en este schema se llama `file_exception_reason` */
if ($db->tableExists('file_exception_reason')) {
    $exportTables[] = 'file_exception_reason';
}

$outDir = ROOTPATH . '../DEFAULTS';
if (!is_dir($outDir)) mkdir($outDir, 0775, true);

$exported = 0;
foreach ($exportTables as $t) {
    if (!$db->tableExists($t)) {
        echo "  - {$t}: SKIP (not in source schema)\n";
        continue;
    }
    $rows = $db->table($t)->orderBy('id', 'ASC')->get()->getResultArray();
    // Rename the output file for renamed tables so the WIZARD reads file_state.json
    $outName = $t === 'file_status' ? 'file_state'
             : ($t === 'file_sub_status' ? 'file_sub_state' : $t);
    $path = $outDir . '/' . $outName . '.json';
    file_put_contents($path, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "  + {$outName}.json  (" . count($rows) . " rows)\n";
    $exported++;
}

foreach ($emptyValueTables as $t) {
    if (!$db->tableExists($t)) {
        echo "  - {$t}: SKIP\n";
        continue;
    }
    $rows = $db->table($t)->orderBy('id', 'ASC')->get()->getResultArray();
    // Blank out the value column for any *_value / *_key field that looks like a secret
    foreach ($rows as &$r) {
        if (array_key_exists('config_value', $r)) $r['config_value'] = '';
    }
    unset($r);
    $path = $outDir . '/' . $t . '.json';
    file_put_contents($path, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "  + {$t}.json  (" . count($rows) . " rows, values blanked)\n";
    $exported++;
}

echo "\nDone. {$exported} files written to {$outDir}/\n";
