<?php
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

$tablesToCheck = [
    'file_sub_status',
    'FileSubStatus',
    'file_document',
    'FileDocument',
    'file_status',
    'File_Status',
    'FileStatus',
    'document_type',
    'DocumentType',
    'document_file_status',
    'DocumentFileStatus',
    'DocumentFile_Status'
];

echo "Verificando nombres de tablas:\n";
echo str_repeat("=", 60) . "\n";

foreach ($tablesToCheck as $tableName) {
    $result = $mysqli->query("SHOW TABLES LIKE '{$tableName}'");
    $exists = $result && $result->num_rows > 0;
    echo sprintf("%-30s %s\n", $tableName, $exists ? "✅ EXISTE" : "❌ NO EXISTE");
}

$mysqli->close();
