<?php
/**
 * Verificar configuración para edición directa en DBeaver
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== CONFIGURACIÓN PARA EDICIÓN EN DBEAVER ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Verificar configuración de autocommit
    echo "⚙️  CONFIGURACIÓN DE TRANSACCIONES:\n";
    echo str_repeat("=", 80) . "\n";
    $autocommit = $mysqli->query("SELECT @@autocommit")->fetch_row()[0];
    echo "Autocommit: " . ($autocommit ? "ON (activado)" : "OFF (desactivado)") . "\n";
    echo "⚠️  DBeaver necesita autocommit ON para edición directa\n\n";
    
    // Verificar isolation level
    $isolation = $mysqli->query("SELECT @@transaction_isolation")->fetch_row()[0];
    echo "Transaction Isolation Level: $isolation\n\n";
    
    // Verificar si hay locks
    echo "🔒 VERIFICACIÓN DE LOCKS:\n";
    echo str_repeat("=", 80) . "\n";
    $locks = $mysqli->query("SHOW OPEN TABLES WHERE In_use > 0");
    if ($locks && $locks->num_rows > 0) {
        echo "⚠️  Tablas bloqueadas encontradas:\n";
        while ($lock = $locks->fetch_assoc()) {
            echo "   - {$lock['Table']}\n";
        }
    } else {
        echo "✅ No hay tablas bloqueadas\n";
    }
    
    echo "\n";
    
    // Verificar estructura específica del campo Mail
    echo "📧 ESTRUCTURA DEL CAMPO MAIL:\n";
    echo str_repeat("=", 80) . "\n";
    $fieldInfo = $mysqli->query("
        SELECT 
            COLUMN_NAME,
            COLUMN_TYPE,
            IS_NULLABLE,
            COLUMN_DEFAULT,
            COLUMN_KEY,
            EXTRA,
            CHARACTER_SET_NAME,
            COLLATION_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'user'
        AND COLUMN_NAME = 'Mail'
    ")->fetch_assoc();
    
    if ($fieldInfo) {
        echo "Campo: {$fieldInfo['COLUMN_NAME']}\n";
        echo "Tipo: {$fieldInfo['COLUMN_TYPE']}\n";
        echo "Permite NULL: {$fieldInfo['IS_NULLABLE']}\n";
        echo "Valor por defecto: " . ($fieldInfo['COLUMN_DEFAULT'] ?? 'NULL') . "\n";
        echo "Es clave: {$fieldInfo['COLUMN_KEY']}\n";
        echo "Extra: " . ($fieldInfo['EXTRA'] ?? 'N/A') . "\n";
        echo "Charset: " . ($fieldInfo['CHARACTER_SET_NAME'] ?? 'N/A') . "\n";
        echo "Collation: {$fieldInfo['COLLATION_NAME']}\n";
    }
    
    echo "\n";
    
    // Probar un UPDATE para verificar que funciona
    echo "🧪 PRUEBA DE ACTUALIZACIÓN:\n";
    echo str_repeat("=", 80) . "\n";
    $testUser = $mysqli->query("SELECT Id, Mail FROM user WHERE Id = 1")->fetch_assoc();
    if ($testUser) {
        $originalEmail = $testUser['Mail'];
        $testEmail = 'test_dbeaver@nexusqtech.com';
        
        echo "Email original: $originalEmail\n";
        echo "Intentando actualizar a: $testEmail\n";
        
        $update = $mysqli->prepare("UPDATE user SET Mail = ?, UpdateDate = NOW() WHERE Id = ?");
        $update->bind_param("si", $testEmail, $testUser['Id']);
        
        if ($update->execute()) {
            echo "✅ UPDATE exitoso\n";
            
            // Verificar
            $verify = $mysqli->query("SELECT Mail FROM user WHERE Id = 1")->fetch_assoc();
            echo "Email después del UPDATE: {$verify['Mail']}\n";
            
            // Revertir
            $revert = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
            $revert->bind_param("si", $originalEmail, $testUser['Id']);
            $revert->execute();
            $revert->close();
            echo "✅ Cambio revertido\n";
        } else {
            echo "❌ Error: " . $update->error . "\n";
        }
        $update->close();
    }
    
    echo "\n";
    
    // Instrucciones específicas para DBeaver
    echo "📖 INSTRUCCIONES PARA DBEAVER:\n";
    echo str_repeat("=", 80) . "\n";
    echo "1. CONFIGURACIÓN INICIAL:\n";
    echo "   - Abre DBeaver\n";
    echo "   - Conecta a la base de datos\n";
    echo "   - Ve a: Database Navigator > nexfile > Tables > user\n";
    echo "   - Click derecho en 'user' > View Data\n\n";
    
    echo "2. HABILITAR EDICIÓN:\n";
    echo "   - En la ventana de datos, busca el botón 'Edit' o 'Toggle Edit Mode' (icono de lápiz)\n";
    echo "   - O presiona Ctrl+E para activar el modo de edición\n";
    echo "   - Verifica que aparezca 'Edit mode' en la barra de estado\n\n";
    
    echo "3. EDITAR EL CAMPO MAIL:\n";
    echo "   - Haz doble clic en la celda del campo 'Mail' del usuario que quieres editar\n";
    echo "   - Escribe el nuevo email\n";
    echo "   - Presiona Enter o Tab para confirmar el cambio\n";
    echo "   - Verás que la fila se marca con un asterisco (*) indicando cambios pendientes\n\n";
    
    echo "4. GUARDAR CAMBIOS:\n";
    echo "   - Haz clic en el botón 'Save' (icono de disco) o presiona Ctrl+S\n";
    echo "   - O usa el botón 'Commit' si aparece\n";
    echo "   - DBeaver mostrará un diálogo de confirmación\n";
    echo "   - Confirma el cambio\n\n";
    
    echo "5. SI NO PUEDES EDITAR:\n";
    echo "   a) Verifica que el modo de edición esté activado (Ctrl+E)\n";
    echo "   b) Ve a: Window > Preferences > Connections > Transactions\n";
    echo "      - Asegúrate de que 'Auto-commit' esté marcado\n";
    echo "   c) Cierra y vuelve a abrir la conexión\n";
    echo "   d) Intenta usar SQL Editor en su lugar:\n";
    echo "      - Click derecho en 'user' > SQL Editor > New SQL Script\n";
    echo "      - Ejecuta: UPDATE user SET Mail = 'nuevo@nexusqtech.com' WHERE Id = 1;\n\n";
    
    echo "6. ALTERNATIVA: USAR SQL EDITOR:\n";
    echo "   - Click derecho en la tabla 'user'\n";
    echo "   - Selecciona 'SQL Editor' > 'New SQL Script'\n";
    echo "   - Escribe y ejecuta el UPDATE directamente\n";
    echo "   - Esto evita problemas con el modo de edición\n\n";
    
    $mysqli->close();
    
    echo "✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
