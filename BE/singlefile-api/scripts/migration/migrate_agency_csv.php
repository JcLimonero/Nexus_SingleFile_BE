<?php

/**
 * Script de Migración - Tabla Agency desde CSV
 * Migra datos desde el archivo Agency.csv a MySQL
 */

// Configuración de MySQL local
$mysql_config = [
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'singlefile_db',
    'username' => 'root',
    'password' => 'TU_CONTRASEÑA_AQUI' // Configurar tu contraseña aquí
];

// Ruta al archivo CSV
$csv_file = '/Users/jclimonero/Documents/Developer/SingleFile/script/Agency.csv';

class AgencyCSVMigration {
    private $mysql_connection;
    private $log = [];
    private $csv_file;
    
    public function __construct($mysql_config, $csv_file) {
        $this->mysql_config = $mysql_config;
        $this->csv_file = $csv_file;
    }
    
    /**
     * Conectar a MySQL
     */
    public function connectMySQL() {
        try {
            $dsn = "mysql:host={$this->mysql_config['host']};port={$this->mysql_config['port']};dbname={$this->mysql_config['database']};charset=utf8mb4";
            
            $this->mysql_connection = new PDO($dsn, $this->mysql_config['username'], $this->mysql_config['password']);
            $this->mysql_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $this->log[] = "✅ Conexión a MySQL establecida";
            return true;
        } catch (PDOException $e) {
            $this->log[] = "❌ Error conectando a MySQL: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Leer archivo CSV
     */
    public function readCSV() {
        try {
            if (!file_exists($this->csv_file)) {
                throw new Exception("Archivo CSV no encontrado: {$this->csv_file}");
            }
            
            $this->log[] = "📁 Leyendo archivo CSV: " . basename($this->csv_file);
            
            $csv_data = [];
            $handle = fopen($this->csv_file, 'r');
            
            if ($handle === false) {
                throw new Exception("No se pudo abrir el archivo CSV");
            }
            
            // Leer encabezados
            $headers = fgetcsv($handle, 0, ',', '"', '\\');
            if (!$headers) {
                throw new Exception("No se pudieron leer los encabezados del CSV");
            }
            
            $this->log[] = "📋 Encabezados detectados: " . implode(', ', $headers);
            
            // Leer datos
            $row_number = 1;
            while (($row = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
                $row_number++;
                
                // Validar que la fila tenga el número correcto de columnas
                if (count($row) !== count($headers)) {
                    $this->log[] = "⚠️  Fila $row_number: Número incorrecto de columnas (" . count($row) . " vs " . count($headers) . ")";
                    continue;
                }
                
                // Crear array asociativo
                $row_data = array_combine($headers, $row);
                
                // Limpiar y validar datos
                $cleaned_data = $this->cleanRowData($row_data);
                
                if ($cleaned_data) {
                    $csv_data[] = $cleaned_data;
                }
            }
            
            fclose($handle);
            
            $this->log[] = "📊 Datos leídos del CSV: " . count($csv_data) . " registros válidos";
            return $csv_data;
            
        } catch (Exception $e) {
            $this->log[] = "❌ Error leyendo CSV: " . $e->getMessage();
            return [];
        }
    }
    
    /**
     * Limpiar y validar datos de una fila
     */
    private function cleanRowData($row_data) {
        try {
            // Validar campos requeridos
            if (empty($row_data['Id']) || empty($row_data['Name'])) {
                return null; // Saltar filas sin ID o Nombre
            }
            
            // Limpiar y formatear datos
            $cleaned = [
                'Id' => (int)$row_data['Id'],
                'Name' => trim($row_data['Name']),
                'Enabled' => isset($row_data['Enabled']) ? (int)$row_data['Enabled'] : 1,
                'RegistrationDate' => $this->parseDate($row_data['RegistrationDate']),
                'UpdateDate' => $this->parseDate($row_data['UpdateDate']),
                'IdLastUserUpdate' => isset($row_data['IdLastUserUpdate']) ? (int)$row_data['IdLastUserUpdate'] : 0,
                'SubFix' => isset($row_data['SubFix']) ? trim($row_data['SubFix']) : '',
                'IdAgency' => isset($row_data['IdAgency']) ? trim($row_data['IdAgency']) : ''
            ];
            
            return $cleaned;
            
        } catch (Exception $e) {
            $this->log[] = "⚠️  Error limpiando fila: " . $e->getMessage();
            return null;
        }
    }
    
    /**
     * Parsear fechas del formato del CSV
     */
    private function parseDate($date_string) {
        if (empty($date_string) || $date_string === '') {
            return null;
        }
        
        try {
            // El formato parece ser: "12/02/2019 04:43:SS p.m."
            // Limpiar el string y convertir a formato MySQL
            $clean_date = preg_replace('/\s*SS\s*(a\.m\.|p\.m\.)/', '', $date_string);
            
            // Convertir a timestamp
            $timestamp = strtotime($clean_date);
            
            if ($timestamp === false) {
                return null;
            }
            
            return date('Y-m-d H:i:s', $timestamp);
            
        } catch (Exception $e) {
            return null;
        }
    }
    
    /**
     * Migrar datos a MySQL
     */
    public function migrateToMySQL($data) {
        try {
            $this->log[] = "🚀 Iniciando migración a MySQL...";
            
            // Limpiar tabla antes de migrar
            $this->mysql_connection->exec("TRUNCATE TABLE Agency");
            $this->log[] = "🧹 Tabla Agency limpiada";
            
            // Preparar statement para inserción
            $stmt = $this->mysql_connection->prepare("
                INSERT INTO Agency (Id, Name, Enabled, RegistrationDate, UpdateDate, IdLastUserUpdate, SubFix, IdAgency) 
                VALUES (:Id, :Name, :Enabled, :RegistrationDate, :UpdateDate, :IdLastUserUpdate, :SubFix, :IdAgency)
            ");
            
            $migrated_count = 0;
            $errors = 0;
            
            foreach ($data as $row) {
                try {
                    $stmt->execute([
                        ':Id' => $row['Id'],
                        ':Name' => $row['Name'],
                        ':Enabled' => $row['Enabled'],
                        ':RegistrationDate' => $row['RegistrationDate'],
                        ':UpdateDate' => $row['UpdateDate'],
                        ':IdLastUserUpdate' => $row['IdLastUserUpdate'],
                        ':SubFix' => $row['SubFix'],
                        ':IdAgency' => $row['IdAgency']
                    ]);
                    $migrated_count++;
                } catch (Exception $e) {
                    $errors++;
                    $this->log[] = "⚠️  Error insertando ID {$row['Id']}: " . $e->getMessage();
                }
            }
            
            $this->log[] = "✅ Migración completada: $migrated_count registros migrados";
            if ($errors > 0) {
                $this->log[] = "⚠️  $errors registros con errores";
            }
            
            return true;
            
        } catch (Exception $e) {
            $this->log[] = "❌ Error en migración a MySQL: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Verificar datos migrados
     */
    public function verifyMigration() {
        try {
            $this->log[] = "🔍 Verificando migración...";
            
            // Contar registros
            $stmt = $this->mysql_connection->query("SELECT COUNT(*) as total FROM Agency");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $this->log[] = "📊 Total de registros en MySQL: " . $result['total'];
            
            // Mostrar algunos registros de ejemplo
            $stmt = $this->mysql_connection->query("SELECT * FROM Agency ORDER BY Id LIMIT 5");
            $sample = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $this->log[] = "📋 Muestra de registros migrados:";
            foreach ($sample as $row) {
                $status = $row['Enabled'] ? '✅ Habilitada' : '❌ Deshabilitada';
                $reg_date = $row['RegistrationDate'] ?: 'N/A';
                $this->log[] = "  - ID: {$row['Id']} | Nombre: {$row['Name']} | Estado: {$status} | Fecha: {$reg_date}";
            }
            
            return true;
        } catch (Exception $e) {
            $this->log[] = "❌ Error en verificación: " . $e->getMessage();
            return false;
        }
    }
    
    /**
     * Ejecutar migración completa
     */
    public function run() {
        $this->log[] = "=== 🚀 INICIANDO MIGRACIÓN DESDE CSV ===";
        
        // Conectar a MySQL
        if (!$this->connectMySQL()) {
            $this->log[] = "❌ No se pudo conectar a MySQL. Abortando migración.";
            return false;
        }
        
        // Leer CSV
        $data = $this->readCSV();
        if (empty($data)) {
            $this->log[] = "❌ No se obtuvieron datos del CSV. Abortando migración.";
            return false;
        }
        
        // Migrar a MySQL
        if (!$this->migrateToMySQL($data)) {
            $this->log[] = "❌ Error en la migración a MySQL.";
            return false;
        }
        
        // Verificar migración
        $this->verifyMigration();
        
        $this->log[] = "=== ✅ MIGRACIÓN COMPLETADA ===";
        return true;
    }
    
    /**
     * Obtener log de la migración
     */
    public function getLog() {
        return $this->log;
    }
}

// Ejecutar migración
echo "🚀 Iniciando migración de tabla Agency desde CSV...\n\n";

$migration = new AgencyCSVMigration($mysql_config, $csv_file);
$success = $migration->run();

echo "\n=== 📝 LOG DE MIGRACIÓN ===\n";
foreach ($migration->getLog() as $log_entry) {
    echo $log_entry . "\n";
}

if ($success) {
    echo "\n🎉 ¡Migración desde CSV completada exitosamente!\n";
    echo "📊 Los datos de las agencias han sido migrados a MySQL\n";
} else {
    echo "\n💥 La migración falló. Revisa el log para más detalles.\n";
}
