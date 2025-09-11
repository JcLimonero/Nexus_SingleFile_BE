<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ProcessSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'Id' => '1',
                'Name' => 'Gestión de Clientes',
                'Code' => 'PROC001',
                'Description' => 'Proceso para la gestión integral de clientes del sistema',
                'Enabled' => 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => '1'
            ],
            [
                'Id' => '2',
                'Name' => 'Gestión de Ventas',
                'Code' => 'PROC002',
                'Description' => 'Proceso para el manejo de ventas y transacciones',
                'Enabled' => 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => '1'
            ],
            [
                'Id' => '3',
                'Name' => 'Gestión de Inventario',
                'Code' => 'PROC003',
                'Description' => 'Proceso para el control de inventario y stock',
                'Enabled' => 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => '1'
            ],
            [
                'Id' => '4',
                'Name' => 'Gestión de Recursos Humanos',
                'Code' => 'PROC004',
                'Description' => 'Proceso para la administración de personal',
                'Enabled' => 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => '1'
            ],
            [
                'Id' => '5',
                'Name' => 'Gestión Financiera',
                'Code' => 'PROC005',
                'Description' => 'Proceso para el control financiero y contable',
                'Enabled' => 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => '1'
            ]
        ];

        $this->db->table('Process')->insertBatch($data);
    }
}
