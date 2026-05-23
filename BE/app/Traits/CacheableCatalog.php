<?php

namespace App\Traits;

/**
 * Trait para cachear catálogos de baja volatilidad (FileStatus, DocumentType,
 * FileReason, etc.). Estos endpoints se consultan en cada formulario y tabla
 * del FE pero sus datos cambian rara vez (típicamente solo desde "Configuración").
 *
 * Uso:
 *   class FileStatus extends BaseController {
 *       use CacheableCatalog;
 *
 *       public function active() {
 *           return $this->cachedOrCompute('filestatus.active', function () {
 *               // ...query y armado de respuesta...
 *               return ['file_statuses' => $rows, 'count' => count($rows)];
 *           });
 *       }
 *
 *       public function create() { ...; $this->invalidateCatalogCache('filestatus'); }
 *   }
 */
trait CacheableCatalog
{
    /** TTL por defecto: 1 hora. Endpoints de catálogo cambian rara vez. */
    private const CATALOG_CACHE_TTL = 3600;

    /**
     * Devuelve el valor cacheado o lo computa y lo guarda.
     * El producer DEBE retornar un array serializable.
     *
     * @return mixed Lo que devuelva el producer (o el valor cacheado).
     */
    protected function cachedOrCompute(string $cacheKey, callable $producer, int $ttl = self::CATALOG_CACHE_TTL)
    {
        $cache = \Config\Services::cache();
        $cached = $cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $value = $producer();
        $cache->save($cacheKey, $value, $ttl);
        return $value;
    }

    /**
     * Invalida todas las variantes del catálogo (prefijo + sus claves derivadas).
     * Llamar desde create/update/delete/toggleStatus.
     *
     * Ejemplo: invalidateCatalogCache('filestatus') borra 'filestatus.active',
     * 'filestatus.all', etc. Como CodeIgniter's FileHandler no soporta wildcard,
     * borramos las variantes conocidas manualmente.
     */
    protected function invalidateCatalogCache(string $prefix): void
    {
        $cache = \Config\Services::cache();
        foreach (['active', 'all', 'index', 'enabled', 'stats'] as $variant) {
            $cache->delete("{$prefix}.{$variant}");
        }
    }
}
