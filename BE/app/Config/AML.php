<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Configuración para alertas AML (Anti-Lavado de Dinero).
 * Umbral: 3210 UMA para los últimos 6 meses desde la fecha de visualización.
 * Operaciones que superen este monto por cliente por compañía activan el indicador.
 */
class AML extends BaseConfig
{
    /**
     * Umbral en unidades UMA (Unidad de Medida y Actualización).
     * 3210 UMA según normativa PLD.
     */
    public int $umbralUMA = 3210;

    /**
     * Valor diario de la UMA en pesos (MXN). Actualizar cuando INEGI publique nuevo valor.
     * 2025: 113.14 (vigente feb 2025 - ene 2026)
     */
    public float $valorUMA = 113.14;

    /**
     * Monto umbral en MXN = umbralUMA * valorUMA.
     * Se usa para comparar con totales de operaciones.
     */
    public function getUmbralMonto(): float
    {
        return $this->umbralUMA * $this->valorUMA;
    }

    /**
     * Período en meses hacia atrás desde la fecha de visualización.
     */
    public int $periodoMeses = 6;

    /**
     * Vista que calcula totales por cliente/compañía en los últimos 6 meses.
     */
    public string $vistaMontos = 'view_client_company_amount_6m';

    /**
     * @deprecated Usar getUmbralMonto(). Mantenido por compatibilidad.
     */
    public float $umbralAnualPorCompania = 363179.40;
}
