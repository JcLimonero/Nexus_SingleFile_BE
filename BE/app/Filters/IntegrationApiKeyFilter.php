<?php

declare(strict_types=1);

namespace App\Filters;

use App\Models\IntegrationApiKeyModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/** Autenticación por X-Api-Key para integraciones externas (tabla Integration_ApiKey). */
class IntegrationApiKeyFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return null;
        }

        $header = $request->getHeaderLine('X-Api-Key');
        if ($header === '') {
            $header = $request->getHeaderLine('x-api-key');
        }
        $header = trim($header);
        if ($header === '') {
            return $this->unauthorized();
        }

        $model  = new IntegrationApiKeyModel();
        $keyRow = $model->findEnabledByPlainKey($header);
        if ($keyRow === null) {
            return $this->unauthorized();
        }

        $model->markUsed((int) $keyRow['Id']);

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }

    private function unauthorized()
    {
        return service('response')
            ->setStatusCode(401)
            ->setJSON([
                'success'   => false,
                'errorCode' => 'API_KEY_INVALID',
                'message'   => 'API key no válida o deshabilitada',
                'data'      => null,
            ]);
    }
}
