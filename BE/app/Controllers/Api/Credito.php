<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class Credito extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * GET /api/credito/clientes?idAgency=&search=&limit=&offset=
     */
    public function clientes()
    {
        try {
            $idAgency = (int) $this->request->getGet('idAgency');
            if ($idAgency <= 0) {
                return $this->error('El parámetro idAgency es requerido', 400);
            }

            $search = trim((string) $this->request->getGet('search'));
            $limit = (int) $this->request->getGet('limit') ?: 20;
            $offset = (int) $this->request->getGet('offset') ?: 0;
            if ($limit < 1) {
                $limit = 20;
            }
            if ($limit > 100) {
                $limit = 100;
            }
            if ($offset < 0) {
                $offset = 0;
            }

            $where = 'WHERE v.idAgency = ?';
            $params = [$idAgency];
            if ($search !== '') {
                $like = '%' . $this->escapeLike($search) . '%';
                $where .= " AND (
                    v.ndCliente LIKE ? ESCAPE '\\\\'
                    OR v.cliente LIKE ? ESCAPE '\\\\'
                    OR v.razonSocial LIKE ? ESCAPE '\\\\'
                )";
                $params[] = $like;
                $params[] = $like;
                $params[] = $like;
            }

            $countSql = "
                SELECT COUNT(*) AS total
                FROM (
                    SELECT v.idCliente
                    FROM view_client_relations v
                    {$where}
                    GROUP BY v.idCliente
                ) AS clientes
            ";
            $totalRow = $this->db->query($countSql, $params)->getRowArray();
            $total = (int) ($totalRow['total'] ?? 0);

            $sql = "
                SELECT
                    v.idCliente,
                    MIN(v.ndCliente) AS ndCliente,
                    MAX(v.cliente) AS cliente,
                    MAX(v.rfc) AS rfc,
                    MAX(v.razonSocial) AS razonSocial,
                    MAX(v.email) AS email,
                    MAX(v.telefono) AS telefono,
                    MAX(v.telefono2) AS telefono2,
                    (
                        SELECT COUNT(*)
                        FROM Credit_Client_Relation r
                        WHERE (r.IdAgency = ? AND r.IdClientPrincipal = v.idCliente)
                           OR (r.IdAgencyRelacionado = ? AND r.IdClientRelacionado = v.idCliente)
                    ) AS relaciones
                FROM view_client_relations v
                {$where}
                GROUP BY v.idCliente
                ORDER BY MIN(v.ndCliente) ASC
                LIMIT {$limit} OFFSET {$offset}
            ";
            $listParams = array_merge([$idAgency, $idAgency], $params);
            $clientes = $this->db->query($sql, $listParams)->getResultArray();
            $this->normalizeUtf8($clientes);

            foreach ($clientes as &$cliente) {
                $cliente['idCliente'] = (int) $cliente['idCliente'];
                $cliente['relaciones'] = (int) $cliente['relaciones'];
            }
            unset($cliente);

            return $this->ok('Clientes obtenidos exitosamente', [
                'clientes' => $clientes,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Credito::clientes: ' . $e->getMessage());
            return $this->error('Error al obtener los clientes: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/credito/relaciones?idAgency=&idCliente=
     */
    public function relaciones()
    {
        try {
            $idAgency = (int) $this->request->getGet('idAgency');
            $idCliente = (int) $this->request->getGet('idCliente');
            if ($idAgency <= 0 || $idCliente <= 0) {
                return $this->error('idAgency e idCliente son requeridos', 400);
            }

            $sql = "
                SELECT *
                FROM (
                    SELECT
                        r.Id AS id,
                        r.IdClientRelacionado AS idCliente,
                        r.IdAgencyRelacionado AS idAgencyRelacionado,
                        a.Name AS agencia,
                        MIN(v.ndCliente) AS ndCliente,
                        MAX(v.cliente) AS cliente,
                        MAX(v.razonSocial) AS razonSocial,
                        MAX(v.rfc) AS rfc,
                        MAX(v.email) AS email,
                        MAX(v.telefono) AS telefono,
                        MAX(v.telefono2) AS telefono2,
                        r.RegistrationDate AS fechaRegistro
                    FROM Credit_Client_Relation r
                    INNER JOIN view_client_relations v
                        ON v.idCliente = r.IdClientRelacionado
                       AND v.idAgency = r.IdAgencyRelacionado
                    INNER JOIN Agency a ON a.Id = r.IdAgencyRelacionado
                    WHERE r.IdAgency = ?
                      AND r.IdClientPrincipal = ?
                    GROUP BY r.Id, r.IdClientRelacionado, r.IdAgencyRelacionado, a.Name, r.RegistrationDate

                    UNION ALL

                    SELECT
                        r.Id AS id,
                        r.IdClientPrincipal AS idCliente,
                        r.IdAgency AS idAgencyRelacionado,
                        a.Name AS agencia,
                        MIN(v.ndCliente) AS ndCliente,
                        MAX(v.cliente) AS cliente,
                        MAX(v.razonSocial) AS razonSocial,
                        MAX(v.rfc) AS rfc,
                        MAX(v.email) AS email,
                        MAX(v.telefono) AS telefono,
                        MAX(v.telefono2) AS telefono2,
                        r.RegistrationDate AS fechaRegistro
                    FROM Credit_Client_Relation r
                    INNER JOIN view_client_relations v
                        ON v.idCliente = r.IdClientPrincipal
                       AND v.idAgency = r.IdAgency
                    INNER JOIN Agency a ON a.Id = r.IdAgency
                    WHERE r.IdAgencyRelacionado = ?
                      AND r.IdClientRelacionado = ?
                    GROUP BY r.Id, r.IdClientPrincipal, r.IdAgency, a.Name, r.RegistrationDate
                ) AS relaciones
                ORDER BY fechaRegistro ASC, id ASC
            ";
            $relaciones = $this->db->query($sql, [$idAgency, $idCliente, $idAgency, $idCliente])->getResultArray();
            $this->normalizeUtf8($relaciones);

            foreach ($relaciones as &$relacion) {
                $relacion['id'] = (int) $relacion['id'];
                $relacion['idCliente'] = (int) $relacion['idCliente'];
                $relacion['idAgencyRelacionado'] = (int) $relacion['idAgencyRelacionado'];
            }
            unset($relacion);

            return $this->ok('Relaciones obtenidas exitosamente', [
                'relaciones' => $relaciones
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Credito::relaciones: ' . $e->getMessage());
            return $this->error('Error al obtener las relaciones: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/credito/relaciones
     */
    public function crearRelacion()
    {
        try {
            $data = $this->request->getJSON(true) ?? [];
            $idAgency = (int) ($data['idAgency'] ?? 0);
            $idPrincipal = (int) ($data['idClientePrincipal'] ?? 0);
            $idAgencyRelacionado = (int) ($data['idAgencyRelacionado'] ?? 0);
            $idRelacionado = (int) ($data['idClienteRelacionado'] ?? 0);

            if ($idAgency <= 0 || $idPrincipal <= 0 || $idAgencyRelacionado <= 0 || $idRelacionado <= 0) {
                return $this->error('idAgency, idClientePrincipal, idAgencyRelacionado e idClienteRelacionado son requeridos', 400);
            }
            if ($idAgency === $idAgencyRelacionado) {
                return $this->error('La relación debe ser con un cliente de otra agencia', 400);
            }
            if (!$this->clienteEnAgencia($idAgency, $idPrincipal)) {
                return $this->error('El cliente principal no pertenece a la agencia seleccionada', 400);
            }
            if (!$this->clienteEnAgencia($idAgencyRelacionado, $idRelacionado)) {
                return $this->error('El cliente relacionado no pertenece a la otra agencia', 400);
            }
            if ($this->relacionExiste($idAgency, $idPrincipal, $idAgencyRelacionado, $idRelacionado)) {
                return $this->error('Esa relación ya existe', 409);
            }

            $this->db->query(
                'INSERT INTO Credit_Client_Relation (IdAgency, IdClientPrincipal, IdAgencyRelacionado, IdClientRelacionado) VALUES (?, ?, ?, ?)',
                [$idAgency, $idPrincipal, $idAgencyRelacionado, $idRelacionado]
            );

            return $this->ok('Relación guardada', [
                'id' => (int) $this->db->insertID()
            ]);
        } catch (\Exception $e) {
            $message = $e->getMessage();
            if (str_contains($message, '1062') || str_contains($message, 'Duplicate')) {
                return $this->error('Esa relación ya existe', 409);
            }
            log_message('error', 'Credito::crearRelacion: ' . $message);
            return $this->error('Error al guardar la relación: ' . $message, 500);
        }
    }

    /**
     * DELETE /api/credito/relaciones/{id}
     */
    public function eliminarRelacion($id = null)
    {
        try {
            $idRelacion = (int) $id;
            if ($idRelacion <= 0) {
                return $this->error('ID de relación requerido', 400);
            }

            $this->db->query('DELETE FROM Credit_Client_Relation WHERE Id = ?', [$idRelacion]);
            if ($this->db->affectedRows() < 1) {
                return $this->error('Relación no encontrada', 404);
            }

            return $this->ok('Relación eliminada', null);
        } catch (\Exception $e) {
            log_message('error', 'Credito::eliminarRelacion: ' . $e->getMessage());
            return $this->error('Error al eliminar la relación: ' . $e->getMessage(), 500);
        }
    }

    private function relacionExiste(int $idAgency, int $idPrincipal, int $idAgencyRelacionado, int $idRelacionado): bool
    {
        $row = $this->db->query(
            'SELECT 1 AS ok
             FROM Credit_Client_Relation
             WHERE (IdAgency = ? AND IdClientPrincipal = ? AND IdAgencyRelacionado = ? AND IdClientRelacionado = ?)
                OR (IdAgency = ? AND IdClientPrincipal = ? AND IdAgencyRelacionado = ? AND IdClientRelacionado = ?)
             LIMIT 1',
            [
                $idAgency, $idPrincipal, $idAgencyRelacionado, $idRelacionado,
                $idAgencyRelacionado, $idRelacionado, $idAgency, $idPrincipal
            ]
        )->getRowArray();

        return $row !== null;
    }

    private function clienteEnAgencia(int $idAgency, int $idCliente): bool
    {
        $row = $this->db->query(
            'SELECT 1 AS ok FROM view_client_relations WHERE idAgency = ? AND idCliente = ? LIMIT 1',
            [$idAgency, $idCliente]
        )->getRowArray();

        return $row !== null;
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }

    private function normalizeUtf8(array &$rows): void
    {
        array_walk_recursive($rows, function (&$value) {
            if (is_string($value) && !mb_check_encoding($value, 'UTF-8')) {
                $value = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
            }
        });
    }

    private function ok(string $message, $data)
    {
        return $this->response
            ->setHeader('Content-Type', 'application/json; charset=UTF-8')
            ->setJSON([
                'success' => true,
                'message' => $message,
                'data' => $data
            ], JSON_UNESCAPED_UNICODE);
    }

    private function error(string $message, int $status)
    {
        return $this->response->setJSON([
            'success' => false,
            'message' => $message,
            'data' => null
        ])->setStatusCode($status);
    }
}
