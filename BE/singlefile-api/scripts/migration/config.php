<?php

/**
 * Archivo de Configuración para APIs y Migraciones
 * Contiene todas las credenciales y configuraciones centralizadas
 */

// Configuración de MySQL Local
$mysql_config = [
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'singlefile_db',
    'username' => 'root',
    'password' => '00@Limonero'
];

// Configuración de HFSQL (Base de datos remota)
$hfsql_config = [
    'server' => 'concesionarias.costumersolutions.com',
    'port' => 4900,
    'database' => 'expediente_seguros',
    'username' => 'admin',
    'password' => 'taQ17Zm'
];

// Configuración de Archivos CSV
$csv_config = [
    'agency_file' => '/Users/jclimonero/Documents/Developer/SingleFile/script/Agency.csv',
    'encoding' => 'UTF-8',
    'delimiter' => ',',
    'enclosure' => '"',
    'escape' => '\\'
];

// Configuración de Migración
$migration_config = [
    'batch_size' => 100,
    'timeout' => 300,
    'retry_attempts' => 3,
    'clean_table_before_migration' => true,
    'validate_data' => true,
    'create_backup' => true
];

// Configuración de Tablas
$tables_config = [
    'agency' => [
        'name' => 'Agency',
        'primary_key' => 'Id',
        'required_fields' => ['Id', 'Name'],
        'date_fields' => ['RegistrationDate', 'UpdateDate'],
        'boolean_fields' => ['Enabled'],
        'integer_fields' => ['Id', 'IdLastUserUpdate', 'Enabled']
    ]
];

// Función para obtener configuración
function getConfig($section, $key = null) {
    global $mysql_config, $hfsql_config, $csv_config, $migration_config, $tables_config;
    
    $configs = [
        'mysql' => $mysql_config,
        'hfsql' => $hfsql_config,
        'csv' => $csv_config,
        'migration' => $migration_config,
        'tables' => $tables_config
    ];
    
    if (!isset($configs[$section])) {
        throw new Exception("Sección de configuración '$section' no encontrada");
    }
    
    if ($key === null) {
        return $configs[$section];
    }
    
    if (!isset($configs[$section][$key])) {
        throw new Exception("Clave '$key' no encontrada en la sección '$section'");
    }
    
    return $configs[$section][$key];
}
