<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Configuración para alertas AML (Anti-Lavado de Dinero).
 * Umbral en pesos mexicanos (MXN) - operaciones que superen este monto
 * por cliente por compañía en el año generan indicador de atención.
 */
class AML extends BaseConfig
{
    /**
     * Monto máximo permitido por cliente por compañía al año (MXN).
     * Superar este monto activa el indicador de atención.
     */
    public float $umbralAnualPorCompania = 500000.00;

    /**
     * Nombre de la vista que calcula totales por cliente/compañía/período.
     */
    public string $vistaMontos = 'view_client_company_amount';
}
