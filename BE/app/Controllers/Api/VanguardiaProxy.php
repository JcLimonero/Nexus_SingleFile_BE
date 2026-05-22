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
    private const CURL_TIMEOUT     = 30;   // segundos
    private const CONNECT_TIMEOUT  = 10;   // segundos
    private const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

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
     * Proxy para facturas/pedidos DMS (singlefileinvoices)
     * GET /api/vgd/singlefileinvoices
     */
    public function singlefileInvoices()
    {
        try {
            $params = $this->request->getGet();
            $queryString = http_build_query($params);

            $url = "{$this->vanguardiaBaseUrl}/vgd/singlefileinvoices?{$queryString}";

            $response = $this->makeVanguardiaRequest('GET', $url);

            return $this->response
                ->setJSON($response['body'])
                ->setStatusCode($response['status']);

        } catch (\Exception $e) {
            error_log("Error en VanguardiaProxy::singlefileInvoices: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al consultar API singlefileinvoices: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Proxy para búsqueda de pedidos
     * GET /api/vgd/singlefileorderslastest
     */
    public function searchOrders()
    {
        try {
            $params = $this->request->getGet();
            $queryString = http_build_query($params);
            
            $url = "{$this->vanguardiaBaseUrl}/vgd/singlefileorderslastest?{$queryString}";
            
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
            $url = "{$this->vanguardiaBaseUrl}/backblaze/upload";

            $file           = $this->request->getFile('file');
            $idSingleFile   = $this->request->getPost('idSingleFile');
            $idDocumentFile = $this->request->getPost('idDocumentFile');

            if (!$file || !$file->isValid()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Archivo no válido o no proporcionado',
                ])->setStatusCode(400);
            }

            if ($file->getSize() > self::MAX_UPLOAD_BYTES) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => sprintf(
                        'El archivo excede el tamaño máximo permitido (%d MB).',
                        self::MAX_UPLOAD_BYTES / (1024 * 1024)
                    ),
                ])->setStatusCode(413);
            }

            $fileName = $this->getFileNameFromView($idDocumentFile, $idSingleFile, $file);

            // CURLFile streamea desde disco — evita cargar el archivo entero
            // en memoria (file_get_contents) y deja que cURL maneje el multipart.
            $postFields = [
                'file'           => new \CURLFile(
                    $file->getTempName(),
                    $file->getClientMimeType(),
                    $fileName
                ),
                'idSingleFile'   => $idSingleFile,
                'idDocumentFile' => $idDocumentFile,
            ];

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $postFields,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER     => [
                    'X-Provider-Token: ' . $this->vanguardiaToken,
                ],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT,
                CURLOPT_TIMEOUT        => self::CURL_TIMEOUT,
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error    = curl_error($ch);
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
                'message' => 'Error al subir archivo: ' . $e->getMessage(),
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
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT,
            CURLOPT_TIMEOUT        => self::CURL_TIMEOUT,
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
     * Obtener el nombre del archivo desde la vista view_document_name
     * Usa file_name_original de la vista pero mantiene la extensión del archivo subido
     */
    private function getFileNameFromView($idDocumentByFile, $idFile, $file)
    {
        try {
            $db = \Config\Database::connect();
            
            // Consultar la vista view_document_name
            $query = $db->query(
                "SELECT file_name_original FROM view_document_name WHERE IdDocumentByFile = ? AND IdFile = ?",
                [$idDocumentByFile, $idFile]
            );
            
            $result = $query->getRow();
            
            if ($result && !empty($result->file_name_original)) {
                // Obtener la extensión del archivo original que está subiendo el usuario
                $originalFileName = $file->getClientName();
                $extension = pathinfo($originalFileName, PATHINFO_EXTENSION);
                
                // Obtener el nombre base de la vista (sin extensión si tiene)
                $fileNameFromView = $result->file_name_original;
                $fileNameBase = pathinfo($fileNameFromView, PATHINFO_FILENAME);
                
                // Construir el nombre final: nombre de la vista + extensión del archivo subido
                $finalFileName = $fileNameBase . ($extension ? '.' . $extension : '');
                
                error_log("Nombre de archivo desde vista: {$fileNameFromView}");
                error_log("Extensión del archivo subido: {$extension}");
                error_log("Nombre final del archivo: {$finalFileName}");
                
                return $finalFileName;
            } else {
                // Si no se encuentra en la vista, usar el nombre original del archivo
                error_log("No se encontró registro en view_document_name para IdDocumentByFile={$idDocumentByFile}, IdFile={$idFile}. Usando nombre original del archivo.");
                return $file->getClientName();
            }
        } catch (\Exception $e) {
            // En caso de error, usar el nombre original del archivo
            error_log("Error al consultar view_document_name: " . $e->getMessage());
            return $file->getClientName();
        }
    }
}

