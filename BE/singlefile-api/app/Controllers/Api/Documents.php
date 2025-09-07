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
            $status = $this->request->getGet('status');

            if (!$fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro fileId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Query simplificado - Solo documentos relacionados al file específico
            $sql = "
                SELECT DISTINCT
                    dt.Id as documentId,
                    dt.Name as documentName,
                    dt.Name as documentDescription,
                    dt.Required as isRequired,
                    dt.ReqExpiration as hasExpiration,
                    dt.ReqExpiration as requiresExpiration,
                    30 as expirationDays,
                    CASE 
                        WHEN df.Id IS NOT NULL THEN 'uploaded'
                        WHEN df.Id IS NULL AND dt.Required = 1 THEN 'required'
                        ELSE 'optional'
                    END as status,
                    df.Id as fileDocumentId,
                    df.Name as fileName,
                    df.PathDocument as filePath,
                    df.RegistrationDate as uploadDate,
                    df.ExperationDate as expirationDate,
                    df.IdCurrentStatus as statusId,
                    df.IdCurrentStatus as idCurrentStatus
                FROM File f
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                INNER JOIN DocumentByFile df ON f.Id = df.IdFile
                INNER JOIN DocumentType dt ON df.IdDocumentType = dt.Id
                WHERE f.Id = ?
                AND fs.Name = 'Integración'
                ORDER BY dt.Required DESC, dt.Name ASC
            ";

            $params = [$fileId];
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
                $documentType = $this->db->query("SELECT * FROM DocumentType WHERE Id = ?", [$documentTypeId])->getRow();
                if ($documentType && $documentType->HasExpiration && $documentType->ExpirationDays > 0) {
                    $expirationDate = date('Y-m-d', strtotime('+' . $documentType->ExpirationDays . ' days'));
                }

                // Insertar o actualizar el registro en DocumentByFile
                $existingDoc = $this->db->query("SELECT Id FROM DocumentByFile WHERE IdFile = ? AND IdDocumentType = ?", [$fileId, $documentTypeId])->getRow();
                
                if ($existingDoc) {
                    // Actualizar documento existente
                    $this->db->query("
                        UPDATE DocumentByFile 
                        SET FileName = ?, FilePath = ?, UploadDate = NOW(), ExpirationDate = ?
                        WHERE Id = ?
                    ", [$file->getClientName(), $filePath, $expirationDate, $existingDoc->Id]);
                } else {
                    // Insertar nuevo documento
                    $this->db->query("
                        INSERT INTO DocumentByFile (IdFile, IdDocumentType, FileName, FilePath, UploadDate, ExpirationDate)
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
}
