<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Proxy para APIs de Vanguardia
 * Evita problemas de CORS agregando el header X-Provider-Token desde el backend
 */
class VanguardiaProxy extends BaseController
{
    private $vanguardiaToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';
    private $vanguardiaBaseUrl = 'https://apisvanguardia.com:400';

    /**
     * Proxy para búsqueda de clientes
     * GET /api/vgd/singlefilecustomer
     */
    public function searchClients()
    {
        try {
            $params = $this->request->getGet();
            $queryString = http_build_query($params);
            
            $url = "{$this->vanguardiaBaseUrl}/vgd/singlefilecustomer?{$queryString}";
            
            $response = $this->makeVanguardiaRequest('GET', $url);
            
            return $this->response
                ->setJSON($response['body'])
                ->setStatusCode($response['status']);

        } catch (\Exception $e) {
            error_log("Error en VanguardiaProxy::searchClients: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al consultar API de Vanguardia: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Proxy para búsqueda de pedidos
     * GET /api/vgd/singlefileorders
     */
    public function searchOrders()
    {
        try {
            $params = $this->request->getGet();
            $queryString = http_build_query($params);
            
            $url = "{$this->vanguardiaBaseUrl}/vgd/singlefileorders?{$queryString}";
            
            $response = $this->makeVanguardiaRequest('GET', $url);
            
            return $this->response
                ->setJSON($response['body'])
                ->setStatusCode($response['status']);

        } catch (\Exception $e) {
            error_log("Error en VanguardiaProxy::searchOrders: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al consultar API de Vanguardia: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Proxy para subida de archivos a Backblaze
     * POST /api/backblaze/upload
     */
    public function upload()
    {
        try {
            $url = "https://apisvanguardia.com:400/backblaze/upload";
            
            // Obtener el archivo
            $file = $this->request->getFile('file');
            $idSingleFile = $this->request->getPost('idSingleFile');
            $idDocumentFile = $this->request->getPost('idDocumentFile');

            if (!$file || !$file->isValid()) {
                return $this->response->setJSON([ 
                    'success' => false,
                    'message' => 'Archivo no válido o no proporcionado'
                ])->setStatusCode(400);
            }

            // Preparar datos multipart
            $boundary = uniqid();
            $delimiter = '-------------' . $boundary;
            
            $postData = $this->buildMultipartData([
                'file' => [
                    'filename' => $file->getClientName(),
                    'content' => file_get_contents($file->getTempName()),
                    'mimetype' => $file->getClientMimeType()
                ],
                'idSingleFile' => $idSingleFile,
                'idDocumentFile' => $idDocumentFile
            ], $delimiter);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $postData,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'X-Provider-Token: ' . $this->vanguardiaToken,
                    'Content-Type: multipart/form-data; boundary=' . $delimiter,
                    'Content-Length: ' . strlen($postData)
                ],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($error) {
                throw new \Exception("cURL Error: {$error}");
            }

            $responseData = json_decode($response, true);
            
            return $this->response
                ->setJSON($responseData ?? ['error' => 'Invalid response'])
                ->setStatusCode($httpCode);

        } catch (\Exception $e) {
            error_log("Error en VanguardiaProxy::upload: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al subir archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Proxy para obtener URL privada de Backblaze
     * GET /api/backblaze/get-private-url
     */
    public function getPrivateUrl()
    {
        try {
            $params = $this->request->getGet();
            $queryString = http_build_query($params);
            
            $url = "{$this->vanguardiaBaseUrl}/backblaze/get-private-url?{$queryString}";
            
            $response = $this->makeVanguardiaRequest('GET', $url);
            
            return $this->response
                ->setJSON($response['body'])
                ->setStatusCode($response['status']);

        } catch (\Exception $e) {
            error_log("Error en VanguardiaProxy::getPrivateUrl: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener URL privada: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Realizar request a API de Vanguardia
     */
    private function makeVanguardiaRequest($method, $url, $data = null)
    {
        $ch = curl_init($url);
        
        $headers = [
            'X-Provider-Token: ' . $this->vanguardiaToken,
            'Content-Type: application/json'
        ];

        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);

        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new \Exception("cURL Error: {$error}");
        }

        return [
            'body' => json_decode($response, true) ?? ['error' => 'Invalid response'],
            'status' => $httpCode
        ];
    }

    /**
     * Construir datos multipart para subida de archivos
     */
    private function buildMultipartData($fields, $delimiter)
    {
        $data = '';
        
        foreach ($fields as $name => $value) {
            if (is_array($value)) {
                // Campo de archivo
                $data .= "--{$delimiter}\r\n";
                $data .= "Content-Disposition: form-data; name=\"{$name}\"; filename=\"{$value['filename']}\"\r\n";
                $data .= "Content-Type: {$value['mimetype']}\r\n\r\n";
                $data .= $value['content'] . "\r\n";
            } else {
                // Campo de texto
                $data .= "--{$delimiter}\r\n";
                $data .= "Content-Disposition: form-data; name=\"{$name}\"\r\n\r\n";
                $data .= $value . "\r\n";
            }
        }
        
        $data .= "--{$delimiter}--\r\n";
        
        return $data;
    }
}

