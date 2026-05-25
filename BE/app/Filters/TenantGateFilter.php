<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Libraries\TenantResolver;

/**
 * Multi-tenant license gate. Runs BEFORE JwtAuthFilter for all `api/*` routes.
 *
 * Logic:
 *  - If env(MULTITENANT_ENABLED) is false → no-op (legacy single-tenant mode).
 *  - Extract slug from Host header (vw.nexfile.app → "vw"). If no slug or
 *    reserved subdomain → no-op (callers reach legacy nexfile DB).
 *  - Look up tenant in central DB. If not found → 404 with code tenant_not_found.
 *  - On `terminated` / `suspended` → 402 Payment Required.
 *  - On `readonly` for write methods (POST/PUT/PATCH/DELETE) → 423 Locked.
 *  - On `grace` → annotate response header X-Tenant-Grace-Days-Left for FE banner.
 *  - On `active` → continue.
 *
 * The resolved tenant array is stashed in $_REQUEST['_tenant'] so downstream
 * code (TenantConnection, TenantConfigService) can pick it up without re-querying.
 */
class TenantGateFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return;
        }
        if (!TenantResolver::isEnabled()) {
            return;
        }

        $hostHeader = $request->getHeader('Host');
        $host = $hostHeader ? $hostHeader->getValue() : ($_SERVER['HTTP_HOST'] ?? '');
        $slug = TenantResolver::extractSlug($host);
        if (!$slug) {
            // No subdomain → legacy/default DB usage. Allow request to proceed.
            return;
        }

        $tenant = TenantResolver::resolveBySlug($slug);
        if (!$tenant) {
            return $this->jsonResponse(404, 'tenant_not_found', "Tenant '{$slug}' no existe.");
        }

        $_REQUEST['_tenant'] = $tenant;

        $status = $tenant['status'] ?? 'active';
        $method = strtoupper($request->getMethod());

        if (in_array($status, ['suspended', 'terminated'], true)) {
            return $this->jsonResponse(402, 'tenant_' . $status, "El acceso del tenant '{$slug}' está {$status}.");
        }

        if ($status === 'readonly' && in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $this->jsonResponse(423, 'tenant_readonly', "El tenant '{$slug}' está en modo solo-lectura.");
        }

        // grace → let through but annotate after()
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        if (!TenantResolver::isEnabled()) return;
        $tenant = $_REQUEST['_tenant'] ?? null;
        if (!$tenant || ($tenant['status'] ?? null) !== 'grace') return;

        // Compute days left in grace period (max 7 by default policy)
        $started = $tenant['grace_started_at'] ?? null;
        if (!$started) return;
        $startedTs = strtotime($started);
        if (!$startedTs) return;
        $elapsedDays = (int) floor((time() - $startedTs) / 86400);
        $daysLeft = max(0, 7 - $elapsedDays);

        $response->setHeader('X-Tenant-Grace-Days-Left', (string) $daysLeft);
        $response->setHeader('Access-Control-Expose-Headers', 'X-Tenant-Grace-Days-Left');
    }

    private function jsonResponse(int $code, string $errorCode, string $message)
    {
        return service('response')
            ->setStatusCode($code)
            ->setJSON([
                'success' => false,
                'error'   => $errorCode,
                'message' => $message,
            ]);
    }
}
