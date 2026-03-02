<?php
namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Documents extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getRequiredDocuments()
    {
        try {
            $fileId = $this->request->getGet('fileId');
            $idProcessType = $this->request->getGet('idProcessType') ?: '1'; // Por defecto integración (ID = 1)

            if (!$fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro fileId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Query corregido - Solo documentos requeridos para el proceso específico
            $sql = "
                SELECT DISTINCT
                    dt.id as documentId,
                    dt.name as documentName,
                    dt.name as documentDescription,
                    dt.required as isRequired,
                    df.id as fileDocumentId,
                    df.name as fileName,
                    df.path_document as filePath,
                    df.server_path as backblazeUrl,
                    df.id_document_container as backblazeFileId,
                    df.registration_date as uploadDate,
                    dt.req_expiration as hasExpiration,
                    df.expiration_date as expirationDate,
                    dt.id_sub_process as subProcessId,
                    fss.name as subProcessName,
                    CASE 
                        WHEN ISNULL(dt.req_expiration) THEN FALSE
                        WHEN dt.req_expiration = 0 THEN FALSE
                        WHEN dt.req_expiration = 1 AND df.expiration_date < CURDATE() THEN TRUE
                        ELSE FALSE
                    END as hasExpired,    
                    dt.id_process_type as documentProcessId,
                    fs.name as documentProcessName,
                    dfs.id as fileStatusId,
                    dfs.name as fileStatusName,
                    df.id_document_container as documentContainer,
                    df.id_current_status as idCurrentStatus
                FROM expedient f
                INNER JOIN file_document df ON f.id = df.id_file
                INNER JOIN document_type dt ON df.id_document_type = dt.id
                INNER JOIN file_status fs ON dt.id_process_type = fs.id 
                INNER JOIN document_file_status dfs ON dfs.id = df.id_current_status 
                LEFT JOIN file_sub_status fss ON fss.id = dt.id_sub_process
                WHERE f.id = ?
                AND dt.id_process_type = ?
                AND f.id_current_state = dt.id_process_type
                AND df.enabled = 1
                ORDER BY dt.required DESC, dt.name ASC
            ";

            $params = [$fileId, $idProcessType];
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos requeridos obtenidos exitosamente',
                'data' => [
                    'documents' => $results,
                    'total' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Documents::getRequiredDocuments: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/documents/missing-liberation?fileId=X
     * Devuelve los tipos de documento de Liberación (IdProcessType=3) que el pedido no tiene configurados
     * (no existe FileDocument para ese fileId + IdDocumentType).
     */
    public function getMissingLiberationDocuments()
    {
        try {
            $fileId = $this->request->getGet('fileId');
            if (!$fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro fileId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            $idProcessType = '3'; // Liberación (File_Status.Id)

            $sql = "
                SELECT dt.id as documentId, dt.name as documentName, dt.required as isRequired,
                       dt.req_expiration as hasExpiration, fs.name as processTypeName,
                       fss.name as subProcessName
                FROM document_type dt
                INNER JOIN file_status fs ON dt.id_process_type = fs.id
                LEFT JOIN file_sub_status fss ON fss.id = dt.id_sub_process
                WHERE dt.id_process_type = ?
                AND dt.id NOT IN (
                    SELECT df.id_document_type
                    FROM file_document df
                    WHERE df.id_file = ? AND df.enabled = 1
                )
                ORDER BY dt.required DESC, dt.name ASC
            ";
            $query = $this->db->query($sql, [$idProcessType, $fileId]);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos de liberación no configurados',
                'data' => ['documents' => $results, 'total' => count($results)]
            ]);
        } catch (\Exception $e) {
            error_log("Error en Documents::getMissingLiberationDocuments: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/documents/add-to-file
     * Crea registros en FileDocument para los tipos de documento indicados en el expediente (fileId).
     * Body JSON: { "fileId": number, "documentTypeIds": number[] }
     */
    public function addDocumentsToFile()
    {
        try {
            $json = $this->request->getJSON(true);
            $fileId = $json['fileId'] ?? null;
            $documentTypeIds = $json['documentTypeIds'] ?? [];
            if (!$fileId || !is_array($documentTypeIds) || empty($documentTypeIds)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requieren fileId y documentTypeIds (array no vacío)',
                    'data' => null
                ])->setStatusCode(400);
            }
            $fileId = (int) $fileId;
            $documentTypeIds = array_map('intval', array_values(array_unique($documentTypeIds)));
            $userId = (int) ($json['userId'] ?? 0);
            $currentDate = date('Y-m-d H:i:s');
            $added = 0;
            foreach ($documentTypeIds as $idDocumentType) {
                if ($idDocumentType <= 0) continue;
                $exists = $this->db->query(
                    "SELECT 1 FROM file_document WHERE IdFile = ? AND IdDocumentType = ? AND Enabled = 1",
                    [$fileId, $idDocumentType]
                )->getRow();
                if ($exists) continue;
                $docType = $this->db->query("SELECT Id, Name FROM document_type WHERE Id = ?", [$idDocumentType])->getRow();
                if (!$docType) continue;
                $nextIdRow = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM file_document")->getRow();
                $nextId = (int) $nextIdRow->nextId;
                $documentData = [
                    'Id' => $nextId,
                    'IdFile' => $fileId,
                    'IdDocumentType' => $idDocumentType,
                    'Name' => $docType->Name ?? 'Documento sin nombre',
                    'Comment' => null,
                    'ExpirationDate' => null,
                    'PathDocument' => null,
                    'Enabled' => 1,
                    'RegistrationDate' => $currentDate,
                    'UpdateDate' => null,
                    'LastUserUpdate' => $userId ?: null,
                    'IdLastUserUpdate' => $userId ?: null,
                    'IdValidation' => null,
                    'IdCurrentStatus' => 1,
                    'IdDocumentError' => null,
                    'ServerPath' => null
                ];
                $this->db->table('file_document')->insert($documentData);
                $added++;
            }
            return $this->response->setJSON([
                'success' => true,
                'message' => $added ? "Se agregaron {$added} documento(s) al expediente." : 'Ningún documento nuevo agregado.',
                'data' => ['added' => $added]
            ]);
        } catch (\Exception $e) {
            error_log("Error en Documents::addDocumentsToFile: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    public function uploadDocument()
    {
        try {
            $fileId = $this->request->getPost('fileId');
            $documentTypeId = $this->request->getPost('documentTypeId');
            $file = $this->request->getFile('document');

            if (!$fileId || !$documentTypeId || !$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetros requeridos: fileId, documentTypeId y archivo',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Validar que el archivo se subió correctamente
            if (!$file->isValid()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al subir el archivo: ' . $file->getErrorString(),
                    'data' => null
                ])->setStatusCode(400);
            }

            // Generar nombre único para el archivo
            $fileName = $file->getRandomName();
            $filePath = 'uploads/documents/' . $fileName;

            // Mover el archivo a la carpeta de uploads
            if ($file->move(WRITEPATH . '../public/' . $filePath)) {
                // Calcular fecha de expiración si es necesario
                $expirationDate = null;
                $documentType = $this->db->query("SELECT * FROM document_type WHERE Id = ?", [$documentTypeId])->getRow();
                if ($documentType && $documentType->HasExpiration && $documentType->ExpirationDays > 0) {
                    $expirationDate = date('Y-m-d', strtotime('+' . $documentType->ExpirationDays . ' days'));
                }

                // Insertar o actualizar el registro en FileDocument
                $existingDoc = $this->db->query("SELECT Id FROM file_document WHERE IdFile = ? AND IdDocumentType = ?", [$fileId, $documentTypeId])->getRow();
                
                if ($existingDoc) {
                    // Actualizar documento existente
                    $this->db->query("
                        UPDATE FileDocument 
                        SET FileName = ?, FilePath = ?, UploadDate = NOW(), ExpirationDate = ?
                        WHERE Id = ?
                    ", [$file->getClientName(), $filePath, $expirationDate, $existingDoc->Id]);
                } else {
                    // Insertar nuevo documento
                    $this->db->query("
                        INSERT INTO FileDocument (IdFile, IdDocumentType, FileName, FilePath, UploadDate, ExpirationDate)
                        VALUES (?, ?, ?, ?, NOW(), ?)
                    ", [$fileId, $documentTypeId, $file->getClientName(), $filePath, $expirationDate]);
                }

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento subido exitosamente',
                    'data' => [
                        'fileName' => $file->getClientName(),
                        'filePath' => $filePath,
                        'expirationDate' => $expirationDate
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al mover el archivo',
                    'data' => null
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            error_log("Error en Documents::uploadDocument: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/documents/get-file-name
     * Obtener el nombre del archivo desde la vista view_document_name
     */
    public function getFileName()
    {
        try {
            $idFileDocument = $this->request->getGet('idFileDocument');
            $idFile = $this->request->getGet('idFile');

            if (!$idFileDocument || !$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros idFileDocument e idFile son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Consultar la vista view_document_name
            $query = $this->db->query(
                "SELECT file_name_original FROM view_document_name WHERE IdFileDocument = ? AND IdFile = ?",
                [$idFileDocument, $idFile]
            );

            $result = $query->getRow();

            if ($result && !empty($result->file_name_original)) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Nombre de archivo obtenido exitosamente',
                    'data' => [
                        'file_name_original' => $result->file_name_original
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontró el registro en la vista view_document_name',
                    'data' => null
                ])->setStatusCode(404);
            }

        } catch (\Exception $e) {
            error_log("Error en Documents::getFileName: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }
}
