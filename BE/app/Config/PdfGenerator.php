<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Configuración para PDF Generator API.
 * Las credenciales deben configurarse en .env:
 *   pdfGenerator.apiKey = tu_api_key
 *   pdfGenerator.apiSecret = tu_api_secret
 *   pdfGenerator.workspaceEmail = email@workspace.com  (identificador del workspace)
 */
class PdfGenerator extends BaseConfig
{
    /**
     * API Key de PDF Generator API
     */
    public string $apiKey = '';

    /**
     * API Secret para firmar el JWT
     */
    public string $apiSecret = '';

    /**
     * Email del workspace (subject del JWT)
     */
    public string $workspaceEmail = '';

    /**
     * ID del template de identificación cliente moral (IdCostumerType = 3)
     */
    public string $templateIdIdentificacionMoral = '1606181';

    /**
     * ID del template de identificación cliente físico (IdCostumerType != 3)
     */
    public string $templateIdIdentificacionFisico = '1606176';

    /**
     * URL base de la API v4
     */
    public string $baseUrl = 'https://us1.pdfgeneratorapi.com/api/v4';

    public function __construct()
    {
        parent::__construct();
        $this->apiKey = env('pdfGenerator.apiKey', $this->apiKey) ?: '';
        $this->apiSecret = env('pdfGenerator.apiSecret', $this->apiSecret) ?: '';
        $this->workspaceEmail = env('pdfGenerator.workspaceEmail', $this->workspaceEmail) ?: '';
        $this->templateIdIdentificacionMoral = env('pdfGenerator.templateIdIdentificacionMoral', $this->templateIdIdentificacionMoral) ?: '1606181';
        $this->templateIdIdentificacionFisico = env('pdfGenerator.templateIdIdentificacionFisico', $this->templateIdIdentificacionFisico) ?: '1606176';
    }
}
