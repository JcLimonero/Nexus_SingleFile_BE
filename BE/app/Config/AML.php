<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Configuración para alertas AML (Anti-Lavado de Dinero).
 * Umbral y valor UMA se leen desde la tabla config (aml_umbral_uma, aml_valor_uma).
 * Umbral: 3210 UMA para los últimos 6 meses desde la fecha de visualización.
 * Solo se consideran montos cargados con método de pago "Depósito en efectivo" (id: 1).
 * Operaciones que superen este monto por cliente por compañía activan el indicador.
 */
class AML extends BaseConfig
{
    /** Valores por defecto si no existen en config */
    private const DEFAULT_UMBRAL_UMA = 3210;
    private const DEFAULT_VALOR_UMA = 113.14;

    /**
     * Umbral en unidades UMA. Lee desde tabla config (aml_umbral_uma).
     */
    public function getUmbralUMA(): int
    {
        $v = $this->getConfigValue('aml_umbral_uma');
        return $v !== null ? (int) $v : self::DEFAULT_UMBRAL_UMA;
    }

    /**
     * Valor diario de la UMA en pesos MXN. Lee desde tabla config (aml_valor_uma).
     */
    public function getValorUMA(): float
    {
        $v = $this->getConfigValue('aml_valor_uma');
        return $v !== null ? (float) $v : self::DEFAULT_VALOR_UMA;
    }

    /**
     * Monto umbral en MXN = umbralUMA * valorUMA.
     * Se usa para comparar con totales de operaciones.
     */
    public function getUmbralMonto(): float
    {
        return $this->getUmbralUMA() * $this->getValorUMA();
    }

    /**
     * Lee un valor de la tabla config.
     */
    private function getConfigValue(string $key): ?string
    {
        try {
            $db = \Config\Database::connect();
            $row = $db->table('config')
                ->select('config_value')
                ->where('config_key', $key)
                ->get()
                ->getRowArray();
            $val = $row['config_value'] ?? null;
            return ($val !== null && trim($val) !== '') ? trim($val) : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Período en meses hacia atrás desde la fecha de visualización.
     */
    public int $periodoMeses = 6;

    /**
     * Vista que calcula totales por cliente/compañía en los últimos 6 meses.
     * Solo suma montos de liquidation_receipt_detail con id_payment_method = 1 (Depósito en efectivo).
     */
    public string $vistaMontos = 'view_client_company_amount_6m';

    /**
     * @deprecated Usar getUmbralMonto(). Mantenido por compatibilidad.
     */
    public float $umbralAnualPorCompania = 363179.40;
}
