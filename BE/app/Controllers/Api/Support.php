<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

/**
 * Panel de soporte: diagnóstico masivo y listados (solo roles 7 y 8).
 */
class Support extends BaseController
{
    /** Roles: Administrador (7), Soporte (8) */
    private const ALLOWED_ROLES = [7, 8];

    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    private function denyIfNotSupport(): ?\CodeIgniter\HTTP\ResponseInterface
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No autorizado',
            ])->setStatusCode(401);
        }
        $rid = (int) ($user['role_id'] ?? 0);
        if (!in_array($rid, self::ALLOWED_ROLES, true)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Solo administración y soporte pueden usar este recurso',
            ])->setStatusCode(403);
        }

        return null;
    }

    /**
     * GET /api/support/mal-relacionados?idAgencia=&excluirCancelados=1&limite=2000
     * Misma lógica que scripts/listar_expedientes_mal_relacionados.php
     */
    public function malRelacionados()
    {
        $deny = $this->denyIfNotSupport();
        if ($deny !== null) {
            return $deny;
        }

        try {
            $idAgencia = $this->request->getGet('idAgencia');
            $idAgencia = $idAgencia !== null && $idAgencia !== '' ? (int) $idAgencia : null;

            $excluirCancelados = $this->request->getGet('excluirCancelados');
            $excluirCancelados = $excluirCancelados === null || $excluirCancelados === '' || $excluirCancelados === '1' || $excluirCancelados === 'true';

            $limite = (int) ($this->request->getGet('limite') ?: 2000);
            if ($limite < 1) {
                $limite = 2000;
            }
            if ($limite > 10000) {
                $limite = 10000;
            }

            $sql = "
SELECT
    f.Id AS id_file,
    f.IdOrderTotal AS pedido,
    f.IdAgency AS id_agencia,
    a.Name AS agencia,
    f.IdClient AS id_client_file,
    f.IdCurrentState AS id_estado,
    fs.Name AS estado,
    p.Name AS proceso,
    p.Enabled AS proceso_habilitado,
    CASE
        WHEN c.Id IS NULL THEN 'Client inexistente (File.IdClient huérfano)'
        WHEN hc.Id IS NULL THEN 'Sin HeaderClient para ese Client.Id'
        WHEN ctr.Id IS NULL THEN 'Sin Client_Total_Relation (cliente-agencia)'
        ELSE 'OK'
    END AS motivo,
    (
        SELECT f2.IdClient
        FROM File f2
        INNER JOIN Client c2 ON c2.Id = f2.IdClient
        INNER JOIN HeaderClient hc2 ON hc2.IdClient = f2.IdClient
        INNER JOIN Client_Total_Relation ctr2 ON ctr2.idHeaderClient = hc2.Id AND ctr2.IdAgency = f2.IdAgency
        WHERE f2.IdAgency = f.IdAgency
          AND TRIM(CAST(f2.IdOrderTotal AS CHAR)) = TRIM(CAST(f.IdOrderTotal AS CHAR))
          AND f2.Id <> f.Id
        ORDER BY f2.Id
        LIMIT 1
    ) AS id_sugerido_por_hermano,
    (
        SELECT hc3.IdClient
        FROM Client_Total_Relation ctr3
        INNER JOIN HeaderClient hc3 ON hc3.Id = ctr3.idHeaderClient
        WHERE ctr3.IdAgency = f.IdAgency
          AND TRIM(CAST(ctr3.IdTotalDealer AS CHAR)) = TRIM(CAST(f.IdOrderTotal AS CHAR))
        LIMIT 1
    ) AS id_sugerido_por_ctr_nd,
    (
        SELECT TRIM(CAST(ctr3.IdTotalDealer AS CHAR))
        FROM Client_Total_Relation ctr3
        INNER JOIN HeaderClient hc3 ON hc3.Id = ctr3.idHeaderClient
        WHERE ctr3.IdAgency = f.IdAgency
          AND TRIM(CAST(ctr3.IdTotalDealer AS CHAR)) = TRIM(CAST(f.IdOrderTotal AS CHAR))
        LIMIT 1
    ) AS nd_ctr_coincide_pedido
FROM File f
INNER JOIN Agency a ON a.Id = f.IdAgency
LEFT JOIN Client c ON c.Id = f.IdClient
LEFT JOIN HeaderClient hc ON hc.IdClient = f.IdClient
LEFT JOIN Client_Total_Relation ctr
    ON ctr.idHeaderClient = hc.Id
    AND ctr.IdAgency = f.IdAgency
LEFT JOIN File_Status fs ON fs.Id = f.IdCurrentState
LEFT JOIN Process p ON p.Id = f.IdProcess
WHERE
    c.Id IS NULL
    OR hc.Id IS NULL
    OR ctr.Id IS NULL
";

            $params = [];
            if ($idAgencia !== null) {
                $sql .= ' AND f.IdAgency = ?';
                $params[] = $idAgencia;
            }

            if ($excluirCancelados) {
                $sql .= ' AND f.IdCurrentState <> 5';
            }

            $sql .= ' ORDER BY f.IdAgency, f.IdOrderTotal, f.Id LIMIT ' . $limite;

            if ($params === []) {
                $query = $this->db->query($sql);
            } else {
                $query = $this->db->query($sql, $params);
            }

            $raw = $query->getResultArray();
            $rows = [];

            foreach ($raw as $row) {
                $idH = isset($row['id_sugerido_por_hermano']) && $row['id_sugerido_por_hermano'] !== null && $row['id_sugerido_por_hermano'] !== ''
                    ? (int) $row['id_sugerido_por_hermano'] : 0;
                $idC = isset($row['id_sugerido_por_ctr_nd']) && $row['id_sugerido_por_ctr_nd'] !== null && $row['id_sugerido_por_ctr_nd'] !== ''
                    ? (int) $row['id_sugerido_por_ctr_nd'] : 0;

                $idFinal = 0;
                $fuente = 'sin_sugerencia';
                if ($idH > 0) {
                    $idFinal = $idH;
                    $fuente = 'otro_File_mismo_pedido';
                } elseif ($idC > 0) {
                    $idFinal = $idC;
                    $fuente = 'CTR_nd_igual_pedido';
                }

                $nombreSugerido = '';
                if ($idFinal > 0) {
                    $nombreSugerido = $this->nombreClientePorId($idFinal);
                }

                $notaNd = '';
                if ($fuente === 'CTR_nd_igual_pedido' && !empty($row['nd_ctr_coincide_pedido'])) {
                    $notaNd = 'nd en CTR=' . $row['nd_ctr_coincide_pedido'];
                }

                unset($row['id_sugerido_por_hermano'], $row['id_sugerido_por_ctr_nd'], $row['nd_ctr_coincide_pedido']);

                $row['id_cliente_sugerido'] = $idFinal > 0 ? $idFinal : null;
                $row['nombre_cliente_sugerido'] = $nombreSugerido ?: null;
                $row['fuente_sugerencia'] = $fuente;
                $row['nota_nd'] = $notaNd ?: null;
                $rows[] = $row;
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'OK',
                'data' => [
                    'total' => count($rows),
                    'rows' => $rows,
                ],
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Support::malRelacionados: ' . $e->getMessage());

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => null,
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/support/duplicados-pedido?idAgencia=&limite=500
     * Mismo pedido (IdOrderTotal) + misma agencia, más de un File.
     */
    public function duplicadosPedido()
    {
        $deny = $this->denyIfNotSupport();
        if ($deny !== null) {
            return $deny;
        }

        try {
            $idAgencia = $this->request->getGet('idAgencia');
            $idAgencia = $idAgencia !== null && $idAgencia !== '' ? (int) $idAgencia : null;

            $limite = (int) ($this->request->getGet('limite') ?: 500);
            if ($limite < 1) {
                $limite = 500;
            }
            if ($limite > 5000) {
                $limite = 5000;
            }

            $sql = "
SELECT
    f.IdAgency AS id_agencia,
    a.Name AS agencia,
    f.IdOrderTotal AS pedido,
    COUNT(*) AS copias,
    GROUP_CONCAT(f.Id ORDER BY f.Id) AS ids_file,
    GROUP_CONCAT(f.IdCurrentState ORDER BY f.Id) AS ids_estado
FROM File f
INNER JOIN Agency a ON a.Id = f.IdAgency
WHERE f.IdOrderTotal IS NOT NULL AND TRIM(CAST(f.IdOrderTotal AS CHAR)) <> ''
";

            $params = [];
            if ($idAgencia !== null) {
                $sql .= ' AND f.IdAgency = ?';
                $params[] = $idAgencia;
            }

            $sql .= '
GROUP BY f.IdAgency, f.IdOrderTotal
HAVING COUNT(*) > 1
ORDER BY copias DESC, agencia, pedido
LIMIT ' . $limite;

            if ($params === []) {
                $query = $this->db->query($sql);
            } else {
                $query = $this->db->query($sql, $params);
            }

            $rows = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'OK',
                'data' => [
                    'total' => count($rows),
                    'rows' => $rows,
                ],
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Support::duplicadosPedido: ' . $e->getMessage());

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => null,
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/support/diagnostico-expediente?idFile=123
     *    o GET ?idPedido=...&idAgencia=5 (una agencia)
     *    o GET ?idPedido=... sin idAgencia (todas las agencias, resultado agrupado).
     */
    public function diagnosticoExpediente()
    {
        $deny = $this->denyIfNotSupport();
        if ($deny !== null) {
            return $deny;
        }

        try {
            $idFileGet = $this->request->getGet('idFile');
            $idPedido = $this->request->getGet('idPedido');
            if ($idPedido === null || $idPedido === '') {
                $idPedido = $this->request->getGet('idOrderTotal');
            }
            $idAgencia = $this->request->getGet('idAgencia');

            $idFile = null;
            if ($idFileGet !== null && $idFileGet !== '') {
                $idFile = (int) $idFileGet;
            }

            $pedTrim = $idPedido !== null ? trim((string) $idPedido) : '';
            $idAg = $idAgencia !== null && $idAgencia !== '' ? (int) $idAgencia : null;

            if ($idFile !== null && $idFile >= 1) {
                $payload = $this->buildDiagnosticoPayloadByIdFile($idFile);
                if ($payload === null) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Expediente no encontrado',
                        'data' => null,
                    ])->setStatusCode(404);
                }

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'OK',
                    'data' => array_merge(['ambiguo' => false], $payload),
                ]);
            }

            if ($pedTrim === '') {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Indique idFile o idPedido (IdOrderTotal)',
                    'data' => null,
                ])->setStatusCode(400);
            }

            if ($idAg === null) {
                return $this->diagnosticoPedidoTodasAgencias($pedTrim);
            }

            $candidatos = $this->db->query(
                'SELECT f.Id AS id_file, f.IdCurrentState, fs.Name AS estado '
                . 'FROM File f INNER JOIN File_Status fs ON fs.Id = f.IdCurrentState '
                . 'WHERE f.IdAgency = ? AND TRIM(CAST(f.IdOrderTotal AS CHAR)) = ? '
                . 'ORDER BY f.Id',
                [$idAg, $pedTrim]
            )->getResultArray();

            if ($candidatos === []) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No hay expediente con ese pedido y agencia',
                    'data' => null,
                ])->setStatusCode(404);
            }
            if (count($candidatos) > 1) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Hay varios expedientes con el mismo pedido y agencia; elija idFile',
                    'data' => [
                        'ambiguo' => true,
                        'candidatos' => $candidatos,
                    ],
                ]);
            }
            $idFile = (int) $candidatos[0]['id_file'];
            $payload = $this->buildDiagnosticoPayloadByIdFile($idFile);
            if ($payload === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Expediente no encontrado',
                    'data' => null,
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'OK',
                'data' => array_merge(['ambiguo' => false], $payload),
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Support::diagnosticoExpediente: ' . $e->getMessage());

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => null,
            ])->setStatusCode(500);
        }
    }

    /**
     * @return \CodeIgniter\HTTP\ResponseInterface
     */
    private function diagnosticoPedidoTodasAgencias(string $pedTrim)
    {
        $rows = $this->db->query(
            'SELECT f.Id AS id_file, f.IdAgency, a.Name AS nombre_agencia '
            . 'FROM File f INNER JOIN Agency a ON a.Id = f.IdAgency '
            . 'WHERE TRIM(CAST(f.IdOrderTotal AS CHAR)) = ? '
            . 'ORDER BY f.IdAgency, f.Id',
            [$pedTrim]
        )->getResultArray();

        if ($rows === []) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No hay expediente con ese pedido en ninguna agencia',
                'data' => null,
            ])->setStatusCode(404);
        }

        $grouped = [];
        foreach ($rows as $row) {
            $ida = (int) $row['IdAgency'];
            if (!isset($grouped[$ida])) {
                $grouped[$ida] = [
                    'idAgencia' => $ida,
                    'nombreAgencia' => $row['nombre_agencia'],
                    'expedientes' => [],
                ];
            }
            $idF = (int) $row['id_file'];
            $payload = $this->buildDiagnosticoPayloadByIdFile($idF);
            if ($payload !== null) {
                $grouped[$ida]['expedientes'][] = $payload;
            }
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'OK',
            'data' => [
                'modo' => 'multi_agencia',
                'idPedido' => $pedTrim,
                'agrupadoPorAgencia' => array_values($grouped),
            ],
        ]);
    }

    /**
     * Carga expediente + cliente + relación + validación (misma forma que el panel).
     *
     * @return array<string, mixed>|null
     */
    private function buildDiagnosticoPayloadByIdFile(int $idFile): ?array
    {
        $fileRow = $this->db->query(
            'SELECT '
            . 'f.Id AS id_file, f.IdClient, f.IdAgency, f.IdProcess, f.IdCurrentState, '
            . 'f.IdOrderTotal, f.RegistrationDate, f.UpdateDate, f.AgendDate, '
            . 'a.IdAgency AS idAgencyDms, a.AgencyConnection AS agencyConnection, '
            . 'a.Name AS agencia, p.Name AS proceso, p.Enabled AS proceso_habilitado, '
            . 'fs.Name AS estado '
            . 'FROM File f '
            . 'INNER JOIN Agency a ON a.Id = f.IdAgency '
            . 'INNER JOIN Process p ON p.Id = f.IdProcess '
            . 'INNER JOIN File_Status fs ON fs.Id = f.IdCurrentState '
            . 'WHERE f.Id = ?',
            [$idFile]
        )->getRowArray();

        if (!$fileRow) {
            return null;
        }

        $idClient = (int) $fileRow['IdClient'];
        $idAgencyFile = (int) $fileRow['IdAgency'];

        $dupRows = $this->db->query(
            'SELECT f2.Id AS id_file, f2.IdCurrentState, fs2.Name AS estado '
            . 'FROM File f2 '
            . 'INNER JOIN File_Status fs2 ON fs2.Id = f2.IdCurrentState '
            . 'WHERE f2.IdAgency = ? '
            . 'AND TRIM(CAST(f2.IdOrderTotal AS CHAR)) = TRIM(CAST(? AS CHAR)) '
            . 'ORDER BY f2.Id',
            [$idAgencyFile, $fileRow['IdOrderTotal']]
        )->getResultArray();

        $clientRow = $this->db->query(
            'SELECT Id, RazonSocial, Name, LastName, MotherLastName, RegistrationDate '
            . 'FROM Client WHERE Id = ? LIMIT 1',
            [$idClient]
        )->getRowArray();

        $nombreCliente = '';
        if ($clientRow) {
            $nombreCliente = $this->nombreClientePorId($idClient);
        }

        $hcRow = $this->db->query(
            'SELECT Id AS id_header_client FROM HeaderClient WHERE IdClient = ? LIMIT 1',
            [$idClient]
        )->getRowArray();
        $idHeaderClient = $hcRow ? (int) $hcRow['id_header_client'] : null;

        $ctrAgencia = null;
        if ($idHeaderClient) {
            $ctrAgencia = $this->db->query(
                'SELECT ctr.Id, ctr.IdAgency, ctr.IdTotalDealer, ctr.idHeaderClient, a.Name AS nombre_agencia '
                . 'FROM Client_Total_Relation ctr '
                . 'INNER JOIN Agency a ON a.Id = ctr.IdAgency '
                . 'WHERE ctr.idHeaderClient = ? AND ctr.IdAgency = ? LIMIT 1',
                [$idHeaderClient, $idAgencyFile]
            )->getRowArray();
        }

        $todasCtr = [];
        if ($idHeaderClient) {
            $todasCtr = $this->db->query(
                'SELECT ctr.Id, ctr.IdAgency, ctr.IdTotalDealer, ctr.idHeaderClient, a.Name AS nombre_agencia '
                . 'FROM Client_Total_Relation ctr '
                . 'INNER JOIN Agency a ON a.Id = ctr.IdAgency '
                . 'WHERE ctr.idHeaderClient = ? '
                . 'ORDER BY ctr.IdAgency',
                [$idHeaderClient]
            )->getResultArray();
        }

        $procesoOk = (int) $fileRow['proceso_habilitado'] === 1;
        $noCancelado = (int) $fileRow['IdCurrentState'] !== 5;
        $existeCliente = $clientRow !== null;
        $existeHeader = $idHeaderClient !== null;
        $existeRelacionAgencia = $ctrAgencia !== null;

        $motivosNo = [];
        if (!$procesoOk) {
            $motivosNo[] = 'Proceso deshabilitado (Process.Enabled ≠ 1)';
        }
        if (!$noCancelado) {
            $motivosNo[] = 'Expediente cancelado (IdCurrentState = 5)';
        }
        if (!$existeCliente) {
            $motivosNo[] = 'No existe registro en Client para File.IdClient';
        }
        if (!$existeHeader) {
            $motivosNo[] = 'No hay HeaderClient para ese Client.Id (el listado de validación hace JOIN con HeaderClient)';
        }
        if (!$existeRelacionAgencia) {
            $motivosNo[] = 'No hay Client_Total_Relation para idHeaderClient de ese cliente y la agencia del expediente';
        }

        $apareceria = $procesoOk && $noCancelado && $existeCliente && $existeHeader && $existeRelacionAgencia;
        $recomendaciones = $this->recomendacionesValidacion(
            $procesoOk,
            $noCancelado,
            $existeCliente,
            $existeHeader,
            $existeRelacionAgencia
        );

        $ndRel = null;
        if ($ctrAgencia !== null) {
            $ndRel = $ctrAgencia['IdTotalDealer'] ?? null;
        }

        $orderDms = trim((string) ($fileRow['IdOrderTotal'] ?? ''));
        $idAgencyDms = isset($fileRow['idAgencyDms']) ? trim((string) $fileRow['idAgencyDms']) : '';
        $agencyConnection = isset($fileRow['agencyConnection']) ? trim((string) $fileRow['agencyConnection']) : '';
        $vanguardia = $this->fetchVanguardiaInvoiceResumen(
            $orderDms,
            $idAgencyFile,
            $idAgencyDms !== '' ? $idAgencyDms : null,
            $agencyConnection !== '' ? $agencyConnection : null
        );

        return [
            'expediente' => [
                'id' => (int) $fileRow['id_file'],
                'idOrderTotal' => $fileRow['IdOrderTotal'],
                'idAgency' => $idAgencyFile,
                'idAgencyDms' => $idAgencyDms !== '' ? $idAgencyDms : null,
                'agencyConnection' => $agencyConnection !== '' ? $agencyConnection : null,
                'agencia' => $fileRow['agencia'],
                'proceso' => $fileRow['proceso'],
                'idProcess' => (int) $fileRow['IdProcess'],
                'procesoHabilitado' => $procesoOk,
                'estado' => $fileRow['estado'],
                'idEstado' => (int) $fileRow['IdCurrentState'],
                'registrationDate' => $fileRow['RegistrationDate'],
                'updateDate' => $fileRow['UpdateDate'],
                'agendDate' => $fileRow['AgendDate'],
                'duplicadosMismoPedidoAgencia' => $dupRows,
            ],
            'cliente' => [
                'idClient' => $idClient,
                'existeClient' => $existeCliente,
                'nombre' => $nombreCliente !== '' ? $nombreCliente : null,
                'razonSocial' => $clientRow ? ($clientRow['RazonSocial'] ?? null) : null,
                'name' => $clientRow ? ($clientRow['Name'] ?? null) : null,
                'lastName' => $clientRow ? ($clientRow['LastName'] ?? null) : null,
                'motherLastName' => $clientRow ? ($clientRow['MotherLastName'] ?? null) : null,
            ],
            'relacion' => [
                'existeHeaderClient' => $existeHeader,
                'idHeaderClient' => $idHeaderClient,
                'existeClientTotalRelationAgencia' => $existeRelacionAgencia,
                'relacionAgencia' => $ctrAgencia,
                'ndEnRelacionAgencia' => $ndRel,
                'todasRelacionesCliente' => $todasCtr,
            ],
            'validacion' => [
                'procesoHabilitado' => $procesoOk,
                'noCancelado' => $noCancelado,
                'existeClient' => $existeCliente,
                'joinHeaderClientOk' => $existeHeader,
                'existeRelacionClienteAgencia' => $existeRelacionAgencia,
                'apareceriaEnListadoValidacion' => $apareceria,
                'motivosSiNoAparece' => $motivosNo,
                'recomendaciones' => $recomendaciones,
            ],
            'vanguardia' => $vanguardia,
        ];
    }

    /**
     * Decodifica cuerpo JSON tolerando BOM UTF-8, espacios y texto antes/después del objeto.
     *
     * @return array<string, mixed>|null
     */
    private function decodeJsonResponseBody(string $body): ?array
    {
        $body = trim($body);
        if ($body === '') {
            return null;
        }
        if (strncmp($body, "\xEF\xBB\xBF", 3) === 0) {
            $body = substr($body, 3);
        }

        $flags = defined('JSON_INVALID_UTF8_IGNORE') ? JSON_INVALID_UTF8_IGNORE : 0;
        $decoded = json_decode($body, true, 512, $flags);
        if (is_array($decoded)) {
            return $decoded;
        }

        $start = strpos($body, '{');
        $end = strrpos($body, '}');
        if ($start !== false && $end !== false && $end > $start) {
            $slice = substr($body, $start, $end - $start + 1);
            $decoded = json_decode($slice, true, 512, $flags);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        $start = strpos($body, '[');
        $end = strrpos($body, ']');
        if ($start !== false && $end !== false && $end > $start) {
            $slice = substr($body, $start, $end - $start + 1);
            $decoded = json_decode($slice, true, 512, $flags);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    private function jsonDecodeErrorHint(string $body): string
    {
        $err = json_last_error_msg();
        $preview = trim(preg_replace('/\s+/', ' ', $body));
        if (strlen($preview) > 180) {
            $preview = substr($preview, 0, 180) . '…';
        }
        if ($preview === '') {
            return 'Cuerpo vacío. ' . $err;
        }

        return $err . '. Inicio: ' . $preview;
    }

    /**
     * Consulta facturas en API Vanguardia por order_dms y prioriza fila de la misma idAgency (DMS).
     * Si la factura no trae nd de cliente, intenta singlefileorderslastest con idAgency DMS y order_dms (sin customerDMS).
     *
     * @param string|null $idAgencyDms IdAgency de DMS (Agency.IdAgency), no el Id interno
     * @param string|null $agencyConnection Agency.AgencyConnection (mismo filtro que integración en singlefileorderslastest)
     *
     * @return array{ok: bool, error: ?string, factura: ?array, filas: array, httpStatus?: int, recomendaciones?: list<string>, ordersFallback?: bool}
     */
    private function fetchVanguardiaInvoiceResumen(string $orderDms, int $idAgencyFile, ?string $idAgencyDms = null, ?string $agencyConnection = null): array
    {
        $token = env('VANGUARDIA_PROVIDER_TOKEN') ?: '';
        $base = env('VANGUARDIA_INVOICE_URL') ?: 'https://apisvanguardia.com:400/vgd/invoice';
        $token = is_string($token) ? trim($token) : '';

        if ($orderDms === '') {
            return [
                'ok' => false,
                'error' => 'Sin pedido DMS (IdOrderTotal) para consultar.',
                'factura' => null,
                'filas' => [],
            ];
        }
        if ($token === '') {
            return [
                'ok' => false,
                'error' => 'Configure VANGUARDIA_PROVIDER_TOKEN en el entorno.',
                'factura' => null,
                'filas' => [],
            ];
        }

        try {
            $client = service('curlrequest');
            $url = rtrim((string) $base, '?&') . '?' . http_build_query([
                'order_dms' => $orderDms,
                'page' => 1,
                'perpage' => 5,
                'orderby' => 'billing_date',
                'ordertype' => 'desc',
            ]);

            $resp = $client->get($url, [
                'headers' => [
                    'X-Provider-Token' => $token,
                    'Accept' => 'application/json',
                    // Evita respuestas gzip mal decodificadas en algunos entornos PHP/cURL
                    'Accept-Encoding' => 'identity',
                    'User-Agent' => 'SingleFile-Support/1.0',
                ],
                'timeout' => 25,
                'http_errors' => false,
            ]);

            $code = (int) $resp->getStatusCode();
            $body = (string) $resp->getBody();
            $json = $this->decodeJsonResponseBody($body);

            if (!is_array($json)) {
                $hint = $this->jsonDecodeErrorHint($body);
                log_message(
                    'warning',
                    'Vanguardia invoice: JSON inválido HTTP ' . $code . ' — ' . $hint
                );

                return [
                    'ok' => false,
                    'error' => 'No se pudo leer JSON de Vanguardia (HTTP ' . $code . '). ' . $hint,
                    'factura' => null,
                    'filas' => [],
                    'httpStatus' => $code,
                    'recomendaciones' => [
                        'Verifique salida a internet desde el servidor hacia apisvanguardia.com:400 (firewall/proxy).',
                        'Confirme VANGUARDIA_PROVIDER_TOKEN y VANGUARDIA_INVOICE_URL en .env (sin comillas extra).',
                        'Si la API devolvió HTML en lugar de JSON, revise token o que la URL sea la de facturación.',
                    ],
                ];
            }

            $inner = $json['data'] ?? null;
            $rows = [];
            if (is_array($inner) && isset($inner['data']) && is_array($inner['data'])) {
                $rows = $inner['data'];
            }

            // Vanguardia devuelve idAgency en clave DMS (Agency.IdAgency), no el Id interno
            $agencyKeyForMatch = ($idAgencyDms !== null && trim((string) $idAgencyDms) !== '')
                ? trim((string) $idAgencyDms)
                : (string) $idAgencyFile;
            $matched = null;
            foreach ($rows as $row) {
                if (!is_array($row)) {
                    continue;
                }
                if (isset($row['idAgency']) && (string) $row['idAgency'] === $agencyKeyForMatch) {
                    $matched = $row;
                    break;
                }
            }
            if ($matched === null && $rows !== []) {
                $matched = $rows[0];
            }

            $factura = null;
            if ($matched !== null) {
                $factura = [
                    'agencia' => $matched['agencyName'] ?? null,
                    'idAgencia' => $matched['idAgency'] ?? null,
                    'numeroOrden' => $matched['order_dms'] ?? $orderDms,
                    'clienteDms' => $matched['ndClientDMS'] ?? null,
                    'vin' => $matched['vin'] ?? null,
                    'estadoFactura' => $matched['state'] ?? null,
                    'billingDate' => $matched['billing_date'] ?? null,
                    'invoiceReference' => $matched['invoice_reference'] ?? null,
                ];
            }

            $ordersFallback = false;
            $ndFactura = $factura !== null && isset($factura['clienteDms'])
                ? trim((string) $factura['clienteDms'])
                : '';
            if (
                $ndFactura === ''
                && $orderDms !== ''
                && $idAgencyDms !== null
                && trim($idAgencyDms) !== ''
            ) {
                $fromOrders = $this->fetchClienteNdFromVanguardiaOrdersLastest($orderDms, trim($idAgencyDms), $agencyConnection);
                if ($fromOrders !== null && $fromOrders['nd'] !== '') {
                    $ordersFallback = true;
                    $row = $fromOrders['row'];
                    if ($factura === null) {
                        $factura = [
                            'agencia' => $row['agencyName'] ?? null,
                            'idAgencia' => $row['idAgency'] ?? $idAgencyDms,
                            'numeroOrden' => $row['order_dms'] ?? $row['orderDMS'] ?? $orderDms,
                            'clienteDms' => $fromOrders['nd'],
                            'vin' => $row['vin'] ?? null,
                            'estadoFactura' => $row['state'] ?? null,
                            'billingDate' => $row['billing_date'] ?? null,
                            'invoiceReference' => $row['invoice_reference'] ?? null,
                        ];
                    } else {
                        $factura['clienteDms'] = $fromOrders['nd'];
                    }
                }
            }

            return [
                'ok' => true,
                'error' => null,
                'factura' => $factura,
                'filas' => $rows,
                'httpStatus' => $code,
                'ordersFallback' => $ordersFallback,
            ];
        } catch (\Throwable $e) {
            log_message('error', 'Support::fetchVanguardiaInvoiceResumen: ' . $e->getMessage());

            return [
                'ok' => false,
                'error' => $e->getMessage(),
                'factura' => null,
                'filas' => [],
            ];
        }
    }

    /**
     * GET singlefileorderslastest: idAgency DMS, order_dms y opcional connectionstring (no se envía customerDMS).
     *
     * @return array{nd: string, row: array<string, mixed>}|null
     */
    private function fetchClienteNdFromVanguardiaOrdersLastest(string $orderDms, string $idAgencyDms, ?string $agencyConnection = null): ?array
    {
        $token = env('VANGUARDIA_PROVIDER_TOKEN') ?: '';
        $token = is_string($token) ? trim($token) : '';
        if ($token === '' || $orderDms === '' || trim($idAgencyDms) === '') {
            return null;
        }

        $base = env('VANGUARDIA_ORDERS_URL') ?: 'https://apisvanguardia.com:400/vgd/singlefileorderslastest';
        $query = [
            'idAgency' => $idAgencyDms,
            'order_dms' => $orderDms,
            'perpage' => 50,
        ];
        if ($agencyConnection !== null && trim($agencyConnection) !== '') {
            $query['connectionstring'] = trim($agencyConnection);
        }
        $url = rtrim((string) $base, '?&') . '?' . http_build_query($query);

        try {
            $client = service('curlrequest');
            $resp = $client->get($url, [
                'headers' => [
                    'X-Provider-Token' => $token,
                    'Accept' => 'application/json',
                    'Accept-Encoding' => 'identity',
                    'User-Agent' => 'SingleFile-Support/1.0',
                ],
                'timeout' => 25,
                'http_errors' => false,
            ]);

            $code = (int) $resp->getStatusCode();
            $body = (string) $resp->getBody();
            $json = $this->decodeJsonResponseBody($body);
            if (!is_array($json)) {
                log_message('warning', 'Vanguardia singlefileorderslastest: JSON inválido HTTP ' . $code);

                return null;
            }

            $orders = [];
            $inner = $json['data'] ?? null;
            if (is_array($inner) && isset($inner['data']) && is_array($inner['data'])) {
                $orders = $inner['data'];
            } elseif (is_array($inner) && $inner !== [] && isset($inner[0])) {
                $orders = $inner;
            } elseif (isset($json['data']) && is_array($json['data'])) {
                $orders = $json['data'];
            }

            $idAgNorm = trim($idAgencyDms);
            $hasAnyIdAgency = false;
            $ordersSameAgency = [];
            foreach ($orders as $ord) {
                if (!is_array($ord)) {
                    continue;
                }
                $ia = $ord['idAgency'] ?? null;
                if ($ia !== null && trim((string) $ia) !== '') {
                    $hasAnyIdAgency = true;
                    if (trim((string) $ia) === $idAgNorm) {
                        $ordersSameAgency[] = $ord;
                    }
                }
            }
            if ($hasAnyIdAgency) {
                $orders = $ordersSameAgency;
            }

            $orderDmsNorm = trim($orderDms);
            $candidates = [];
            foreach ($orders as $order) {
                if (!is_array($order)) {
                    continue;
                }
                $od = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
                if ($od !== null && trim((string) $od) === $orderDmsNorm) {
                    $candidates[] = $order;
                }
            }
            $toScan = $candidates !== [] ? $candidates : $orders;

            foreach ($toScan as $order) {
                if (!is_array($order)) {
                    continue;
                }
                $nd = $this->extractNdFromVanguardiaOrderRow($order);
                if ($nd !== null && $nd !== '') {
                    log_message(
                        'info',
                        'Support: clienteDms obtenido desde singlefileorderslastest (nd=' . $nd . ', order_dms=' . $orderDmsNorm . ')'
                    );

                    return ['nd' => $nd, 'row' => $order];
                }
            }
        } catch (\Throwable $e) {
            log_message('error', 'Support::fetchClienteNdFromVanguardiaOrdersLastest: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * @param array<string, mixed> $row
     */
    private function extractNdFromVanguardiaOrderRow(array $row): ?string
    {
        $keys = ['ndClientDMS', 'ndCliente', 'customerDMS', 'IdTotalDealer', 'nd_dms', 'nd'];
        foreach ($keys as $k) {
            if (isset($row[$k]) && trim((string) $row[$k]) !== '') {
                return trim((string) $row[$k]);
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    private function recomendacionesValidacion(
        bool $procesoOk,
        bool $noCancelado,
        bool $existeCliente,
        bool $existeHeader,
        bool $existeRelacionAgencia
    ): array {
        $r = [];
        if (!$procesoOk) {
            $r[] = 'Revisar catálogo de procesos: habilitar el proceso (Process.Enabled = 1) o asignar un proceso activo al expediente.';
        }
        if (!$noCancelado) {
            $r[] = 'Si el expediente debe mostrarse en validación, cambiar la fase (evitar estado cancelado / IdCurrentState = 5).';
        }
        if (!$existeCliente) {
            $r[] = 'Corregir File.IdClient: crear el cliente en Client o enlazar al Id correcto según datos DMS.';
        }
        if (!$existeHeader) {
            $r[] = 'Crear o recuperar HeaderClient para ese Client.Id (consolidación / importación de cabecera).';
        }
        if (!$existeRelacionAgencia) {
            $r[] = 'En Client_Total_Relation, registrar el nd (IdTotalDealer) para el HeaderClient del cliente y la agencia del expediente.';
        }

        return $r;
    }

    /**
     * GET /api/support/analisis-cliente-dms?ndCliente=45221&idAgencia=7
     * Análisis por IdTotalDealer (nd cliente DMS). Opcional idAgencia para acotar.
     */
    public function analisisClienteDms()
    {
        $deny = $this->denyIfNotSupport();
        if ($deny !== null) {
            return $deny;
        }

        try {
            $nd = trim((string) $this->request->getGet('ndCliente'));
            if ($nd === '') {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro ndCliente (IdTotalDealer DMS) es requerido',
                    'data' => null,
                ])->setStatusCode(400);
            }

            $idAgencia = $this->request->getGet('idAgencia');
            $idAgencia = $idAgencia !== null && $idAgencia !== '' ? (int) $idAgencia : null;

            $sqlCtr = '
                SELECT ctr.Id, ctr.IdAgency, ctr.IdTotalDealer, ctr.idHeaderClient, a.Name AS nombre_agencia
                FROM Client_Total_Relation ctr
                INNER JOIN Agency a ON a.Id = ctr.IdAgency
                WHERE TRIM(CAST(ctr.IdTotalDealer AS CHAR)) = ?
            ';
            $paramsCtr = [$nd];
            if ($idAgencia !== null) {
                $sqlCtr .= ' AND ctr.IdAgency = ?';
                $paramsCtr[] = $idAgencia;
            }

            $ctrRows = $this->db->query($sqlCtr, $paramsCtr)->getResultArray();

            if ($ctrRows === []) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'No hay Client_Total_Relation con ese ndCliente (IdTotalDealer)',
                    'data' => [
                        'ndCliente' => $nd,
                        'encontradoEnCtr' => false,
                        'idClient' => null,
                        'idHeaderClient' => null,
                        'nombreCliente' => null,
                        'existeHeaderClient' => false,
                        'relacionesCtr' => [],
                        'pedidos' => [],
                        'notas' => [
                            'El número no aparece en CTR: puede no estar importado o el nd no coincide.',
                        ],
                    ],
                ]);
            }

            $idHeaderClients = [];
            foreach ($ctrRows as $row) {
                $idh = (int) $row['idHeaderClient'];
                if ($idh > 0) {
                    $idHeaderClients[$idh] = true;
                }
            }
            $idHeaderClients = array_keys($idHeaderClients);

            if (count($idHeaderClients) > 1) {
                $candidatos = [];
                foreach ($idHeaderClients as $idh) {
                    $hc = $this->db->query(
                        'SELECT hc.Id AS id_header, hc.IdClient FROM HeaderClient hc WHERE hc.Id = ? LIMIT 1',
                        [$idh]
                    )->getRowArray();
                    $idC = $hc ? (int) $hc['IdClient'] : 0;
                    $nom = $idC > 0 ? $this->nombreClientePorId($idC) : '';
                    $candidatos[] = [
                        'idHeaderClient' => $idh,
                        'idClient' => $idC,
                        'nombre' => $nom !== '' ? $nom : null,
                    ];
                }

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Varios HeaderClient distintos comparten ese nd en CTR; indique idAgencia o revise datos',
                    'data' => [
                        'ndCliente' => $nd,
                        'encontradoEnCtr' => true,
                        'ambiguo' => true,
                        'candidatos' => $candidatos,
                        'relacionesCtr' => $ctrRows,
                        'pedidos' => [],
                    ],
                ]);
            }

            $idHeaderClient = (int) $idHeaderClients[0];
            $hcRow = $this->db->query(
                'SELECT hc.Id AS id_header, hc.IdClient FROM HeaderClient hc WHERE hc.Id = ? LIMIT 1',
                [$idHeaderClient]
            )->getRowArray();

            if (!$hcRow) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'CTR apunta a HeaderClient inexistente',
                    'data' => [
                        'ndCliente' => $nd,
                        'encontradoEnCtr' => true,
                        'existeHeaderClient' => false,
                        'idHeaderClient' => $idHeaderClient,
                        'relacionesCtr' => $ctrRows,
                        'pedidos' => [],
                        'notas' => ['Inconsistencia: idHeaderClient en CTR sin fila en HeaderClient.'],
                    ],
                ]);
            }

            $idClient = (int) $hcRow['IdClient'];
            $clientRow = $this->db->query(
                'SELECT Id, RazonSocial, Name, LastName, MotherLastName FROM Client WHERE Id = ? LIMIT 1',
                [$idClient]
            )->getRowArray();

            $nombreCliente = $idClient > 0 ? $this->nombreClientePorId($idClient) : '';

            $todasCtr = $this->db->query(
                'SELECT ctr.Id, ctr.IdAgency, ctr.IdTotalDealer, ctr.idHeaderClient, a.Name AS nombre_agencia '
                . 'FROM Client_Total_Relation ctr '
                . 'INNER JOIN Agency a ON a.Id = ctr.IdAgency '
                . 'WHERE ctr.idHeaderClient = ? '
                . 'ORDER BY ctr.IdAgency',
                [$idHeaderClient]
            )->getResultArray();

            $files = $this->db->query(
                'SELECT f.Id AS id_file, f.IdOrderTotal, f.IdAgency, f.IdClient, f.IdCurrentState, '
                . 'a.Name AS agencia, p.Name AS proceso, fs.Name AS estado '
                . 'FROM File f '
                . 'INNER JOIN Agency a ON a.Id = f.IdAgency '
                . 'INNER JOIN Process p ON p.Id = f.IdProcess '
                . 'INNER JOIN File_Status fs ON fs.Id = f.IdCurrentState '
                . 'WHERE f.IdClient = ? '
                . 'ORDER BY f.IdAgency, f.IdOrderTotal, f.Id',
                [$idClient]
            )->getResultArray();

            $pedidos = [];
            foreach ($files as $f) {
                $idAgFile = (int) $f['IdAgency'];
                $relOk = $this->db->query(
                    'SELECT 1 AS ok FROM Client_Total_Relation ctr '
                    . 'WHERE ctr.idHeaderClient = ? AND ctr.IdAgency = ? LIMIT 1',
                    [$idHeaderClient, $idAgFile]
                )->getRowArray() !== null;

                $motivoMal = null;
                $recs = [];
                if (!$relOk) {
                    $motivoMal = 'Sin CTR para idHeaderClient ' . $idHeaderClient . ' y agencia del expediente ' . $idAgFile;
                    $recs[] = 'Crear o corregir Client_Total_Relation: fila con idHeaderClient ' . $idHeaderClient
                        . ' e IdAgency ' . $idAgFile . ' con el nd (IdTotalDealer) correcto para esa agencia.';
                    $recs[] = 'Comprobar en DMS que el cliente tenga nd asignado para esa agencia antes de reimportar.';
                }

                $pedidos[] = [
                    'id_file' => (int) $f['id_file'],
                    'idOrderTotal' => $f['IdOrderTotal'],
                    'idAgency' => $idAgFile,
                    'agencia' => $f['agencia'],
                    'proceso' => $f['proceso'],
                    'estado' => $f['estado'],
                    'idEstado' => (int) $f['IdCurrentState'],
                    'relacionAgenciaOk' => $relOk,
                    'motivoSiRelacionMal' => $motivoMal,
                    'recomendaciones' => $recs,
                ];
            }

            $pedidosPorAgencia = [];
            foreach ($pedidos as $p) {
                $ida = (int) $p['idAgency'];
                if (!isset($pedidosPorAgencia[$ida])) {
                    $pedidosPorAgencia[$ida] = [
                        'idAgencia' => $ida,
                        'nombreAgencia' => $p['agencia'],
                        'pedidos' => [],
                    ];
                }
                $pedidosPorAgencia[$ida]['pedidos'][] = $p;
            }

            $ndEnCtrCoincide = true;
            foreach ($todasCtr as $tr) {
                if (trim((string) ($tr['IdTotalDealer'] ?? '')) !== $nd) {
                    $ndEnCtrCoincide = false;

                    break;
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'OK',
                'data' => [
                    'ndCliente' => $nd,
                    'idAgenciaFiltro' => $idAgencia,
                    'encontradoEnCtr' => true,
                    'ambiguo' => false,
                    'idClient' => $idClient,
                    'nombreCliente' => $nombreCliente !== '' ? $nombreCliente : null,
                    'existeClient' => $clientRow !== null,
                    'idHeaderClient' => $idHeaderClient,
                    'existeHeaderClient' => true,
                    'relacionesCtr' => $todasCtr,
                    'ndCoherenteEnTodasCtr' => $ndEnCtrCoincide,
                    'pedidos' => $pedidos,
                    'pedidosPorAgencia' => array_values($pedidosPorAgencia),
                ],
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Support::analisisClienteDms: ' . $e->getMessage());

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'data' => null,
            ])->setStatusCode(500);
        }
    }

    private function nombreClientePorId(int $idClient): string
    {
        $row = $this->db->query(
            'SELECT RazonSocial, Name, LastName, MotherLastName FROM Client WHERE Id = ? LIMIT 1',
            [$idClient]
        )->getRowArray();

        if (!$row) {
            return '';
        }
        $rz = trim((string) ($row['RazonSocial'] ?? ''));
        if ($rz !== '') {
            return $rz;
        }

        return trim(
            ($row['Name'] ?? '') . ' ' . ($row['LastName'] ?? '') . ' ' . ($row['MotherLastName'] ?? '')
        );
    }
}
