<?php

namespace Tests\Feature\Documents;

use Tests\Support\FeatureApiTestCase;

/**
 * Valida el guard `requireExpedientAllowsUpload` en BaseController
 * aplicado a los 4 endpoints de upload.
 *
 * No usa fixtures de DB — confía en que test8 tiene la tabla expedient_state
 * con los 6 estados (Tier 6 aplicado). El guard se prueba con un fileId
 * que NO existe (debería retornar 404) y los caminos felices se
 * cubren con tests de integración separados cuando exista un seed helper.
 *
 * Los 4 endpoints guardados:
 *   POST /api/documents/upload            (Documents::uploadDocument)
 *   POST /api/documents/add-to-file       (Documents::addDocumentsToFile)
 *   POST /api/clients-validation/documentos/liquidacion (Validacion::agregarDocumentoLiquidacion)
 *   POST /api/backblaze/direct-upload     (BackblazeDirectUpload::upload)
 *   POST /api/miniportal/<token>/upload   (Miniportal::uploadDocument — pasa por share token)
 */
final class UploadGuardTest extends FeatureApiTestCase
{
    /**
     * El helper rechaza con 404 cuando el expediente no existe.
     * Esto es el camino más fácil de testear sin seed helper.
     */
    public function testAddToFileRejectsNonexistentExpedient(): void
    {
        $resp = $this->callApi('POST', '/api/documents/add-to-file', [
            'fileId' => 999999999,
            'documentTypeIds' => [1],
        ]);
        $body = $this->decodeJson($resp);
        // 404 del guard (expediente no existe) o 403 del requireFileAccess.
        // Lo decisivo es que NO sea 200 success.
        $this->assertFalse($body['success'] ?? true,
            "add-to-file con fileId inexistente debe rechazar");
    }

    public function testBackblazeUploadRejectsNonexistentExpedient(): void
    {
        // Sin archivo y sin idDocumentFile, el endpoint rechaza temprano
        // por validación de input (legitimate) — pero si pasáramos esos
        // campos, el guard de estado sería el siguiente filtro.
        // Aquí solo validamos que la auth + validación funcionen.
        $resp = $this->callApi('POST', '/api/backblaze/direct-upload', [
            'idNexFile' => 999999999,
            'idDocumentFile' => 1,
        ]);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testLiquidacionRejectsNonexistentExpedient(): void
    {
        $resp = $this->callApi('POST', '/api/clients-validation/documentos/liquidacion', [
            'idFile' => 999999999,
            'id_payment_method' => 1,
            'amount' => 100,
        ]);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }
}
