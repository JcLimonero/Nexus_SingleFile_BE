<?php

declare(strict_types=1);

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Creación idempotente de la tabla Integration_ApiKey.
 * Si existe la tabla legada Liquidacion_Integration_ApiKey, la renombra.
 * Si `php spark migrate` falla (historial inconsistente), úsalo igual.
 *
 * INSERT de ejemplo (no commitees la clave en texto plano):
 *
 * INSERT INTO Integration_ApiKey (Name, KeyHash, Enabled, CreatedDate)
 * VALUES ('Cliente X', SHA2('TU_CLAVE', 256), 1, NOW());
 */
final class IntegrationEnsureApiKeyTable extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'integration:ensure-apikey-table';
    protected $description = 'Crea Integration_ApiKey o renombra la tabla legada si aplica';
    /** @var string */
    protected $usage = 'integration:ensure-apikey-table';

    private const LEGACY_TABLE = 'Liquidacion_Integration_ApiKey';

    public function run(array $params)
    {
        $db = Database::connect();

        if ($db->tableExists('Integration_ApiKey')) {
            CLI::write('La tabla Integration_ApiKey ya existe.', 'green');

            return;
        }

        if ($db->tableExists(self::LEGACY_TABLE)) {
            $db->query('RENAME TABLE `' . self::LEGACY_TABLE . '` TO `Integration_ApiKey`');

            CLI::write(
                'Tabla renombrada: ' . self::LEGACY_TABLE . ' → Integration_ApiKey',
                'green'
            );

            return;
        }

        $forge = Database::forge();
        $table = 'Integration_ApiKey';

        $forge->addField([
            'Id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'Name' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => false,
            ],
            'KeyHash' => [
                'type'       => 'VARCHAR',
                'constraint' => 64,
                'null'       => false,
                'comment'    => 'SHA-256 hex of the API key (never store plain key)',
            ],
            'Enabled' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'unsigned'   => true,
                'default'    => 1,
            ],
            'CreatedDate' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'LastUsedDate' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $forge->addKey('Id', true);
        $forge->addKey('KeyHash', false, true, 'uq_integration_apikey_hash');
        $forge->addKey('Enabled', false, false, 'idx_integration_apikey_enabled');

        $forge->createTable($table, true);

        CLI::write("Tabla {$table} creada.", 'green');
        CLI::write('Inserte una API key con KeyHash = SHA-256 en hex de la clave en texto plano.', 'yellow');
    }
}
