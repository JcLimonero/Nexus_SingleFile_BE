<?php

namespace App\Models;

use CodeIgniter\Model;

class UserActivityLogModel extends Model
{
    protected $table = 'user_activity_logs';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id', 'username', 'action', 'description', 'change_details'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    // Validation
    protected $validationRules = [
        'user_id' => 'required|max_length[255]',
        'username' => 'required|max_length[255]',
        'action' => 'required|max_length[255]',
    ];

    protected $validationMessages = [
        'user_id' => [
            'required' => 'El ID del usuario es requerido',
            'max_length' => 'El ID del usuario no puede exceder 255 caracteres'
        ],
        'username' => [
            'required' => 'El nombre de usuario es requerido',
            'max_length' => 'El nombre de usuario no puede exceder 255 caracteres'
        ],
        'action' => [
            'required' => 'La acción es requerida',
            'max_length' => 'La acción no puede exceder 255 caracteres'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    /**
     * Crear un nuevo log de actividad
     */
    public function createLog($data)
    {
        return $this->insert($data);
    }

    /**
     * Obtener todos los logs con paginación
     */
    public function getAllLogs($limit = 100, $offset = 0, $filters = [])
    {
        $builder = $this->builder();

        // Aplicar filtros
        if (!empty($filters['user_id'])) {
            $builder->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $builder->where('action', $filters['action']);
        }

        if (!empty($filters['start_date'])) {
            $builder->where('created_at >=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $builder->where('created_at <=', $filters['end_date']);
        }

        if (!empty($filters['change_details'])) {
            $builder->like('change_details', $filters['change_details']);
        }

        return $builder->orderBy('created_at', 'DESC')
                      ->limit($limit)
                      ->offset($offset)
                      ->get()
                      ->getResultArray();
    }

    /**
     * Obtener logs por usuario
     */
    public function getLogsByUser($userId, $limit = 100, $offset = 0)
    {
        return $this->where('user_id', $userId)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }

    /**
     * Obtener logs por acción
     */
    public function getLogsByAction($action, $limit = 100, $offset = 0)
    {
        return $this->where('action', $action)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }

    /**
     * Obtener logs por rango de fechas
     */
    public function getLogsByDateRange($startDate, $endDate, $limit = 100, $offset = 0)
    {
        return $this->where('created_at >=', $startDate)
                    ->where('created_at <=', $endDate)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }

    /**
     * Obtener logs con filtros avanzados
     */
    public function getLogsWithFilters($filters = [], $limit = 100, $offset = 0)
    {
        $builder = $this->builder();

        if (!empty($filters['user_id'])) {
            $builder->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $builder->where('action', $filters['action']);
        }

        if (!empty($filters['start_date'])) {
            $builder->where('created_at >=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $builder->where('created_at <=', $filters['end_date']);
        }

        if (!empty($filters['change_details'])) {
            $builder->like('change_details', $filters['change_details']);
        }

        return $builder->orderBy('created_at', 'DESC')
                      ->limit($limit)
                      ->offset($offset)
                      ->get()
                      ->getResultArray();
    }

        /**
     * Obtener estadísticas de logs
     */
    public function getLogStats($userId = null, $startDate = null, $endDate = null)
    {
        $builder = $this->builder();

        if ($userId) {
            $builder->where('user_id', $userId);
        }

        if ($startDate) {
            $builder->where('created_at >=', $startDate);
        }

        if ($endDate) {
            $builder->where('created_at <=', $endDate);
        }

        // Contar total de logs
        $totalLogs = $builder->countAllResults();

        // Obtener conteo por acción
        $actionsBuilder = $this->builder();
        if ($userId) $actionsBuilder->where('user_id', $userId);
        if ($startDate) $actionsBuilder->where('created_at >=', $startDate);
        if ($endDate) $actionsBuilder->where('created_at <=', $endDate);
        
        $actionsCount = $actionsBuilder->select('action, COUNT(*) as count')
                                     ->groupBy('action')
                                     ->get()
                                     ->getResultArray();

        // Obtener conteo por usuario
        $usersBuilder = $this->builder();
        if ($startDate) $usersBuilder->where('created_at >=', $startDate);
        if ($endDate) $usersBuilder->where('created_at <=', $endDate);
        
        $usersCount = $usersBuilder->select('user_id, username, COUNT(*) as count')
                                   ->groupBy('user_id, username')
                                   ->orderBy('count', 'DESC')
                                   ->limit(10)
                                   ->get()
                                   ->getResultArray();

        $stats = [
            'total_logs' => $totalLogs,
            'actions_count' => $actionsCount,
            'users_count' => $usersCount
        ];

        return $stats;
    }

    /**
     * Contar total de logs con filtros
     */
    public function countLogsWithFilters($filters = [])
    {
        $builder = $this->builder();

        // Aplicar filtros
        if (!empty($filters['user_id'])) {
            $builder->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $builder->where('action', $filters['action']);
        }

        if (!empty($filters['start_date'])) {
            $builder->where('created_at >=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $builder->where('created_at <=', $filters['end_date']);
        }

        if (!empty($filters['change_details'])) {
            $builder->like('change_details', $filters['change_details']);
        }

        return $builder->countAllResults();
    }

    /**
     * Limpiar logs antiguos (más de X días)
     */
    public function cleanOldLogs($days = 90)
    {
        $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$days} days"));
        return $this->where('created_at <', $cutoffDate)->delete();
    }
}
