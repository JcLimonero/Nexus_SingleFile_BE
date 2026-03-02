<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\FileShareTokenModel;
use App\Models\FilePldModel;
use App\Models\FilePldGeoLogModel;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * API pública del Miniportal - acceso sin autenticación mediante token UUID.
 * Usa file_pld y file_pld_geolog (tablas PLD existentes) en lugar de tablas redundantes.
 */
class Miniportal extends BaseController
{
    protected $shareTokenModel;
    protected $filePldModel;
    protected $geoLogModel;
    protected $db;

    public function __construct()
    {
        $this->shareTokenModel = new FileShareTokenModel();
        $this->filePldModel = new FilePldModel();
        $this->geoLogModel = new FilePldGeoLogModel();
        $this->db = \Config\Database::connect();
    }

    /**
     * GET /api/miniportal/:token
     * Validar token y devolver información del expediente para el miniportal
     */
    public function getExpediente(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $idFile = (int) $tokenData['IdFile'];
        $expediente = $this->getExpedienteInfo($idFile);
        if (!$expediente) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Expediente no encontrado'
            ])->setStatusCode(404);
        }

        $avisoAceptado = $this->filePldModel->hasAvisoAceptado($idFile);

        return $this->response->setJSON([
            'success' => true,
            'data' => [
                'expediente' => $expediente,
                'avisoAceptado' => $avisoAceptado,
                'token' => $token
            ]
        ]);
    }

    /**
     * POST /api/miniportal/:token/accept
     * Aceptar aviso de confidencialidad (con geolocalización opcional)
     */
    public function acceptAviso(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $idFile = (int) $tokenData['IdFile'];
        if ($this->filePldModel->hasAvisoAceptado($idFile)) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Aviso ya fue aceptado previamente'
            ]);
        }

        $data = $this->request->getJSON(true) ?? [];
        $signatureData = $data['signatureData'] ?? null;
        $lat = $data['latitud'] ?? null;
        $lon = $data['longitud'] ?? null;

        $this->filePldModel->recordAvisoMiniportal($idFile, $signatureData);

        // Siempre registrar en file_pld_geolog la acción de aceptar aviso (auditoría PLD)
        if ($lat !== null && $lon !== null && is_numeric($lat) && is_numeric($lon)) {
            $this->geoLogModel->log($idFile, (float) $lat, (float) $lon, 'Aceptar aviso');
        } else {
            $this->geoLogModel->log($idFile, 0.0, 0.0, 'Aceptar aviso');
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Aviso de confidencialidad aceptado'
        ]);
    }

    /**
     * POST /api/miniportal/:token/geolocation
     * Registrar geolocalización (para cualquier acción)
     */
    public function logGeolocation(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $data = $this->request->getJSON(true) ?? [];
        $lat = $data['latitud'] ?? $data['lat'] ?? null;
        $lon = $data['longitud'] ?? $data['lng'] ?? null;
        $accion = $data['accion'] ?? 'Ver expediente';

        if ($lat === null || $lon === null || !is_numeric($lat) || !is_numeric($lon)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'latitud y longitud son requeridos'
            ])->setStatusCode(400);
        }

        $this->geoLogModel->log(
            (int) $tokenData['IdFile'],
            (float) $lat,
            (float) $lon,
            $accion
        );

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Geolocalización registrada'
        ]);
    }

    /**
     * POST /api/miniportal/:token/upload
     * Subir documento (solo tipos marcados AvailableToClient=1)
     */
    public function uploadDocument(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $idFile = (int) $tokenData['IdFile'];
        if (!$this->filePldModel->hasAvisoAceptado($idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Debe aceptar el aviso de confidencialidad primero'
            ])->setStatusCode(403);
        }

        $file = $this->request->getFile('expedient');
        $idFileDocument = (int) ($this->request->getPost('idFileDocument') ?? $this->request->getPost('idDocumentFile') ?? 0);

        if (!$file || !$file->isValid()) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Archivo no válido o no proporcionado'
            ])->setStatusCode(400);
        }

        if (!$idFileDocument) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'idFileDocument es requerido'
            ])->setStatusCode(400);
        }

        $doc = $this->db->table('file_document dbf')
            ->select('dbf.Id, dbf.IdFile')
            ->join('document_type dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->where('dbf.Id', $idFileDocument)
            ->where('dbf.IdFile', $idFile)
            ->where('dbf.Enabled', 1)
            ->where('dt.AvailableToClient', 1)
            ->get()
            ->getRowArray();

        if (!$doc) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Documento no autorizado para carga por cliente'
            ])->setStatusCode(403);
        }

        if ($this->isDocumentoAprobadoPorCliente($idFileDocument, $idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Este documento ya fue aprobado por el cliente y no puede modificarse'
            ])->setStatusCode(403);
        }

        $fileName = $this->getFileNameFromView($idFileDocument, $idFile, $file);
        $vanguardiaUrl = 'https://apisvanguardia.com:400/backblaze/upload';
        $vanguardiaToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';
        $boundary = uniqid();
        $delimiter = '-------------' . $boundary;

        $postData = $this->buildMultipartData([
            'expedient' => [
                'filename' => $fileName,
                'content' => file_get_contents($file->getTempName()),
                'mimetype' => $file->getClientMimeType()
            ],
            'idSingleFile' => (string) $idFile,
            'idDocumentFile' => (string) $idFileDocument
        ], $delimiter);

        $ch = curl_init($vanguardiaUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'X-Provider-Token: ' . $vanguardiaToken,
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
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al subir: ' . $error
            ])->setStatusCode(500);
        }

        $responseData = json_decode($response, true);

        if ($httpCode >= 400) {
            return $this->response->setJSON($responseData ?? [
                'success' => false,
                'message' => 'Error al subir el documento'
            ])->setStatusCode($httpCode);
        }

        return $this->response->setJSON($responseData ?? ['success' => true, 'message' => 'Documento subido']);
    }

    private function buildMultipartData(array $fields, string $delimiter): string
    {
        $data = '';
        foreach ($fields as $name => $value) {
            if (is_array($value)) {
                $data .= "--{$delimiter}\r\n";
                $data .= "Content-Disposition: form-data; name=\"{$name}\"; filename=\"{$value['filename']}\"\r\n";
                $data .= "Content-Type: {$value['mimetype']}\r\n\r\n";
                $data .= $value['content'] . "\r\n";
            } else {
                $data .= "--{$delimiter}\r\n";
                $data .= "Content-Disposition: form-data; name=\"{$name}\"\r\n\r\n";
                $data .= $value . "\r\n";
            }
        }
        $data .= "--{$delimiter}--\r\n";
        return $data;
    }

    private function getFileNameFromView($idFileDocument, $idFile, $file): string
    {
        try {
            $query = $this->db->query(
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
            error_log("Miniportal::getFileNameFromView: " . $e->getMessage());
        }
        return $file->getClientName();
    }

    /**
     * GET /api/miniportal/:token/documents
     * Obtener documentos del expediente (solo si aviso aceptado)
     */
    public function getDocumentos(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $idFile = (int) $tokenData['IdFile'];
        if (!$this->filePldModel->hasAvisoAceptado($idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Debe aceptar el aviso de confidencialidad primero'
            ])->setStatusCode(403);
        }

        $documentos = $this->getDocumentosByFile($idFile);

        return $this->response->setJSON([
            'success' => true,
            'data' => $documentos
        ]);
    }

    /**
     * GET /api/miniportal/:token/document-url?file=xxx
     * Obtener URL firmada para ver un documento (valida que pertenezca al expediente)
     */
    public function getDocumentUrl(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $idFile = (int) $tokenData['IdFile'];
        $fileContainer = $this->request->getGet('expedient');
        if (!$fileContainer) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Parámetro file es requerido'
            ])->setStatusCode(400);
        }

        $exists = $this->db->table('file_document dbf')
            ->join('document_type dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->where('dbf.IdFile', $idFile)
            ->where('dbf.id_document_container', $fileContainer)
            ->where('dbf.Enabled', 1)
            ->where('dt.AvailableToClient', 1)
            ->countAllResults();
        if (!$exists) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Documento no encontrado'
            ])->setStatusCode(404);
        }

        $duration = (int) ($this->request->getGet('duration') ?? 3600);
        $vanguardiaUrl = "https://apisvanguardia.com:400/backblaze/get-private-url?file=" . urlencode($fileContainer) . "&duration={$duration}";
        $vanguardiaToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';

        $ch = curl_init($vanguardiaUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'X-Provider-Token: ' . $vanguardiaToken,
                'Content-Type: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);
        $resp = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $body = json_decode($resp, true);
        if (!$body || $httpCode >= 400) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener URL del documento'
            ])->setStatusCode(500);
        }

        $url = $body['url'] ?? ($body['data']['url'] ?? null);
        if (!$url) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se obtuvo URL del documento'
            ])->setStatusCode(500);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => ['url' => $url]
        ]);
    }

    /**
     * POST /api/miniportal/:token/approve-document
     * Marcar documento como aprobado por el cliente (no se puede modificar después)
     */
    public function approveDocument(string $token)
    {
        $tokenData = $this->shareTokenModel->validateToken($token);
        if (!$tokenData) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Enlace inválido o expirado'
            ])->setStatusCode(404);
        }

        $idFile = (int) $tokenData['IdFile'];
        if (!$this->filePldModel->hasAvisoAceptado($idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Debe aceptar el aviso de confidencialidad primero'
            ])->setStatusCode(403);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $idFileDocument = (int) ($data['idFileDocument'] ?? $data['idDocumentFile'] ?? 0);

        if (!$idFileDocument) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'idFileDocument es requerido'
            ])->setStatusCode(400);
        }

        $doc = $this->db->table('file_document dbf')
            ->select('dbf.Id, dbf.IdFile, dbf.IdCurrentStatus')
            ->join('document_type dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->where('dbf.Id', $idFileDocument)
            ->where('dbf.IdFile', $idFile)
            ->where('dbf.Enabled', 1)
            ->where('dt.AvailableToClient', 1)
            ->get()
            ->getRowArray();

        if (!$doc) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Documento no encontrado o no autorizado'
            ])->setStatusCode(404);
        }

        if ((int) ($doc['IdCurrentStatus'] ?? 0) !== 4) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Solo se puede aprobar cuando el documento está en estatus 4'
            ])->setStatusCode(403);
        }

        if ($this->isDocumentoAprobadoPorCliente($idFileDocument, $idFile)) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento ya estaba aprobado'
            ]);
        }

        try {
            $this->db->table('file_pld_documento_aprobado')->insert([
                'IdFileDocument' => $idFileDocument,
                'IdFile' => $idFile,
                'AprobadoCliente' => 1,
                'FechaAprobacion' => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Miniportal::approveDocument - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al registrar aprobación'
            ])->setStatusCode(500);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Documento aprobado correctamente. Ya no podrá modificarse.'
        ]);
    }

    /**
     * Verificar si el documento fue aprobado por el cliente
     */
    private function isDocumentoAprobadoPorCliente(int $idFileDocument, int $idFile): bool
    {
        try {
            $row = $this->db->table('file_pld_documento_aprobado')
                ->where('IdFileDocument', $idFileDocument)
                ->where('IdFile', $idFile)
                ->where('AprobadoCliente', 1)
                ->get()
                ->getRowArray();
            return !empty($row);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Obtener documentos del expediente para miniportal
     */
    private function getDocumentosByFile(int $idFile): array
    {
        try {
            $sql = "
                SELECT
                    dbf.Id as idFileDocument,
                    dbf.Id as idDocumentByFile,
                    dbf.id_current_status as idEstatus,
                    dbf.comment as comentarioRechazo,
                    p.name as proceso,
                    fs.name as fase,
                    dbf.name as documento,
                    dt.name as tipoDocumento,
                    dfs.name as estatus,
                    dbf.registration_date as fecha,
                    dbf.id_document_container as documentContainer,
                    dt.available_to_client as DisponibleCliente,
                    COALESCE(dt.required, 1) as requerido,
                    CASE WHEN ap.id IS NOT NULL THEN 1 ELSE 0 END as aprobadoCliente
                FROM file_document dbf
                INNER JOIN expedient f ON dbf.id_file = f.id
                INNER JOIN process p ON f.id_process = p.id
                INNER JOIN document_type dt ON dbf.id_document_type = dt.id
                INNER JOIN file_status fs ON dt.id_process_type = fs.id
                INNER JOIN document_file_status dfs ON dbf.id_current_status = dfs.id
                LEFT JOIN file_pld_documento_aprobado ap ON ap.id_file_document = dbf.id AND ap.id_file = dbf.id_file AND ap.aprobado_cliente = 1
                WHERE dbf.id_file = ?
                AND dbf.enabled = 1
                AND dt.available_to_client = 1
                ORDER BY p.name ASC, fs.name ASC, dt.name ASC
            ";
            $query = $this->db->query($sql, [$idFile]);
            return $query->getResultArray();
        } catch (\Exception $e) {
            error_log("Miniportal::getDocumentosByFile - " . $e->getMessage());
            if (strpos($e->getMessage(), "doesn't exist") !== false) {
                return $this->getDocumentosByFileFallback($idFile);
            }
            throw $e;
        }
    }

    private function getDocumentosByFileFallback(int $idFile): array
    {
        $builder = $this->db->table('file_document dbf');
        $results = $builder
            ->select('
                dbf.id as idFileDocument,
                dbf.id as idDocumentByFile,
                dbf.id_current_status as idEstatus,
                dbf.comment as comentarioRechazo,
                p.name as proceso,
                fs.name as fase,
                dbf.name as documento,
                dt.name as tipoDocumento,
                dfs.name as estatus,
                dbf.registration_date as fecha,
                dbf.id_document_container as documentContainer,
                dt.available_to_client as DisponibleCliente,
                COALESCE(dt.required, 1) as requerido,
                0 as aprobadoCliente
            ')
            ->join('expedient f', 'dbf.id_file = f.id', 'inner')
            ->join('process p', 'f.id_process = p.id', 'inner')
            ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
            ->join('file_status fs', 'dt.id_process_type = fs.id', 'inner')
            ->join('document_file_status dfs', 'dbf.id_current_status = dfs.id', 'inner')
            ->where('dbf.id_file', $idFile)
            ->where('dbf.enabled', 1)
            ->where('dt.available_to_client', 1)
            ->orderBy('p.name', 'ASC')
            ->orderBy('fs.name', 'ASC')
            ->orderBy('dt.name', 'ASC')
            ->get()
            ->getResultArray();

        return $results;
    }

    /**
     * Obtener información básica del expediente para el miniportal
     */
    private function getExpedienteInfo(int $idFile): ?array
    {
        $sql = "
            SELECT
                f.id as idFile,
                f.id_order_total as ndPedido,
                f.registration_date as fechaRegistro,
                fs.name as estatus,
                COALESCE(NULLIF(TRIM(c.razon_social), ''), TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))) as cliente,
                a.name as agencia,
                COALESCE(obc1.vin, obc2.vin) as vin,
                COALESCE(obc1.model, obc2.model) as modelo,
                COALESCE(obc1.year, obc2.year) as year,
                COALESCE(obc1.car_type, obc2.car_type) as version
            FROM expedient f
            INNER JOIN client c ON f.id_client = c.id
            INNER JOIN agency a ON f.id_agency = a.id
            LEFT JOIN file_status fs ON f.id_current_state = fs.id
            LEFT JOIN `order` obc1 ON obc1.id = f.id_order
            LEFT JOIN (
                SELECT obc2a.id_dms, obc2a.id_agency, obc2a.vin, obc2a.model, obc2a.year, obc2a.car_type
                FROM `order` obc2a
                INNER JOIN (
                    SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) as MaxDate
                    FROM `order`
                    GROUP BY id_dms, id_agency
                ) obc2b ON obc2a.id_dms = obc2b.id_dms
                    AND obc2a.id_agency = obc2b.id_agency
                    AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
            ) obc2 ON f.id_order IS NULL
                AND obc2.id_dms = f.id_order_total
                AND obc2.id_agency = f.id_agency
            WHERE f.id = ? AND f.id_current_state != 5
        ";
        $query = $this->db->query($sql, [$idFile]);
        $row = $query->getRowArray();
        return $row ?: null;
    }
}
