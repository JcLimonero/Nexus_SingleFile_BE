<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Configuración para alertas AML (Anti-Lavado de Dinero).
 * Umbral y valor UMA se leen desde la tabla config (aml_umbral_uma, aml_valor_uma, aml_umbral_reportar_uma).
 * Umbral 3210 UMA (efectivo): devolver excedente al cliente; expediente total: requiere atención.
 * Umbral 6420 UMA (expediente total): reportar a fin de mes.
 * Solo efectivo: método de pago "Depósito en efectivo" (id: 1).
 */
class AML extends BaseConfig
{
    /** Valores por defecto si no existen en config */
    private const DEFAULT_UMBRAL_UMA = 3210;
    private const DEFAULT_UMBRAL_REPORTAR_UMA = 6420;
    private const DEFAULT_VALOR_UMA = 113.14;

    /**
     * Umbral en unidades UMA (3210). Lee desde tabla config (aml_umbral_uma).
     */
    public function getUmbralUMA(): int
    {
        $v = $this->getConfigValue('aml_umbral_uma');
        return $v !== null ? (int) $v : self::DEFAULT_UMBRAL_UMA;
    }

    /**
     * Umbral para reportar a fin de mes (6420 UMA). Lee desde tabla config (aml_umbral_reportar_uma).
     */
    public function getUmbralReportarUMA(): int
    {
        $v = $this->getConfigValue('aml_umbral_reportar_uma');
        return $v !== null ? (int) $v : self::DEFAULT_UMBRAL_REPORTAR_UMA;
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
     * Monto umbral en MXN = umbralUMA * valorUMA (3210 UMA).
     * Se usa para comparar con totales de operaciones en efectivo.
     */
    public function getUmbralMonto(): float
    {
        return $this->getUmbralUMA() * $this->getValorUMA();
    }

    /**
     * Monto umbral para reportar a fin de mes en MXN = 6420 * valorUMA.
     */
    public function getUmbralReportarMonto(): float
    {
        return $this->getUmbralReportarUMA() * $this->getValorUMA();
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
     * Vista que calcula totales por cliente/compañía en los últimos 6 meses.
     * Suma TODOS los métodos de pago (para requiere atención y reportar a fin de mes).
     */
    public string $vistaMontosTotal = 'view_client_company_amount_6m_total';

    /**
     * @deprecated Usar getUmbralMonto(). Mantenido por compatibilidad.
     */
    public float $umbralAnualPorCompania = 363179.40;
}
