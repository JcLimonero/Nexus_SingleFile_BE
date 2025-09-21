<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateUserPasswordField extends Migration
{
    public function up()
    {
        // Cambiar el campo Pass de VARCHAR(50) a VARCHAR(255) para soportar hash bcrypt
        $this->forge->modifyColumn('User', [
            'Pass' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
                'comment' => 'Password hash (bcrypt)'
            ]
        ]);
        
        // Agregar campo para tracking de migración de contraseñas
        $this->forge->addColumn('User', [
            'password_migrated' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'null' => false,
                'comment' => 'Flag para indicar si la contraseña ya fue migrada a hash'
            ]
        ]);
    }

    public function down()
    {
        // Revertir cambios
        $this->forge->modifyColumn('User', [
            'Pass' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ]
        ]);
        
        $this->forge->dropColumn('User', 'password_migrated');
    }
}
