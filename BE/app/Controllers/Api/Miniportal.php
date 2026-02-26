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

        $file = $this->request->getFile('file');
        $idDocumentByFile = (int) ($this->request->getPost('idDocumentByFile') ?? $this->request->getPost('idDocumentFile') ?? 0);

        if (!$file || !$file->isValid()) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Archivo no válido o no proporcionado'
            ])->setStatusCode(400);
        }

        if (!$idDocumentByFile) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'idDocumentByFile es requerido'
            ])->setStatusCode(400);
        }

        $doc = $this->db->table('DocumentByFile dbf')
            ->select('dbf.Id, dbf.IdFile')
            ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->where('dbf.Id', $idDocumentByFile)
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

        if ($this->isDocumentoAprobadoPorCliente($idDocumentByFile, $idFile)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Este documento ya fue aprobado por el cliente y no puede modificarse'
            ])->setStatusCode(403);
        }

        $fileName = $this->getFileNameFromView($idDocumentByFile, $idFile, $file);
        $vanguardiaUrl = 'https://apisvanguardia.com:400/backblaze/upload';
        $vanguardiaToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';
        $boundary = uniqid();
        $delimiter = '-------------' . $boundary;

        $postData = $this->buildMultipartData([
            'file' => [
                'filename' => $fileName,
                'content' => file_get_contents($file->getTempName()),
                'mimetype' => $file->getClientMimeType()
            ],
            'idSingleFile' => (string) $idFile,
            'idDocumentFile' => (string) $idDocumentByFile
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

    private function getFileNameFromView($idDocumentByFile, $idFile, $file): string
    {
        try {
            $query = $this->db->query(
                "SELECT file_name_original FROM view_document_name WHERE IdDocumentByFile = ? AND IdFile = ?",
                [$idDocumentByFile, $idFile]
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
        $fileContainer = $this->request->getGet('file');
        if (!$fileContainer) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Parámetro file es requerido'
            ])->setStatusCode(400);
        }

        $exists = $this->db->table('DocumentByFile dbf')
            ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->where('dbf.IdFile', $idFile)
            ->where('dbf.IdDocumentContainer', $fileContainer)
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
        $idDocumentByFile = (int) ($data['idDocumentByFile'] ?? $data['idDocumentFile'] ?? 0);

        if (!$idDocumentByFile) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'idDocumentByFile es requerido'
            ])->setStatusCode(400);
        }

        $doc = $this->db->table('DocumentByFile dbf')
            ->select('dbf.Id, dbf.IdFile, dbf.IdCurrentStatus')
            ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->where('dbf.Id', $idDocumentByFile)
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

        if ($this->isDocumentoAprobadoPorCliente($idDocumentByFile, $idFile)) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento ya estaba aprobado'
            ]);
        }

        try {
            $this->db->table('file_pld_documento_aprobado')->insert([
                'IdDocumentByFile' => $idDocumentByFile,
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
    private function isDocumentoAprobadoPorCliente(int $idDocumentByFile, int $idFile): bool
    {
        try {
            $row = $this->db->table('file_pld_documento_aprobado')
                ->where('IdDocumentByFile', $idDocumentByFile)
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
                    dbf.Id as idDocumentByFile,
                    dbf.IdCurrentStatus as idEstatus,
                    p.Name as proceso,
                    fs.Name as fase,
                    dbf.Name as documento,
                    dt.Name as tipoDocumento,
                    dfs.Name as estatus,
                    dbf.RegistrationDate as fecha,
                    dbf.IdDocumentContainer as documentContainer,
                    dt.AvailableToClient as DisponibleCliente,
                    CASE WHEN ap.Id IS NOT NULL THEN 1 ELSE 0 END as aprobadoCliente
                FROM DocumentByFile dbf
                INNER JOIN File f ON dbf.IdFile = f.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN DocumentType dt ON dbf.IdDocumentType = dt.Id
                INNER JOIN File_Status fs ON dt.IdProcessType = fs.Id
                INNER JOIN DocumentFile_Status dfs ON dbf.IdCurrentStatus = dfs.Id
                LEFT JOIN file_pld_documento_aprobado ap ON ap.IdDocumentByFile = dbf.Id AND ap.IdFile = dbf.IdFile AND ap.AprobadoCliente = 1
                WHERE dbf.IdFile = ?
                AND dbf.Enabled = 1
                AND dt.AvailableToClient = 1
                ORDER BY p.Name ASC, fs.Name ASC, dt.Name ASC
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
        $builder = $this->db->table('DocumentByFile dbf');
        $results = $builder
            ->select('
                dbf.Id as idDocumentByFile,
                dbf.IdCurrentStatus as idEstatus,
                p.Name as proceso,
                fs.Name as fase,
                dbf.Name as documento,
                dt.Name as tipoDocumento,
                dfs.Name as estatus,
                dbf.RegistrationDate as fecha,
                dbf.IdDocumentContainer as documentContainer,
                dt.AvailableToClient as DisponibleCliente,
                0 as aprobadoCliente
            ')
            ->join('File f', 'dbf.IdFile = f.Id', 'inner')
            ->join('Process p', 'f.IdProcess = p.Id', 'inner')
            ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
            ->join('File_Status fs', 'dt.IdProcessType = fs.Id', 'inner')
            ->join('DocumentFile_Status dfs', 'dbf.IdCurrentStatus = dfs.Id', 'inner')
            ->where('dbf.IdFile', $idFile)
            ->where('dbf.Enabled', 1)
            ->where('dt.AvailableToClient', 1)
            ->orderBy('p.Name', 'ASC')
            ->orderBy('fs.Name', 'ASC')
            ->orderBy('dt.Name', 'ASC')
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
                f.Id as idFile,
                f.IdOrderTotal as ndPedido,
                f.RegistrationDate as fechaRegistro,
                fs.Name as estatus,
                COALESCE(NULLIF(TRIM(c.RazonSocial), ''), TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))) as cliente,
                a.Name as agencia,
                COALESCE(obc1.VIN, obc2.VIN) as vin,
                COALESCE(obc1.Modelo, obc2.Modelo) as modelo,
                COALESCE(obc1.Year, obc2.Year) as year,
                COALESCE(obc1.CarType, obc2.CarType) as version
            FROM File f
            INNER JOIN Client c ON f.IdClient = c.Id
            INNER JOIN Agency a ON f.IdAgency = a.Id
            LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
            LEFT JOIN OrderByCar obc1 ON obc1.Id = f.IdOrder
            LEFT JOIN (
                SELECT obc2a.IdTotalDealer, obc2a.idagency, obc2a.VIN, obc2a.Modelo, obc2a.Year, obc2a.CarType
                FROM OrderByCar obc2a
                INNER JOIN (
                    SELECT IdTotalDealer, idagency, MAX(COALESCE(RegistrationDate, '1900-01-01')) as MaxDate
                    FROM OrderByCar
                    GROUP BY IdTotalDealer, idagency
                ) obc2b ON obc2a.IdTotalDealer = obc2b.IdTotalDealer
                    AND obc2a.idagency = obc2b.idagency
                    AND COALESCE(obc2a.RegistrationDate, '1900-01-01') = obc2b.MaxDate
            ) obc2 ON f.IdOrder IS NULL
                AND obc2.IdTotalDealer = f.IdOrderTotal
                AND obc2.idagency = f.IdAgency
            WHERE f.Id = ? AND f.IdCurrentState != 5
        ";
        $query = $this->db->query($sql, [$idFile]);
        $row = $query->getRowArray();
        return $row ?: null;
    }
}
