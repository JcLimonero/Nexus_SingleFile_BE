<?php

declare(strict_types=1);

namespace App\Commands;

use App\Models\IntegrationApiKeyModel;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

/**
 * Inserta una API key local para pruebas (no usar en producción).
 * Uso: php spark integration:seed-dev-key [claveOpcional]
 */
final class IntegrationSeedDevApiKey extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'integration:seed-dev-key';
    protected $description = 'Inserta API key de desarrollo en Integration_ApiKey';
    /** @var string */
    protected $usage = 'integration:seed-dev-key [plainKey]';

    public function run(array $params)
    {
        $plain = isset($params[0]) ? (string) $params[0] : 'liquidacion-local-test';

        $model = new IntegrationApiKeyModel();
        $hash  = IntegrationApiKeyModel::hashKey($plain);

        $existing = $model->findEnabledByKeyHash($hash);
        if ($existing !== null) {
            CLI::write('Ya existe una key con ese hash (Enabled).', 'yellow');
            CLI::write('Pruebe enviar header: X-Api-Key: ' . $plain, 'cyan');

            return;
        }

        $model->insert([
            'Name'         => 'Dev local spark',
            'KeyHash'      => $hash,
            'Enabled'      => 1,
            'CreatedDate' => date('Y-m-d H:i:s'),
            'LastUsedDate' => null,
        ]);

        CLI::write('API key insertada.', 'green');
        CLI::write('Header para pruebas: X-Api-Key: ' . $plain, 'cyan');
    }
}
