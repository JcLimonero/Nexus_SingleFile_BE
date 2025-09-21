<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class MigrateExistingPasswords extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        
        // Obtener todos los usuarios con contraseñas en texto plano
        $users = $db->table('User')
                    ->select('Id, Pass')
                    ->where('password_migrated', 0)
                    ->get()
                    ->getResultArray();
        
        foreach ($users as $user) {
            // Encriptar la contraseña existente
            $hashedPassword = password_hash($user['Pass'], PASSWORD_DEFAULT);
            
            // Actualizar la contraseña encriptada y marcar como migrada
            $db->table('User')
               ->where('Id', $user['Id'])
               ->update([
                   'Pass' => $hashedPassword,
                   'password_migrated' => 1,
                   'UpdateDate' => date('Y-m-d H:i:s')
               ]);
        }
        
        // Log de la migración
        log_message('info', 'Migrated ' . count($users) . ' user passwords to bcrypt hash');
    }

    public function down()
    {
        // No se puede revertir la encriptación de contraseñas por seguridad
        // Solo se puede marcar como no migradas
        $db = \Config\Database::connect();
        
        $db->table('User')
           ->update(['password_migrated' => 0]);
    }
}
