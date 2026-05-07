<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Services\LiquidacionDocumentService;
use CodeIgniter\Files\File;
use CodeIgniter\HTTP\Files\UploadedFile;
use RuntimeException;

class LiquidacionIntegration extends BaseController
{
    protected $db;

    private const MAX_BYTES = 100 * 1024 * 1024;

    /** @var list<string> */
    private const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt'];

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * POST /api/integrations/liquidacion/upload
     * multipart: ndPedido, idAgency, file (opcional si envía fileName + fileBase64)
     * JSON / form: mismo esquema. Header X-Api-Key (filtro).
     * Name guardado en DocumentByFile = CargaCaja_{nombre sin extensión}. Sin subida Backblaze por ahora.
     */
    public function upload()
    {
        $ndPedido = $this->integrationParam('ndPedido');
        $idAgency = $this->integrationParam('idAgency');

        if ($ndPedido === '' || $idAgency === '') {
            return $this->jsonErr(400, 'VALIDATION_ERROR', 'ndPedido e idAgency son requeridos', null);
        }

        $filePayload = $this->resolveMultipartFile();
        if (isset($filePayload['error'])) {
            return $this->jsonErr(400, 'VALIDATION_ERROR', $filePayload['error'], $filePayload['data'] ?? null);
        }
        $file         = $filePayload['file'];
        $tempToDelete = $filePayload['tempPath'];

        $ext = $this->fileExtension($file);
        if (!in_array($ext, self::ALLOWED_EXT, true)) {
            $this->cleanupTemp($tempToDelete);

            return $this->jsonErr(400, 'VALIDATION_ERROR', 'Extensión no permitida', [
                'extension' => $ext,
                'allowed'   => self::ALLOWED_EXT,
            ]);
        }
        if ($file->getSize() > self::MAX_BYTES) {
            $this->cleanupTemp($tempToDelete);

            return $this->jsonErr(400, 'VALIDATION_ERROR', 'El archivo excede 100 MB', null);
        }

        $service    = new LiquidacionDocumentService($this->db);
        $fileLookup = $service->resolveFileIdByDmsAgencyAndOrder($idAgency, $ndPedido);
        if ($fileLookup['outcome'] === 'none') {
            $this->cleanupTemp($tempToDelete);

            return $this->jsonErr(404, 'EXPEDIENTE_NO_ENCONTRADO', 'No hay expediente para el idAgency (DMS) y ndPedido indicados', null);
        }
        if ($fileLookup['outcome'] === 'many') {
            $this->cleanupTemp($tempToDelete);

            return $this->jsonErr(409, 'EXPEDIENTE_DUPLICADO', 'Existen varios expedientes para la misma agencia y pedido', [
                'idFiles' => $fileLookup['ids'],
            ]);
        }

        $idFile = $fileLookup['ids'][0];

        $clientFn  = $this->resolvedClientFileName($file);
        $baseOnly  = pathinfo($clientFn, PATHINFO_FILENAME);
        $sanitized = (string) preg_replace('/[^\p{L}\p{N}_\-\.\s]/u', '', $baseOnly);
        $sanitized = trim(str_replace('.', '_', $sanitized));
        if ($sanitized === '') {
            $this->cleanupTemp($tempToDelete);

            return $this->jsonErr(400, 'VALIDATION_ERROR', 'No se pudo derivar un nombre válido desde fileName/clientName', null);
        }
        $documentLabel = 'CargaCaja_' . $sanitized;

        try {
            $created = $service->createLiquidacionDocumentExtern($idFile, $documentLabel);
        } catch (RuntimeException $e) {
            $this->cleanupTemp($tempToDelete);

            return $this->jsonErr(500, 'INTERNAL_ERROR', $e->getMessage(), null);
        }
        $this->cleanupTemp($tempToDelete);

        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'success'   => true,
                'errorCode' => null,
                'message'   => 'Registro de documento creado',
                'data'      => [
                    'idFile'           => $idFile,
                    'idDocumentByFile' => $created['idDocumentByFile'],
                    'documentName'     => $created['documentName'],
                ],
            ]);
    }

    private function resolvedClientFileName(File $file): string
    {
        $fromParam = $this->integrationParam('fileName');
        if ($fromParam !== '') {
            return basename(str_replace("\0", '', $fromParam));
        }

        if ($file instanceof UploadedFile) {
            $n = trim($file->getClientName());

            return $n !== '' ? basename(str_replace("\0", '', $n)) : '';
        }

        return basename(str_replace("\0", '', $file->getBasename()));
    }

    /** Lee POST multipart/form o application/json */
    private function integrationParam(string $key): string
    {
        $post = $this->request->getPost($key);
        if ($post !== null && $post !== '' && ! is_array($post)) {
            return trim((string) $post);
        }

        $decoded = $this->request->getJSON(true);
        if (! is_array($decoded) || ! array_key_exists($key, $decoded)) {
            return '';
        }

        $v = $decoded[$key];
        if ($v === null || is_array($v) || is_object($v)) {
            return '';
        }

        return trim((string) $v);
    }

    /**
     * Subida clásica `file` o contenido en memoria: `fileName` + `fileBase64` (admite data URL).
     *
     * @return array{file: File, tempPath: ?string}|array{error: string, data?: ?array}
     */
    private function resolveMultipartFile(): array
    {
        $uploaded = $this->request->getFile('file');
        if ($uploaded instanceof UploadedFile && $uploaded->isValid()) {
            return ['file' => $uploaded, 'tempPath' => null];
        }

        $b64      = $this->integrationParam('fileBase64');
        $fileName = $this->integrationParam('fileName');

        if ($b64 === '' && $fileName === '' && $uploaded !== null) {
            return [
                'error' => "El archivo 'file' no es válido. Use un archivo correcto, o envíe 'fileName' y 'fileBase64'.",
            ];
        }
        if ($b64 === '') {
            return [
                'error' => "Envíe el archivo en el campo 'file' o bien 'fileName' (p. ej. documento.pdf) y 'fileBase64' (contenido en base64).",
            ];
        }
        if ($fileName === '') {
            return [
                'error' => "Si envía 'fileBase64', el campo 'fileName' es obligatorio (incluya la extensión, p. ej. documento.pdf).",
            ];
        }

        $fileName = basename(str_replace("\0", '', $fileName));
        if ($fileName === '' || $fileName === '.' || $fileName === '..') {
            return ['error' => 'fileName no es válido', 'data' => null];
        }

        if (preg_match('#^data:[^;]*;base64,#i', $b64) === 1) {
            $b64 = (string) preg_replace('#^data:[^;]*;base64,#i', '', $b64);
        }
        $b64 = (string) preg_replace('/\s+/', '', $b64);
        $raw = base64_decode($b64, true);
        if ($raw === false) {
            return ['error' => 'fileBase64 no es base64 válido', 'data' => null];
        }
        if (strlen($raw) > self::MAX_BYTES) {
            return ['error' => 'El contenido en base64 excede 100 MB', 'data' => null];
        }

        $dir = WRITEPATH . 'uploads/liq_int';
        if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
            return ['error' => 'No se pudo preparar almacenamiento temporal', 'data' => null];
        }
        $tmp = $dir . DIRECTORY_SEPARATOR . 'b64_' . bin2hex(random_bytes(12)) . '_' . $fileName;
        if (file_put_contents($tmp, $raw) === false) {
            return ['error' => 'No se pudo escribir el archivo temporal', 'data' => null];
        }

        $file = new File($tmp, true);

        return ['file' => $file, 'tempPath' => $tmp];
    }

    private function fileExtension(File $file): string
    {
        if ($file instanceof UploadedFile) {
            $e = strtolower($file->getClientExtension());
            if ($e !== '') {
                return $e;
            }
            $e = strtolower((string) pathinfo($file->getClientName(), PATHINFO_EXTENSION));
            if ($e !== '') {
                return $e;
            }
        }
        $e = strtolower((string) ($file->getExtension() ?? ''));
        if ($e !== '') {
            return $e;
        }

        return strtolower((string) pathinfo($file->getBasename(), PATHINFO_EXTENSION));
    }

    private function cleanupTemp(?string $path): void
    {
        if ($path !== null && $path !== '' && is_file($path)) {
            @unlink($path);
        }
    }

    /** @param array<string, mixed>|null $data */
    private function jsonErr(int $status, string $errorCode, string $message, ?array $data)
    {
        return $this->response
            ->setStatusCode($status)
            ->setJSON([
                'success'   => false,
                'errorCode' => $errorCode,
                'message'   => $message,
                'data'      => $data,
            ]);
    }
}
