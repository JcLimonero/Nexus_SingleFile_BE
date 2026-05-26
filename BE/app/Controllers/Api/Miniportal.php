<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\FileShareTokenModel;
use App\Models\FilePldModel;
use App\Models\FilePldGeoLogModel;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * API pública del Miniportal - acceso sin autenticación mediante token UUID.
 * Usa expedient_pld y expedient_pld_geo_log (tablas PLD existentes) en lugar de tablas redundantes.
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

        $idFile = (int) $tokenData['id_expedient'];
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

        $idFile = (int) $tokenData['id_expedient'];
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

        // Siempre registrar en expedient_pld_geo_log la acción de aceptar aviso (auditoría PLD)
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
            (int) $tokenData['id_expedient'],
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

        $idFile = (int) $tokenData['id_expedient'];
        if (!$this->filePldModel->hasAvisoAceptado($idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Debe aceptar el aviso de confidencialidad primero'
            ])->setStatusCode(403);
        }

        // Aceptar 'expedient' (legacy) o 'file' (miniportal frontend)
        $file = $this->request->getFile('expedient') ?? $this->request->getFile('file');
        $idFileDocument = (int) ($this->request->getPost('idFileDocument') ?? $this->request->getPost('idDocumentFile') ?? $this->request->getPost('idDocumentByFile') ?? 0);

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

        $doc = $this->db->table('expedient_document dbf')
            ->select('dbf.id, dbf.id_expedient')
            ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
            ->where('dbf.id', $idFileDocument)
            ->where('dbf.id_expedient', $idFile)
            ->where('dbf.enabled', 1)
            ->where('dt.available_to_client', 1)
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

        // Usar subida directa a Backblaze (nuestra BD) en lugar de NexFile
        $uploader = new \App\Controllers\Api\BackblazeDirectUpload();
        $uploader->initController($this->request, $this->response, \Config\Services::logger());
        return $uploader->performUpload($file, (string) $idFile, (string) $idFileDocument);
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
                "SELECT file_name_original FROM view_document_name WHERE IdFileDocument = ? AND id_expedient = ?",
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

        $idFile = (int) $tokenData['id_expedient'];
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

        $idFile = (int) $tokenData['id_expedient'];
        $fileContainer = $this->request->getGet('file');
        if (!$fileContainer) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Parámetro file es requerido'
            ])->setStatusCode(400);
        }

        $exists = $this->db->table('expedient_document dbf')
            ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
            ->where('dbf.id_expedient', $idFile)
            ->where('dbf.id_document_container', $fileContainer)
            ->where('dbf.enabled', 1)
            ->where('dt.available_to_client', 1)
            ->countAllResults();
        if (!$exists) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Documento no encontrado'
            ])->setStatusCode(404);
        }

        $duration = (int) ($this->request->getGet('duration') ?? 3600);
        $baseUrl = rtrim($this->request->getUri()->getBaseURL(), '/');
        $backblaze = new BackblazeDirectUpload();
        $backblaze->initController($this->request, $this->response, \Config\Services::logger());
        $result = $backblaze->generatePrivateUrlForFile($fileContainer, $duration, $baseUrl);
        $url = $result['url'] ?? null;
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

        $idFile = (int) $tokenData['id_expedient'];
        if (!$this->filePldModel->hasAvisoAceptado($idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Debe aceptar el aviso de confidencialidad primero'
            ])->setStatusCode(403);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $idFileDocument = (int) ($data['idFileDocument'] ?? $data['idDocumentFile'] ?? $data['idDocumentByFile'] ?? 0);

        if (!$idFileDocument) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'idFileDocument es requerido'
            ])->setStatusCode(400);
        }

        $doc = $this->db->table('expedient_document dbf')
            ->select('dbf.id, dbf.id_expedient, dbf.id_current_document_status')
            ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
            ->where('dbf.id', $idFileDocument)
            ->where('dbf.id_expedient', $idFile)
            ->where('dbf.enabled', 1)
            ->where('dt.available_to_client', 1)
            ->get()
            ->getRowArray();

        if (!$doc) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Documento no encontrado o no autorizado'
            ])->setStatusCode(404);
        }

        if ((int) ($doc['id_current_document_status'] ?? 0) !== 4) {
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
            $this->db->table('expedient_pld_approved_document')->insert([
                'id_expedient_document' => $idFileDocument,
                'id_expedient' => $idFile,
                'approved_by_client' => 1,
                'approval_date' => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Miniportal::approveDocument - ' . $e->getMessage());
            $msg = 'Error al registrar aprobación';
            if (ENVIRONMENT !== 'production') {
                $msg .= ': ' . $e->getMessage();
            }
            return $this->response->setJSON([
                'success' => false,
                'message' => $msg
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
            $row = $this->db->table('expedient_pld_approved_document')
                ->where('id_expedient_document', $idFileDocument)
                ->where('id_expedient', $idFile)
                ->where('approved_by_client', 1)
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
                    dbf.id as idFileDocument,
                    dbf.id as idDocumentByFile,
                    dbf.id_current_document_status as idEstatus,
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
                FROM expedient_document dbf
                INNER JOIN expedient f ON dbf.id_expedient = f.id
                INNER JOIN sale_type p ON f.id_sale_type = p.id
                INNER JOIN document_type dt ON dbf.id_document_type = dt.id
                INNER JOIN expedient_state fs ON dt.id_sale_type = fs.id
                INNER JOIN document_status dfs ON dbf.id_current_document_status = dfs.id
                LEFT JOIN expedient_pld_approved_document ap ON ap.id_expedient_document = dbf.id AND ap.id_expedient = dbf.id_expedient AND ap.approved_by_client = 1
                WHERE dbf.id_expedient = ?
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
        $builder = $this->db->table('expedient_document dbf');
        $results = $builder
            ->select('
                dbf.id as idFileDocument,
                dbf.id as idDocumentByFile,
                dbf.id_current_document_status as idEstatus,
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
            ->join('expedient f', 'dbf.id_expedient = f.id', 'inner')
            ->join('sale_type p', 'f.id_sale_type = p.id', 'inner')
            ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
            ->join('expedient_state fs', 'dt.id_sale_type = fs.id', 'inner')
            ->join('document_status dfs', 'dbf.id_current_document_status = dfs.id', 'inner')
            ->where('dbf.id_expedient', $idFile)
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
                COALESCE(NULLIF(TRIM(c.business_name), ''), TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))) as cliente,
                a.name as agencia,
                COALESCE(obc1.vin, obc2.vin) as vin,
                COALESCE(obc1.model, obc2.model) as modelo,
                COALESCE(obc1.year, obc2.year) as year,
                COALESCE(obc1.car_type, obc2.car_type) as version
            FROM expedient f
            INNER JOIN client c ON f.id_client = c.id
            INNER JOIN agency a ON f.id_agency = a.id
            LEFT JOIN expedient_state fs ON f.id_current_expedient_state = fs.id
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
            WHERE f.id = ? AND f.id_current_expedient_state != 5
        ";
        $query = $this->db->query($sql, [$idFile]);
        $row = $query->getRowArray();
        return $row ?: null;
    }
}
