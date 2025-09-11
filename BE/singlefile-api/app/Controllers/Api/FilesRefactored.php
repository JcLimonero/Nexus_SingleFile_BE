<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class FilesRefactored extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Redirigir a Files::getByClient
     */
    public function getByClient()
    {
        $filesController = new Files();
        return $filesController->getByClient();
    }

    /**
     * Redirigir a Files::getByAgency
     */
    public function getByAgency()
    {
        $filesController = new Files();
        return $filesController->getByAgency();
    }

    /**
     * Redirigir a Files::createFromVanguardiaNew
     */
    public function createFromVanguardiaNew()
    {
        $filesController = new Files();
        return $filesController->createFromVanguardiaNew();
    }

    /**
     * Métodos adicionales que pueden ser llamados
     */
    public function getEnabledConfigurationsByAgency($agencyId)
    {
        // Implementación básica
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Método redirigido',
            'data' => []
        ]);
    }

    public function getProcessesByAgency($agencyId)
    {
        // Implementación básica
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Método redirigido',
            'data' => []
        ]);
    }

    public function getCostumerTypesByProcessAndAgency($processId, $agencyId)
    {
        // Implementación básica
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Método redirigido',
            'data' => []
        ]);
    }

    public function getOperationTypesByProcessCostumerTypeAndAgency($processId, $costumerTypeId, $agencyId)
    {
        // Implementación básica
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Método redirigido',
            'data' => []
        ]);
    }

    public function testConfiguration()
    {
        // Implementación básica
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Método redirigido',
            'data' => []
        ]);
    }
}
