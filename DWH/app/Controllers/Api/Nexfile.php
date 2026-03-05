<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * APIs Nexfile - Consume vistas del DWH vgd_dwh_prod
 * Endpoints: nexfile/customers, nexfile/orders, nexfile/invoices
 */
class Nexfile extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * GET /nexfile/customers
     * Vista: view_single_file_client
     * Params: connectionstring, ndDMS (o id)
     */
    public function customers(): ResponseInterface
    {
        try {
            $connectionstring = $this->request->getGet('connection_string') ?? $this->request->getGet('connectionstring');
            $ndCliente = $this->request->getGet('nd_cliente') ?? $this->request->getGet('ndDMS');
            $id = $this->request->getGet('id');

            if (($ndCliente === null || $ndCliente === '') && ($id === null || $id === '')) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere nd_cliente o id',
                ])->setStatusCode(400);
            }

            $cols = $this->getViewColumns('view_single_file_client');
            $sql = 'SELECT * FROM view_single_file_client WHERE 1=1';
            $params = [];
            if ($connectionstring && ($connCol = $this->findColumn($cols, ['connection_string', 'connectionstring', 'agency_connection']))) {
                $sql .= ' AND ' . $connCol . ' = ?';
                $params[] = $connectionstring;
            }
            if ($ndCliente !== null && $ndCliente !== '') {
                $ndCol = $this->findColumn($cols, ['nd_cliente', 'ndCliente', 'nd_dms', 'ndDMS']);
                if (!$ndCol) {
                    throw new \RuntimeException('Vista view_single_file_client no tiene columna nd_cliente/ndCliente/nd_dms/ndDMS. Columnas: ' . implode(', ', $cols));
                }
                $sql .= ' AND ' . $ndCol . ' = ?';
                $params[] = $ndCliente;
            } elseif ($id !== null && $id !== '') {
                $sql .= ' AND id = ?';
                $params[] = $id;
            }

            $perPage = (int) ($this->request->getGet('perpage') ?: 50);
            $page = max(1, (int) ($this->request->getGet('page') ?: 1));
            $offset = ($page - 1) * $perPage;
            $sql .= ' LIMIT ? OFFSET ?';
            $params[] = $perPage;
            $params[] = $offset;

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            array_walk_recursive($rows, function (&$v) {
                if (is_string($v) && !mb_check_encoding($v, 'UTF-8')) {
                    $v = mb_convert_encoding($v, 'UTF-8', 'ISO-8859-1');
                }
            });

            $total = $this->getCustomersTotal($sql, $params, $perPage, $offset);
            $totalPages = $perPage > 0 ? (int) ceil($total / $perPage) : 1;

            return $this->response
                ->setHeader('Content-Type', 'application/json; charset=UTF-8')
                ->setJSON([
                    'status' => 200,
                    'message' => 'OK',
                    'data' => [
                        'total_rows' => $total,
                        'per_page' => $perPage,
                        'page' => $page,
                        'total_pages' => $totalPages,
                        'data' => $this->mapCustomersToResponse($rows),
                    ],
                ], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            log_message('error', 'Nexfile::customers - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /nexfile/orders
     * Vista: single_file_orders_latest
     * Params: customer_dms (requerido), connection_string, id_agency, perpage
     * id_agency + connection_string evitan ambigüedad cuando el mismo id se repite en varias conexiones
     */
    public function orders(): ResponseInterface
    {
        try {
            $customerDms = $this->request->getGet('customer_dms') ?? $this->request->getGet('customerDMS');
            $connectionstring = $this->request->getGet('connection_string') ?? $this->request->getGet('connectionstring');
            $idAgency = $this->request->getGet('id_agency') ?? $this->request->getGet('idAgency');
            $perpage = (int) ($this->request->getGet('perpage') ?: 1000);

            if (!$customerDms) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetro customer_dms requerido',
                ])->setStatusCode(400);
            }

            $cols = $this->getViewColumns('single_file_orders_latest');
            $ndCol = $this->findColumn($cols, ['customer_dms', 'customerDMS', 'nd_cliente', 'ndCliente']);
            if (!$ndCol) {
                throw new \RuntimeException('Vista single_file_orders_latest no tiene columna para customer. Columnas: ' . implode(', ', $cols));
            }
            $sql = 'SELECT * FROM single_file_orders_latest WHERE ' . $ndCol . ' = ?';
            $params = [$customerDms];
            if ($connectionstring && ($connCol = $this->findColumn($cols, ['connection_string', 'connectionstring']))) {
                $sql .= ' AND ' . $connCol . ' = ?';
                $params[] = $connectionstring;
            }
            if ($idAgency !== null && $idAgency !== '') {
                $agencyCol = $this->findColumn($cols, ['id_agency', 'idAgency']);
                if ($agencyCol) {
                    $sql .= ' AND ' . $agencyCol . ' = ?';
                    $params[] = $idAgency;
                }
            }
            $sql .= ' LIMIT ?';
            $params[] = $perpage;

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            array_walk_recursive($rows, function (&$v) {
                if (is_string($v) && !mb_check_encoding($v, 'UTF-8')) {
                    $v = mb_convert_encoding($v, 'UTF-8', 'ISO-8859-1');
                }
            });

            return $this->response
                ->setHeader('Content-Type', 'application/json; charset=UTF-8')
                ->setJSON($this->mapOrdersToResponse($rows), JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            log_message('error', 'Nexfile::orders - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /nexfile/invoices
     * Vista: view_single_file_orders
     * Params: id_agency o id_agencies, release_date_from, release_date_to (filtro por release_date),
     *         delivery_month, delivery_year (legacy), page, limit
     */
    public function invoices(): ResponseInterface
    {
        try {
            $idAgency = $this->request->getGet('id_agency') ?? $this->request->getGet('idAgency');
            $idAgenciesRaw = $this->request->getGet('id_agencies') ?? $this->request->getGet('idAgencies');
            $releaseDateFrom = $this->request->getGet('release_date_from');
            $releaseDateTo = $this->request->getGet('release_date_to');
            $deliveryMonth = $this->request->getGet('delivery_month');
            $deliveryYear = $this->request->getGet('delivery_year');
            $page = max(1, (int) ($this->request->getGet('page') ?: 1));
            $limit = min(5000, max(1, (int) ($this->request->getGet('limit') ?: 50)));
            $perpage = (int) ($this->request->getGet('perpage') ?: 0); // legacy

            $agencyIds = [];
            if (!empty($idAgenciesRaw)) {
                $agencyIds = array_filter(array_map('trim', explode(',', (string) $idAgenciesRaw)));
            }
            if (empty($agencyIds) && $idAgency !== null && $idAgency !== '') {
                $agencyIds = [trim((string) $idAgency)];
            }
            if (empty($agencyIds)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetro id_agency o id_agencies requerido',
                ])->setStatusCode(400);
            }

            $cols = $this->getViewColumns('view_single_file_orders');
            $agencyCol = $this->findColumn($cols, ['id_agency', 'idAgency']);
            if (!$agencyCol) {
                $agencyCol = 'id_agency';
            }

            $placeholders = implode(',', array_fill(0, count($agencyIds), '?'));
            $sql = 'SELECT * FROM view_single_file_orders WHERE ' . $agencyCol . ' IN (' . $placeholders . ')';
            $params = $agencyIds;

            $releaseDateCol = $this->findColumn($cols, ['release_date', 'releaseDate']);
            if ($releaseDateCol && ($releaseDateFrom !== null && $releaseDateFrom !== '' || $releaseDateTo !== null && $releaseDateTo !== '')) {
                if ($releaseDateFrom !== null && $releaseDateFrom !== '') {
                    $sql .= ' AND ' . $releaseDateCol . ' >= ?';
                    $params[] = $releaseDateFrom;
                }
                if ($releaseDateTo !== null && $releaseDateTo !== '') {
                    $sql .= ' AND ' . $releaseDateCol . ' <= ?';
                    $params[] = $releaseDateTo;
                }
            } elseif ($deliveryMonth !== null && $deliveryMonth !== '') {
                $mCol = $this->findColumn($cols, ['delivery_month', 'deliveryMonth']);
                if ($mCol) {
                    $sql .= ' AND ' . $mCol . ' = ?';
                    $params[] = $deliveryMonth;
                }
            }
            if ($deliveryYear !== null && $deliveryYear !== '' && ($releaseDateCol === null || ($releaseDateFrom === null && $releaseDateTo === null))) {
                $yCol = $this->findColumn($cols, ['delivery_year', 'deliveryYear']);
                if ($yCol) {
                    $sql .= ' AND ' . $yCol . ' = ?';
                    $params[] = $deliveryYear;
                }
            }

            $countSql = preg_replace('/SELECT \* FROM/', 'SELECT COUNT(*) as total FROM', $sql);
            $qCount = $this->db->query($countSql, $params);
            $total = (int) ($qCount->getRow()->total ?? 0);

            $offset = ($page - 1) * $limit;
            $releaseCol = $this->findColumn($cols, ['release_date', 'releaseDate']);
            $orderY = $this->findColumn($cols, ['delivery_year', 'deliveryYear']) ?: 'delivery_year';
            $orderM = $this->findColumn($cols, ['delivery_month', 'deliveryMonth']) ?: 'delivery_month';
            $orderO = $this->findColumn($cols, ['order_dms', 'orderDMS', 'numeroPedido']) ?: 'order_dms';
            if ($releaseCol) {
                $sql .= " ORDER BY {$releaseCol} DESC, {$orderO} ASC LIMIT ? OFFSET ?";
            } else {
                $sql .= " ORDER BY {$orderY} DESC, {$orderM} DESC, {$orderO} ASC LIMIT ? OFFSET ?";
            }
            $params[] = $perpage > 0 ? $perpage : $limit;
            $params[] = $perpage > 0 ? 0 : $offset;

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            array_walk_recursive($rows, function (&$v) {
                if (is_string($v) && !mb_check_encoding($v, 'UTF-8')) {
                    $v = mb_convert_encoding($v, 'UTF-8', 'ISO-8859-1');
                }
            });

            $mapped = $this->mapInvoicesToResponse($rows);
            $response = ['data' => $mapped, 'total' => $total, 'page' => $page, 'limit' => ($perpage > 0 ? $perpage : $limit)];
            return $this->response
                ->setHeader('Content-Type', 'application/json; charset=UTF-8')
                ->setJSON($response, JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            log_message('error', 'Nexfile::invoices - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ])->setStatusCode(500);
        }
    }

    private function getCustomersTotal(string $sql, array $params, int $perPage, int $offset): int
    {
        $countSql = preg_replace('/SELECT \* FROM/', 'SELECT COUNT(*) as total FROM', $sql);
        $countSql = preg_replace('/\s+LIMIT\s+\?\s+OFFSET\s+\?$/i', '', $countSql);
        $countParams = array_slice($params, 0, -2);
        $q = $this->db->query($countSql, $countParams);
        $row = $q->getRow();
        return $row ? (int) $row->total : 0;
    }

    /**
     * Mapea filas de la vista al formato snake_case para el frontend
     */
    private function mapCustomersToResponse(array $rows): array
    {
        $out = [];
        foreach ($rows as $r) {
            $name = $r['name'] ?? $r['nombre'] ?? $r['Name'] ?? '';
            $paternal = $r['paternal_surname'] ?? $r['apellidoPaterno'] ?? $r['apellido_paterno'] ?? $r['LastName'] ?? '';
            $maternal = $r['maternal_surname'] ?? $r['apellidoMaterno'] ?? $r['apellido_materno'] ?? $r['MotherLastName'] ?? '';
            $bussinesName = $r['bussines_name'] ?? $r['razonSocial'] ?? $r['razon_social'] ?? '';
            $tipoCliente = $r['tipo_cliente'] ?? '';
            if (empty(trim($bussinesName)) && $tipoCliente === 'fisica') {
                $bussinesName = trim("$name $paternal $maternal");
            }
            $out[] = [
                'id_agency' => $r['id_agency'] ?? $r['idAgency'] ?? '',
                'nd_cliente' => $r['nd_cliente'] ?? $r['ndDMS'] ?? $r['nd_dms'] ?? $r['ndCliente'] ?? '',
                'bussines_name' => $bussinesName,
                'name' => $name,
                'paternal_surname' => $paternal,
                'maternal_surname' => $maternal,
                'rfc' => $r['rfc'] ?? $r['RFC'] ?? '',
                'curp' => $r['curp'] ?? $r['CURP'] ?? '',
                'phone' => $r['phone'] ?? $r['telefono'] ?? $r['TelNumber'] ?? '',
                'mobile_phone' => $r['mobile_phone'] ?? $r['telefono2'] ?? $r['TelNumber2'] ?? '',
                'mail' => $r['mail'] ?? $r['email'] ?? $r['Email'] ?? '',
                'connection_string' => $r['connection_string'] ?? $r['connectionstring'] ?? '',
                'tipo_cliente' => $r['tipo_cliente'] ?? '',
            ];
        }
        return $out;
    }

    /**
     * Mapea filas de pedidos a snake_case
     */
    private function mapOrdersToResponse(array $rows): array
    {
        $out = [];
        foreach ($rows as $r) {
            $orderDms = $r['order_dms'] ?? $r['numeroPedido'] ?? $r['orderNumber'] ?? $r['orderDMS'] ?? $r['OrderDMS'] ?? $r['numero_pedido'] ?? $r['id'] ?? null;
            $out[] = $this->normalizeRowToSnakeCase(array_merge($r, ['order_dms' => $orderDms !== null ? trim((string) $orderDms) : null]));
        }
        return $out;
    }

    /**
     * Mapea filas de facturas a snake_case
     */
    private function mapInvoicesToResponse(array $rows): array
    {
        $out = [];
        foreach ($rows as $r) {
            $out[] = $this->normalizeRowToSnakeCase($r);
        }
        return $out;
    }

    /** Normaliza claves de fila a snake_case */
    private function normalizeRowToSnakeCase(array $row): array
    {
        $map = [
            'idAgency' => 'id_agency', 'orderDMS' => 'order_dms', 'numeroPedido' => 'order_dms',
            'consultantName' => 'consultant_name', 'ndConsultant' => 'nd_consultant',
            'customerDMS' => 'customer_dms', 'connectionstring' => 'connection_string',
            'externalColor' => 'external_color', 'internalColor' => 'internal_color',
            'deliveryMonth' => 'delivery_month', 'deliveryYear' => 'delivery_year',
            'releaseDate' => 'release_date',
            'version_name' => 'version', 'modelo' => 'model',
            'bussinesName' => 'bussines_name', 'razonSocial' => 'bussines_name',
            'tipoOperacion' => 'tipo_operacion', 'tipoProceso' => 'tipo_proceso',
        ];
        $out = [];
        foreach ($row as $k => $v) {
            $newKey = $map[$k] ?? preg_replace_callback('/([A-Z])/', fn ($m) => '_' . strtolower($m[1]), $k);
            $out[$newKey] = $v;
        }
        return $out;
    }

    /** Obtiene columnas de una vista/tabla desde INFORMATION_SCHEMA */
    private function getViewColumns(string $table): array
    {
        $db = $this->db->getDatabase();
        $q = $this->db->query(
            'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION',
            [$db, $table]
        );
        $cols = [];
        foreach ($q->getResultArray() as $row) {
            $cols[] = $row['COLUMN_NAME'];
        }
        return $cols;
    }

    /** Devuelve la primera columna que exista en $cols */
    private function findColumn(array $cols, array $candidates): ?string
    {
        $colsLower = array_map('strtolower', $cols);
        foreach ($candidates as $c) {
            if (in_array(strtolower($c), $colsLower, true)) {
                $k = array_search(strtolower($c), $colsLower, true);
                return $cols[$k];
            }
        }
        return null;
    }
}
