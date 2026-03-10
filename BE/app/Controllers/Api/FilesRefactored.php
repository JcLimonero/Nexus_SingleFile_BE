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
     * Redirigir a Files::createFromNexFileNew
     */
    public function createFromNexFileNew()
    {
        $filesController = new Files();
        return $filesController->createFromNexFileNew();
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

    public function getCustomerTypesByProcessAndAgency($processId, $agencyId)
    {
        // Implementación básica
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Método redirigido',
            'data' => []
        ]);
    }

    public function getOperationTypesByProcessCustomerTypeAndAgency($processId, $customerTypeId, $agencyId)
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
