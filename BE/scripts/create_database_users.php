<?php
/**
 * Módulo: Insertar usuarios según el modo
 */

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Insertar usuarios básicos (modo minimal)
 */
function insertMinimalUsers($mysqli) {
    $users = [
        [
            'Id' => 1,
            'Name' => 'Administrador Sistema',
            'user' => 'admin',
            'Pass' => hashPassword('admin123'),
            'Mail' => 'admin@nexusqtech.com',
            'IdUserRol' => 7, // Administrador
            'DefaultAgency' => 0, // Sin agencia en modo minimal
        ],
        [
            'Id' => 2,
            'Name' => 'Soporte Técnico',
            'user' => 'soporte',
            'Pass' => hashPassword('soporte123'),
            'Mail' => 'soporte@nexusqtech.com',
            'IdUserRol' => 8, // Soporte
            'DefaultAgency' => 0, // Sin agencia en modo minimal
        ],
    ];
    
    foreach ($users as $userData) {
        $checkQuery = $mysqli->prepare("SELECT Id FROM user WHERE Id = ?");
        $checkQuery->bind_param("i", $userData['Id']);
        $checkQuery->execute();
        $exists = $checkQuery->get_result()->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            $updateQuery = $mysqli->prepare("
                UPDATE user SET 
                    Name = ?, user = ?, Pass = ?, Mail = ?, 
                    IdUserRol = ?, DefaultAgency = ?, 
                    password_migrated = 1, UpdateDate = NOW() 
                WHERE Id = ?
            ");
            $updateQuery->bind_param(
                "ssssiii",
                $userData['Name'],
                $userData['user'],
                $userData['Pass'],
                $userData['Mail'],
                $userData['IdUserRol'],
                $userData['DefaultAgency'],
                $userData['Id']
            );
            $updateQuery->execute();
            $updateQuery->close();
            echo "   ✅ Usuario actualizado: {$userData['Name']}\n";
        } else {
            $insertQuery = $mysqli->prepare("
                INSERT INTO user 
                (Id, Name, user, Pass, Mail, IdUserRol, DefaultAgency, Enabled, password_migrated, RegistrationDate, UpdateDate) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())
            ");
            $insertQuery->bind_param(
                "issssii",
                $userData['Id'],
                $userData['Name'],
                $userData['user'],
                $userData['Pass'],
                $userData['Mail'],
                $userData['IdUserRol'],
                $userData['DefaultAgency']
            );
            $insertQuery->execute();
            $insertQuery->close();
            echo "   ✅ Usuario creado: {$userData['Name']}\n";
        }
    }
}

/**
 * Insertar usuarios demo (modo demo)
 */
function insertDemoUsers($mysqli) {
    // Primero obtener IDs de agencias disponibles
    $agenciesResult = $mysqli->query("SELECT Id FROM agency ORDER BY Id LIMIT 8");
    $agencyIds = [];
    while ($row = $agenciesResult->fetch_assoc()) {
        $agencyIds[] = $row['Id'];
    }
    
    $defaultAgency = !empty($agencyIds) ? $agencyIds[0] : 0;
    
    $users = [
        [
            'Id' => 1,
            'Name' => 'Administrador Sistema',
            'user' => 'admin',
            'Pass' => hashPassword('admin123'),
            'Mail' => 'admin@nexusqtech.com',
            'IdUserRol' => 7,
            'DefaultAgency' => $defaultAgency,
            'agencies' => $agencyIds,
            'processes' => [1, 2, 3],
        ],
        [
            'Id' => 2,
            'Name' => 'Soporte Técnico',
            'user' => 'soporte',
            'Pass' => hashPassword('soporte123'),
            'Mail' => 'soporte@nexusqtech.com',
            'IdUserRol' => 8,
            'DefaultAgency' => $defaultAgency,
            'agencies' => $agencyIds,
            'processes' => [1, 2, 3],
        ],
        [
            'Id' => 3,
            'Name' => 'Auditor Sistema',
            'user' => 'auditor',
            'Pass' => hashPassword('auditor123'),
            'Mail' => 'auditor@nexusqtech.com',
            'IdUserRol' => 9,
            'DefaultAgency' => $defaultAgency,
            'agencies' => $agencyIds,
            'processes' => [1, 2, 3],
        ],
    ];
    
    foreach ($users as $userData) {
        $checkQuery = $mysqli->prepare("SELECT Id FROM user WHERE Id = ?");
        $checkQuery->bind_param("i", $userData['Id']);
        $checkQuery->execute();
        $exists = $checkQuery->get_result()->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            $updateQuery = $mysqli->prepare("
                UPDATE user SET 
                    Name = ?, user = ?, Pass = ?, Mail = ?, 
                    IdUserRol = ?, DefaultAgency = ?, 
                    password_migrated = 1, UpdateDate = NOW() 
                WHERE Id = ?
            ");
            $updateQuery->bind_param(
                "ssssiii",
                $userData['Name'],
                $userData['user'],
                $userData['Pass'],
                $userData['Mail'],
                $userData['IdUserRol'],
                $userData['DefaultAgency'],
                $userData['Id']
            );
            $updateQuery->execute();
            $updateQuery->close();
        } else {
            $insertQuery = $mysqli->prepare("
                INSERT INTO user 
                (Id, Name, user, Pass, Mail, IdUserRol, DefaultAgency, Enabled, password_migrated, RegistrationDate, UpdateDate) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())
            ");
            $insertQuery->bind_param(
                "issssii",
                $userData['Id'],
                $userData['Name'],
                $userData['user'],
                $userData['Pass'],
                $userData['Mail'],
                $userData['IdUserRol'],
                $userData['DefaultAgency']
            );
            $insertQuery->execute();
            $insertQuery->close();
        }
        
        echo "   ✅ Usuario: {$userData['Name']}\n";
        
        // Asignar agencias
        if (!empty($userData['agencies'])) {
            $mysqli->query("DELETE FROM agency_user WHERE IdUser = {$userData['Id']}");
            foreach ($userData['agencies'] as $agencyId) {
                $mysqli->query("INSERT INTO agency_user (IdUser, IdAgency) VALUES ({$userData['Id']}, $agencyId)");
            }
        }
        
        // Asignar procesos
        if (!empty($userData['processes'])) {
            $mysqli->query("DELETE FROM process_user WHERE IdUser = {$userData['Id']}");
            foreach ($userData['processes'] as $processId) {
                $mysqli->query("INSERT INTO process_user (IdUser, IdProcess) VALUES ({$userData['Id']}, $processId)");
            }
        }
    }
}
