<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class UserProfile extends BaseController
{
    protected $userModel;
    
    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * GET /api/user/profile
     * Obtener perfil del usuario autenticado
     */
    public function getProfile()
    {
        try {
            // Obtener ID del usuario del token JWT
            $userId = $this->getUserIdFromToken();
            
            if (!$userId) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no autenticado'
                    ]);
            }
            
            // Obtener datos del usuario
            $user = $this->userModel->find($userId);
            
            if (!$user) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no encontrado'
                    ]);
            }
            
            // Devolver solo los campos necesarios del perfil
            $profileData = [
                'id' => $user['id'] ?? $user['Id'] ?? null,
                'name' => $user['name'] ?? $user['Name'] ?? '',
                'user' => $user['username'] ?? $user['username'] ?? '',
                'email' => $user['email'] ?? $user['email'] ?? '',
                'default_agency' => $user['default_agency'] ?? $user['DefaultAgency'] ?? null,
                'id_user_role' => $user['id_user_role'] ?? $user['IdUserRole'] ?? null,
                'enabled' => $user['enabled'] ?? $user['Enabled'] ?? 0,
                'registration_date' => $user['registration_date'] ?? $user['RegistrationDate'] ?? null,
                'update_date' => $user['update_date'] ?? $user['UpdateDate'] ?? null
            ];
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Perfil obtenido exitosamente',
                    'data' => $profileData
                ]);
                
        } catch (\Exception $e) {
            error_log('Error en UserProfile::getProfile: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'data' => null
                ]);
        }
    }
    
    /**
     * POST /api/user/profile/upload-image
     * Subir imagen de perfil del usuario
     */
    public function uploadImage()
    {
        try {
            // Verificar si se recibió un archivo
            $file = $this->request->getFile('profile_image');
            
            if (!$file || !$file->isValid()) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'No se recibió una imagen válida'
                    ]);
            }
            
            // Validar tipo de archivo
            $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!in_array($file->getMimeType(), $allowedTypes)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WEBP, GIF'
                    ]);
            }
            
            // Validar tamaño (máximo 5MB)
            if ($file->getSize() > 5 * 1024 * 1024) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'La imagen es demasiado grande. Máximo 5MB'
                    ]);
            }
            
            // Generar nombre único para el archivo
            $newName = 'profile_' . time() . '_' . $file->getRandomName();
            
            // Mover archivo a la carpeta de uploads
            $uploadPath = WRITEPATH . 'uploads/profile_images/';
            
            // Crear directorio si no existe
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            
            if ($file->move($uploadPath, $newName)) {
                // Obtener ID del usuario del token JWT (implementar según tu lógica de autenticación)
                $userId = $this->getUserIdFromToken();
                
                if (!$userId) {
                    // Eliminar archivo si no se puede obtener el usuario
                    unlink($uploadPath . $newName);
                    return $this->response
                        ->setStatusCode(401)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Usuario no autenticado'
                        ]);
                }
                
                // Actualizar usuario con la nueva imagen
                $imageData = [
                    'ProfileImage' => 'uploads/profile_images/' . $newName,
                    'ImageType' => $file->getExtension(),
                    'UpdateDate' => date('Y-m-d H:i:s')
                ];
                
                if ($this->userModel->update($userId, $imageData)) {
                    return $this->response
                        ->setStatusCode(200)
                        ->setJSON([
                            'success' => true,
                            'message' => 'Imagen de perfil actualizada exitosamente',
                            'data' => [
                                'profile_image' => $imageData['ProfileImage'],
                                'image_type' => $imageData['ImageType']
                            ]
                        ]);
                } else {
                    // Eliminar archivo si no se pudo actualizar la BD
                    unlink($uploadPath . $newName);
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Error al actualizar la base de datos'
                        ]);
                }
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al subir la imagen'
                    ]);
            }
            
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * DELETE /api/user/profile/remove-image
     * Eliminar imagen de perfil del usuario
     */
    public function removeImage()
    {
        try {
            $userId = $this->getUserIdFromToken();

            if (!$userId) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no autenticado'
                    ]);
            }

            $user = $this->userModel->find($userId);

            if (!$user) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no encontrado'
                    ]);
            }

            if ($this->userModel->removeProfileImage($userId)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Imagen de perfil eliminada exitosamente'
                    ]);
            }

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar la imagen de la base de datos'
                ]);

        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor: ' . $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/user/profile/image/{userId}
     * Obtener imagen de perfil de un usuario
     */
    public function getProfileImage($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de usuario requerido'
                    ]);
            }

            $profileImage = $this->userModel->getProfileImage($userId);

            if (!$profileImage) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no encontrado'
                    ]);
            }

            if (empty($profileImage['image'])) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no tiene imagen de perfil'
                    ]);
            }

            $binary = base64_decode($profileImage['image'], true);
            if ($binary === false) {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Imagen de perfil corrupta (base64 inválido)'
                    ]);
            }

            $mimeType = $profileImage['type'] ?: 'application/octet-stream';

            return $this->response
                ->setContentType($mimeType)
                ->setBody($binary);

        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor: ' . $e->getMessage()
                ]);
        }
    }
    
    /**
     * PUT /api/user/profile/default-agency
     * Actualizar agencia predeterminada del usuario autenticado
     */
    public function updateDefaultAgency()
    {
        try {
            $userId = $this->getUserIdFromToken();
            
            if (!$userId) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no autenticado'
                    ]);
            }
            
            $data = $this->request->getJSON(true);
            
            $defaultAgencyId = isset($data['default_agency']) ? $data['default_agency'] : ($data['defaultAgency'] ?? null);
            if ($defaultAgencyId === null || $defaultAgencyId === '') {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de agencia requerido'
                    ]);
            }
            $defaultAgencyId = (int)$defaultAgencyId;
            
            // Verificar que la agencia existe
            $db = \Config\Database::connect();
            $agencyExists = $db->table('agency')->where('id', $defaultAgencyId)->countAllResults() > 0;
            
            if (!$agencyExists) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'La agencia especificada no existe'
                    ]);
            }
            
            // Actualizar la agencia predeterminada del usuario (snake_case)
            $updateData = [
                'default_agency' => $defaultAgencyId,
                'update_date' => date('Y-m-d H:i:s')
            ];
            
            if ($this->userModel->update($userId, $updateData)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Agencia predeterminada actualizada exitosamente',
                        'data' => [
                            'default_agency' => $defaultAgencyId
                        ]
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al actualizar la agencia predeterminada'
                    ]);
            }
            
        } catch (\Exception $e) {
            error_log('Error en UserProfile::updateDefaultAgency: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * Método auxiliar para obtener el ID del usuario del token JWT
     * Usa el método existente del BaseController
     */
    private function getUserIdFromToken()
    {
        return $this->getCurrentUserId();
    }
}
