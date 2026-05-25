<?php

namespace App\Traits;

/**
 * Normaliza claves de arrays/objetos a snake_case recursivamente.
 *
 * Diseñado para aplicar a responses de la API durante la migración de
 * camelCase / PascalCase → snake_case sin reescribir cada alias SQL.
 *
 * Uso típico:
 *   $results = $query->getResultArray();
 *   return $this->response->setJSON($this->snakeKeys($results));
 *
 * Reglas:
 *   - camelCase  → snake_case  ('fileId' → 'file_id')
 *   - PascalCase → snake_case  ('IdFile' → 'id_expedient')
 *   - ALL_CAPS   → all_caps    ('RFC' → 'rfc',  'API_KEY' → 'api_key')
 *   - snake_case sin cambios
 *   - claves numéricas sin cambios
 *
 * Si recibes el mismo nombre tras conversión (colisión), el último gana.
 * Las claves whitelistadas en SKIP_KEYS pasan sin tocar (p.ej. campos que el
 * FE espera literalmente).
 */
trait SnakeKeys
{
    /** Claves que NO se transforman aunque parezcan camel/Pascal. */
    private array $snakeKeysSkip = [
        // Reserva para identificadores que el FE consume literalmente
    ];

    /**
     * @param mixed $value
     * @return mixed
     */
    protected function snakeKeys($value)
    {
        if (is_array($value)) {
            $out = [];
            foreach ($value as $k => $v) {
                $newKey = is_string($k) ? $this->toSnakeKey($k) : $k;
                $out[$newKey] = $this->snakeKeys($v);
            }
            return $out;
        }
        if (is_object($value)) {
            $arr = json_decode(json_encode($value), true);
            return $this->snakeKeys($arr);
        }
        return $value;
    }

    private function toSnakeKey(string $key): string
    {
        if (in_array($key, $this->snakeKeysSkip, true)) {
            return $key;
        }
        // Si ya es snake_case (todo minúsculas + dígitos + _), no tocar.
        if (preg_match('/^[a-z][a-z0-9_]*$/', $key)) {
            return $key;
        }

        // Caso especial: ALL_CAPS o palabras con UNDERSCORES (RFC, CURP, API_KEY)
        // mantenemos underscores existentes, solo bajamos a minúsculas.
        if (preg_match('/^[A-Z][A-Z0-9_]*$/', $key)) {
            return strtolower($key);
        }

        // camelCase / PascalCase → snake_case
        // 1) Insertar guion bajo antes de mayúscula precedida por minúscula o dígito
        $s = preg_replace('/([a-z0-9])([A-Z])/', '$1_$2', $key);
        // 2) Insertar guion bajo entre dos mayúsculas seguidas si la 2da va seguida de minúscula
        //    (e.g. "IDProcess" → "ID_Process")
        $s = preg_replace('/([A-Z]+)([A-Z][a-z])/', '$1_$2', $s);
        return strtolower($s);
    }
}
