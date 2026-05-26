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
            // Para fases marcadas con requires_payment_voucher=1 se incluyen amount y payment_method.
            // Históricamente esto era hardcoded como idProcessType === '2' (Liquidación), pero ahora
            // cada deployment marca su propia fase de pago en la tabla expedient_state.
            $isLiquidation = (new \App\Models\FileStateModel())->isVoucherPhaseId($idProcessType);
            $liquidacionJoins = $isLiquidation ? "
                LEFT JOIN liquidation_receipt_detail lrd ON lrd.id_expedient_document = df.id AND lrd.id_expedient = f.id
                LEFT JOIN payment_method pm ON pm.id = lrd.id_payment_method
            " : "";
            $liquidacionFields = $isLiquidation ? "
                , COALESCE(lrd.amount, 0) as receiptAmount
                , lrd.id_payment_method as idPaymentMethod
                , pm.name as paymentMethodName
                , lrd.payment_date as paymentDate
            " : "";

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
                    dt.id_sub_sale_type as subProcessId,
                    fss.name as subProcessName,
                    CASE 
                        WHEN ISNULL(dt.req_expiration) THEN FALSE
                        WHEN dt.req_expiration = 0 THEN FALSE
                        WHEN dt.req_expiration = 1 AND df.expiration_date < CURDATE() THEN TRUE
                        ELSE FALSE
                    END as hasExpired,    
                    dt.id_sale_type as documentProcessId,
                    fs.name as documentProcessName,
                    dfs.id as fileStatusId,
                    dfs.name as fileStatusName,
                    df.id_document_container as documentContainer,
                    df.id_current_document_status as idCurrentStatus
                    {$liquidacionFields}
                FROM expedient f
                INNER JOIN expedient_document df ON f.id = df.id_expedient
                INNER JOIN document_type dt ON df.id_document_type = dt.id
                INNER JOIN expedient_state fs ON dt.id_sale_type = fs.id 
                INNER JOIN document_status dfs ON dfs.id = df.id_current_document_status 
                LEFT JOIN expedient_sub_state fss ON fss.id = dt.id_sub_sale_type
                {$liquidacionJoins}
                WHERE f.id = ?
                AND dt.id_sale_type = ?
                AND f.id_current_expedient_state = dt.id_sale_type
                AND df.enabled = 1
                ORDER BY dt.required DESC, dt.name ASC
            ";

            $params = [$fileId, $idProcessType];
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            // Normalizar receiptAmount para liquidación (asegurar que sea número y clave correcta)
            if ($isLiquidation && !empty($results)) {
                foreach ($results as &$doc) {
                    $amt = $doc['receiptAmount'] ?? $doc['receiptamount'] ?? $doc['amount'] ?? null;
                    $doc['receiptAmount'] = $amt !== null && $amt !== '' ? (float) $amt : null;
                }
                unset($doc);
            }

            $data = [
                'documents' => $results,
                'total' => count($results)
            ];

            // Para liquidación: incluir monto del expediente y suma de comprobantes
            if ($isLiquidation) {
                $expedient = $this->db->table('expedient')
                    ->select('id, id_order, id_order_total, id_agency')
                    ->where('id', $fileId)
                    ->get()
                    ->getRowArray();
                $montoExpediente = 0.0;
                if ($expedient) {
                    if (!empty($expedient['id_order'])) {
                        $orderRow = $this->db->table('order')->select('amount')->where('id', $expedient['id_order'])->get()->getRowArray();
                        $montoExpediente = (float) ($orderRow['amount'] ?? 0);
                    } elseif (!empty($expedient['id_order_total']) && !empty($expedient['id_agency'])) {
                        $orderRow = $this->db->query("
                            SELECT obc2a.amount FROM `order` obc2a
                            INNER JOIN (SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) AS MaxDate FROM `order` GROUP BY id_dms, id_agency) obc2b
                            ON obc2a.id_dms = obc2b.id_dms AND obc2a.id_agency = obc2b.id_agency AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                            WHERE obc2a.id_dms = ? AND obc2a.id_agency = ?
                        ", [$expedient['id_order_total'], $expedient['id_agency']])->getRowArray();
                        $montoExpediente = (float) ($orderRow['amount'] ?? 0);
                    }
                }
                $sumRow = $this->db->query("
                    SELECT COALESCE(SUM(lrd.amount), 0) AS total FROM liquidation_receipt_detail lrd
                    INNER JOIN expedient_document fd ON fd.id = lrd.id_expedient_document AND fd.enabled = 1
                    WHERE lrd.id_expedient = ?
                ", [$fileId])->getRowArray();
                $data['expedientAmount'] = $montoExpediente;
                $data['totalReceiptAmount'] = (float) ($sumRow['total'] ?? 0);
                $data['remainingAmount'] = max(0, $montoExpediente - (float) ($sumRow['total'] ?? 0));
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos requeridos obtenidos exitosamente',
                'data' => $data
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
                INNER JOIN expedient_state fs ON dt.id_sale_type = fs.id
                LEFT JOIN expedient_sub_state fss ON fss.id = dt.id_sub_sale_type
                WHERE dt.id_sale_type = ?
                AND dt.id NOT IN (
                    SELECT df.id_document_type
                    FROM expedient_document df
                    WHERE df.id_expedient = ? AND df.enabled = 1
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
            if ($r = $this->requireExpedientAllowsUpload($fileId)) return $r;
            $documentTypeIds = array_map('intval', array_values(array_unique($documentTypeIds)));
            $userId = (int) ($json['userId'] ?? 0);
            $currentDate = date('Y-m-d H:i:s');
            $added = 0;
            foreach ($documentTypeIds as $idDocumentType) {
                if ($idDocumentType <= 0) continue;
                $exists = $this->db->query(
                    "SELECT 1 FROM expedient_document WHERE IdFile = ? AND IdDocumentType = ? AND Enabled = 1",
                    [$fileId, $idDocumentType]
                )->getRow();
                if ($exists) continue;
                $docType = $this->db->query("SELECT Id, Name FROM document_type WHERE Id = ?", [$idDocumentType])->getRow();
                if (!$docType) continue;
                $nextIdRow = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM expedient_document")->getRow();
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
                $this->db->table('expedient_document')->insert($documentData);
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
            if (!$this->getCurrentUserId()) {
                return $this->response->setStatusCode(401)->setJSON(['success' => false, 'message' => 'No autenticado']);
            }

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

            if ($r = $this->requireFileAccess($fileId)) return $r;
            if ($r = $this->requireExpedientAllowsUpload($fileId)) return $r;

            if (!$file->isValid()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al subir el archivo: ' . $file->getErrorString(),
                    'data' => null
                ])->setStatusCode(400);
            }

            // Whitelist de tipos permitidos (mime + extensión + magic bytes)
            $allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            $allowedExts  = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
            $maxBytes     = 20 * 1024 * 1024; // 20 MB

            $ext  = strtolower($file->getExtension() ?: '');
            $mime = $file->getMimeType();
            if (!in_array($ext, $allowedExts, true) || !in_array($mime, $allowedMimes, true)) {
                return $this->response->setStatusCode(415)->setJSON([
                    'success' => false,
                    'message' => "Tipo de archivo no permitido (recibido: $mime / .$ext)"
                ]);
            }
            if ($file->getSize() > $maxBytes) {
                return $this->response->setStatusCode(413)->setJSON([
                    'success' => false,
                    'message' => 'Archivo excede tamaño máximo (20 MB)'
                ]);
            }

            // Guardar FUERA de public/ — se sirve vía endpoint controlado
            $fileName  = $file->getRandomName();
            $targetDir = WRITEPATH . 'uploads/documents/';
            $filePath  = 'uploads/documents/' . $fileName;

            if ($file->move($targetDir, $fileName)) {
                // Calcular fecha de expiración si es necesario
                $expirationDate = null;
                $documentType = $this->db->query("SELECT * FROM document_type WHERE Id = ?", [$documentTypeId])->getRow();
                if ($documentType && $documentType->HasExpiration && $documentType->ExpirationDays > 0) {
                    $expirationDate = date('Y-m-d', strtotime('+' . $documentType->ExpirationDays . ' days'));
                }

                // Insertar o actualizar el registro en FileDocument
                $existingDoc = $this->db->query("SELECT Id FROM expedient_document WHERE IdFile = ? AND IdDocumentType = ?", [$fileId, $documentTypeId])->getRow();
                
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
            $idFileDocument = $this->request->getGet('idFileDocument')
                ?? $this->request->getGet('idDocumentByFile')
                ?? $this->request->getPost('idFileDocument')
                ?? $this->request->getPost('idDocumentByFile');
            $idFile = $this->request->getGet('idFile') ?? $this->request->getPost('idFile');

            if (!$idFileDocument || !$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros idFileDocument (o idDocumentByFile) e idFile son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;

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
