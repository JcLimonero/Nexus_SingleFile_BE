<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

/**
 * Subida directa a Backblaze B2 sin pasar por la API de Vanguardia.
 * Usa la API nativa de Backblaze: b2_authorize_account -> b2_get_upload_url -> b2_upload_file
 */
class BackblazeDirectUpload extends BaseController
{
    /**
     * POST /api/backblaze/direct-upload
     * Sube un archivo directamente a Backblaze B2 y actualiza file_document
     */
    public function upload()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            // Aceptar 'file' (frontend) o 'expedient' (miniportal)
            $file = $this->request->getFile('file') ?? $this->request->getFile('expedient');
            $idSingleFile = $this->request->getPost('idSingleFile');
            $idDocumentFile = $this->request->getPost('idDocumentFile');

            if (!$file || !$file->isValid()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Archivo no válido o no proporcionado'
                ])->setStatusCode(400);
            }

            if (!$idSingleFile || !$idDocumentFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'idSingleFile e idDocumentFile son requeridos'
                ])->setStatusCode(400);
            }

            return $this->performUpload($file, (string) $idSingleFile, (string) $idDocumentFile);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al subir archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Realiza la subida a Backblaze B2 (sin verificación de auth).
     * Usado por Miniportal que valida con share token.
     */
    public function performUpload($file, string $idSingleFile, string $idDocumentFile)
    {
        try {
            $fileName = $this->getFileNameFromView($idDocumentFile, $idSingleFile, $file);
            $b2Path = $this->buildBackblazePath($idSingleFile, $idDocumentFile, $fileName);
            $fileContent = file_get_contents($file->getTempName());
            $mimeType = $file->getClientMimeType() ?: 'b2/x-auto';

            $config = $this->getBackblazeConfig();
            if (!$config) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configuración de Backblaze no encontrada. Configure backblaze_key_id, backblaze_application_key y backblaze_bucket_id en la tabla config.'
                ])->setStatusCode(500);
            }

            $bucketId = $this->resolveBucketId($config);
            if (!$bucketId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo obtener el bucket ID de Backblaze'
                ])->setStatusCode(500);
            }

            $auth = $this->b2AuthorizeAccount($config['keyId'], $config['applicationKey']);
            if (!$auth) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al autenticar con Backblaze B2'
                ])->setStatusCode(500);
            }

            $uploadUrlData = $this->b2GetUploadUrl($auth, $bucketId);
            if (!$uploadUrlData) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al obtener URL de subida de Backblaze'
                ])->setStatusCode(500);
            }

            $uploadResult = $this->b2UploadFile(
                $uploadUrlData['uploadUrl'],
                $uploadUrlData['authorizationToken'],
                $b2Path,
                $fileContent,
                $mimeType
            );

            if (!$uploadResult) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al subir archivo a Backblaze'
                ])->setStatusCode(500);
            }

            $fileId = $uploadResult['fileId'] ?? null;
            if (!$fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Backblaze no devolvió el ID del archivo'
                ])->setStatusCode(500);
            }

            $this->updateFileDocument($idDocumentFile, (string) $fileId, $fileName);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento subido exitosamente',
                'data' => [
                    'fileId' => $fileId,
                    'fileName' => $fileName,
                    'documentContainer' => $fileId
                ]
            ]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al subir archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/backblaze/get-private-url?file={fileId}&duration=3600
     * Genera URL de descarga para archivos en nuestro bucket Backblaze (subidos con direct-upload).
     */
    public function getPrivateUrl()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $fileId = $this->request->getGet('file');
            $duration = (int) ($this->request->getGet('duration') ?? 3600);
            if (empty($fileId)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro file es requerido'
                ])->setStatusCode(400);
            }

            $token = bin2hex(random_bytes(16));
            $cache = \Config\Services::cache();
            $cache->save("b2_download_{$token}", ['fileId' => $fileId], $duration);

            // Usar baseUrl del frontend (localhost en dev) si se envía; si no, usar la del request
            $baseUrl = trim($this->request->getGet('baseUrl') ?? '');
            if (empty($baseUrl) || !preg_match('#^https?://#', $baseUrl)) {
                $baseUrl = rtrim($this->request->getUri()->getBaseURL(), '/');
            }
            $baseUrl = rtrim($baseUrl, '/');
            $url = "{$baseUrl}/api/backblaze/download?file=" . rawurlencode($fileId) . "&token={$token}";

            return $this->response->setJSON([
                'success' => true,
                'data' => ['url' => $url]
            ]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar URL: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/backblaze/download?file={fileId}&token={token}
     * Descarga archivo desde nuestro bucket Backblaze (requiere token de get-private-url).
     */
    public function download()
    {
        try {
            $fileId = $this->request->getGet('file');
            $token = $this->request->getGet('token');
            if (empty($fileId) || empty($token)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetros file y token requeridos'
                ])->setStatusCode(400);
            }

            $cache = \Config\Services::cache();
            $cached = $cache->get("b2_download_{$token}");
            if (!$cached || ($cached['fileId'] ?? '') !== $fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token inválido o expirado'
                ])->setStatusCode(403);
            }

            $config = $this->getBackblazeConfig();
            if (!$config) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configuración de Backblaze no encontrada'
                ])->setStatusCode(500);
            }

            $auth = $this->b2AuthorizeAccount($config['keyId'], $config['applicationKey']);
            if (!$auth) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al autenticar con Backblaze'
                ])->setStatusCode(500);
            }

            $downloadUrl = $auth['downloadUrl'] ?? $auth['apiUrl'];
            $url = rtrim($downloadUrl, '/') . '/b2api/v1/b2_download_file_by_id?fileId=' . rawurlencode($fileId);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: ' . ($auth['authorizationToken'] ?? ''),
                ],
                CURLOPT_HEADER => true,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);

            $response = curl_exec($ch);
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                $body = substr($response, $headerSize);

                $err = json_decode($body, true);
                return $this->response->setJSON([
                    'success' => false,
                    'message' => $err['message'] ?? 'Archivo no encontrado en Backblaze'
                ])->setStatusCode($httpCode >= 400 ? $httpCode : 500);
            }

            $headers = substr($response, 0, $headerSize);
            $body = substr($response, $headerSize);

            $contentType = 'application/octet-stream';
            $contentDisposition = 'inline';
            foreach (explode("\r\n", $headers) as $line) {
                if (stripos($line, 'Content-Type:') === 0) {
                    $contentType = trim(substr($line, 13));
                }
                if (stripos($line, 'X-Bz-File-Name:') === 0) {
                    $fullPath = trim(substr($line, 15));
                    $fullPath = rawurldecode($fullPath);
                    $fileName = basename($fullPath);
                    $contentDisposition = 'inline; filename="' . str_replace('"', '\\"', $fileName) . '"';
                }
            }

            return $this->response
                ->setHeader('Content-Type', $contentType)
                ->setHeader('Content-Disposition', $contentDisposition)
                ->setBody($body);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al descargar: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    private function getBackblazeConfig(): ?array
    {
        $db = \Config\Database::connect();
        $rows = $db->table('config')
            ->select('config_key, config_value')
            ->where('category', 'backblaze')
            ->get()
            ->getResultArray();

        $config = [];
        foreach ($rows as $row) {
            $config[$row['config_key']] = trim($row['config_value'] ?? '');
        }

        if (empty($config['backblaze_key_id']) || empty($config['backblaze_application_key'])) {
            return null;
        }

        return [
            'keyId' => $config['backblaze_key_id'],
            'applicationKey' => $config['backblaze_application_key'],
            'bucketId' => $config['backblaze_bucket_id'] ?? '',
            'bucketName' => $config['backblaze_bucket_name'] ?? '',
        ];
    }

    /**
     * Resuelve bucket ID: si backblaze_bucket_id parece nombre (ej: demo-nexus), usa b2_list_buckets
     */
    private function resolveBucketId(array $config): ?string
    {
        $bucketIdOrName = $config['bucketId'] ?? $config['bucketName'] ?? '';
        if (empty($bucketIdOrName)) {
            return null;
        }
        // Bucket ID típico de B2: 24 caracteres alfanuméricos
        if (preg_match('/^[a-f0-9]{24}$/i', $bucketIdOrName)) {
            return $bucketIdOrName;
        }
        // Parece nombre de bucket, obtener ID desde b2_list_buckets
        $auth = $this->b2AuthorizeAccount($config['keyId'], $config['applicationKey']);
        if (!$auth) {
            return null;
        }
        $apiUrl = $auth['apiUrl'] ?? 'https://api.backblazeb2.com';
        $accountId = $auth['accountId'] ?? '';
        $buckets = $this->b2ListBuckets($apiUrl, $auth['authorizationToken'], $accountId);
        if (!$buckets) {
            return null;
        }
        foreach ($buckets as $b) {
            if (($b['bucketName'] ?? '') === $bucketIdOrName || ($b['bucketId'] ?? '') === $bucketIdOrName) {
                return $b['bucketId'] ?? null;
            }
        }
        return null;
    }

    private function b2AuthorizeAccount(string $keyId, string $applicationKey): ?array
    {
        $auth = base64_encode($keyId . ':' . $applicationKey);
        $ch = curl_init('https://api.backblazeb2.com/b2api/v2/b2_authorize_account');
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => ['Authorization: Basic ' . $auth],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {

            return null;
        }

        $data = json_decode($response, true);
        $apiUrl = $data['apiUrl'] ?? ($data['apiInfo']['storageApi']['apiUrl'] ?? 'https://api.backblazeb2.com');
        $downloadUrl = $data['downloadUrl'] ?? ($data['apiInfo']['storageApi']['downloadUrl'] ?? $apiUrl);
        return [
            'authorizationToken' => $data['authorizationToken'] ?? null,
            'apiUrl' => $apiUrl,
            'downloadUrl' => rtrim($downloadUrl, '/'),
            'accountId' => $data['accountId'] ?? '',
        ];
    }

    private function b2ListBuckets(string $apiUrl, string $authToken, string $accountId = ''): ?array
    {
        $url = rtrim($apiUrl, '/') . '/b2api/v2/b2_list_buckets';
        $body = json_encode(['accountId' => $accountId]);
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $authToken,
                'Content-Type: application/json',
            ],
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode !== 200 || !$response) {
            return null;
        }
        $data = json_decode($response, true);
        return $data['buckets'] ?? null;
    }

    private function b2GetUploadUrl(array $auth, string $bucketId): ?array
    {
        $apiUrl = $auth['apiUrl'] ?? 'https://api.backblazeb2.com';
        $url = rtrim($apiUrl, '/') . '/b2api/v2/b2_get_upload_url';
        $body = json_encode(['bucketId' => $bucketId]);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . ($auth['authorizationToken'] ?? ''),
                'Content-Type: application/json',
            ],
            CURLOPT_SSL_VERIFYPEER => true,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {

            return null;
        }

        return json_decode($response, true);
    }

    private function b2UploadFile(
        string $uploadUrl,
        string $authToken,
        string $fileName,
        string $content,
        string $contentType
    ): ?array {
        $sha1 = sha1($content);

        $ch = curl_init($uploadUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $content,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $authToken,
                'X-Bz-File-Name: ' . rawurlencode($fileName),
                'Content-Type: ' . $contentType,
                'X-Bz-Content-Sha1: ' . $sha1,
                'Content-Length: ' . strlen($content),
            ],
            CURLOPT_SSL_VERIFYPEER => true,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {

            return null;
        }

        return json_decode($response, true);
    }

    /**
     * Construye la ruta en Backblaze: Compañia/Agencia/año/mes(texto)/id_order_total/[id_dms(Cliente)]_nombre archivo
     * id_dms es el id del cliente en client_dms_relation
     */
    private function buildBackblazePath(string $idSingleFile, string $idDocumentFile, string $fileName): string
    {
        $db = \Config\Database::connect();
        $row = $db->query(
            "SELECT 
                e.id_order_total,
                e.registration_date,
                e.id_client,
                e.id_agency,
                a.name AS agency_name,
                c.name AS company_name,
                ctr.id_dms AS id_dms_cliente
            FROM file_document fd
            INNER JOIN expedient e ON e.id = fd.id_file
            LEFT JOIN agency a ON a.id = e.id_agency
            LEFT JOIN company c ON c.id = a.id_company
            LEFT JOIN client_header hc ON hc.id_client = e.id_client
            LEFT JOIN client_dms_relation ctr ON ctr.id_client_header = hc.id AND ctr.id_agency = e.id_agency
            WHERE fd.id = ?",
            [(int) $idDocumentFile]
        )->getRow();

        if (!$row) {
            $year = date('Y');
            $meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            $mes = $meses[(int) date('n') - 1];
            $fileName = $this->sanitizeFileName($fileName);
            return trim("SinCompania/SinAgencia/{$year}/{$mes}/sin-pedido/sin-cliente_{$fileName}", '/');
        }

        $company = $row->company_name ?? 'SinCompania';
        $agency = $row->agency_name ?? 'SinAgencia';
        $idOrderTotal = $row->id_order_total ?? 'sin-pedido';
        $idDmsCliente = $row->id_dms_cliente ?? null;
        $regDate = $row->registration_date ?? date('Y-m-d H:i:s');

        $year = date('Y', strtotime($regDate));
        $meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        $mes = $meses[(int) date('n', strtotime($regDate)) - 1];

        $company = $this->sanitizePathSegment($company);
        $agency = $this->sanitizePathSegment($agency);
        $idOrderTotal = $this->sanitizePathSegment((string) $idOrderTotal);
        $fileName = $this->sanitizeFileName($fileName);
        $idDmsCliente = trim((string) $idDmsCliente) !== '' ? $this->sanitizePathSegment((string) $idDmsCliente) : 'sin-cliente';
        $finalFileName = $idDmsCliente . '_' . $fileName;

        return trim("{$company}/{$agency}/{$year}/{$mes}/{$idOrderTotal}/{$finalFileName}", '/');
    }

    private function sanitizePathSegment(string $s): string
    {
        $s = trim($s);
        $s = preg_replace('/[^\p{L}\p{N}\s\-_\.]/u', '', $s);
        $s = preg_replace('/\s+/', '_', $s);
        return $s ?: 'sin_nombre';
    }

    private function sanitizeFileName(string $s): string
    {
        $s = trim($s);
        $s = str_replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], '_', $s);
        $s = preg_replace('/[^\p{L}\p{N}\s\-_\.]/u', '', $s);
        $s = preg_replace('/\s+/', '_', $s);
        return $s ?: 'documento';
    }

    private function getFileNameFromView($idFileDocument, $idFile, $file): string
    {
        try {
            $db = \Config\Database::connect();
            $query = $db->query(
                "SELECT file_name_original FROM view_document_name WHERE IdFileDocument = ? AND IdFile = ?",
                [$idFileDocument, $idFile]
            );
            $result = $query->getRow();

            if ($result && !empty($result->file_name_original)) {
                $extension = pathinfo($file->getClientName(), PATHINFO_EXTENSION);
                $fileNameBase = pathinfo($result->file_name_original, PATHINFO_FILENAME);
                return $fileNameBase . ($extension ? '.' . $extension : '');
            }
        } catch (\Exception $e) {

        }

        return $file->getClientName();
    }

    private function updateFileDocument(string $idFileDocument, string $documentContainer, string $fileName): void
    {
        $db = \Config\Database::connect();
        $db->table('file_document')
            ->where('id', $idFileDocument)
            ->update([
                'id_document_container' => $documentContainer,
                'name' => $fileName,
                'id_current_status' => 2, // 2 = Documento cargado (uploaded)
                'comment' => null,        // Limpiar comentario de rechazo anterior
                'id_document_error' => null, // Limpiar error anterior
                'update_date' => date('Y-m-d H:i:s'),
            ]);
    }
}
