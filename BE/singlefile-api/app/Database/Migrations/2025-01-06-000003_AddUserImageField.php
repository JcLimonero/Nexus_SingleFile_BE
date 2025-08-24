<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddUserImageField extends Migration
{
    public function up()
    {
        // Agregar campo para almacenar la imagen del usuario
        $this->forge->addColumn('User', [
            'ProfileImage' => [
                'type' => 'VARCHAR',
                'constraint' => 500,
                'null' => true,
                'default' => null,
                'comment' => 'Ruta o URL de la imagen de perfil del usuario'
            ]
        ]);
        
        // Agregar campo para almacenar el tipo de imagen (opcional)
        $this->forge->addColumn('User', [
            'ImageType' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
                'default' => null,
                'comment' => 'Tipo de imagen (jpg, png, webp, etc.)'
            ]
        ]);
    }

    public function down()
    {
        // Revertir cambios
        $this->forge->dropColumn('User', 'ProfileImage');
        $this->forge->dropColumn('User', 'ImageType');
    }
}
