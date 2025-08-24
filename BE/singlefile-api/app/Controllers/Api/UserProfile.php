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
            
            // Obtener usuario actual
            $user = $this->userModel->find($userId);
            
            if (!$user) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no encontrado'
                    ]);
            }
            
            // Eliminar archivo físico si existe
            if ($user['ProfileImage'] && file_exists(WRITEPATH . $user['ProfileImage'])) {
                unlink(WRITEPATH . $user['ProfileImage']);
            }
            
            // Actualizar usuario eliminando la imagen
            $imageData = [
                'ProfileImage' => null,
                'ImageType' => null,
                'UpdateDate' => date('Y-m-d H:i:s')
            ];
            
            if ($this->userModel->update($userId, $imageData)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Imagen de perfil eliminada exitosamente'
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al eliminar la imagen de la base de datos'
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
            
            $user = $this->userModel->find($userId);
            
            if (!$user) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no encontrado'
                    ]);
            }
            
            if (!$user['ProfileImage']) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no tiene imagen de perfil'
                    ]);
            }
            
            $imagePath = WRITEPATH . $user['ProfileImage'];
            
            if (!file_exists($imagePath)) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Imagen no encontrada en el servidor'
                    ]);
            }
            
            // Retornar la imagen
            $fileInfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $fileInfo->file($imagePath);
            
            return $this->response
                ->setContentType($mimeType)
                ->setBody(file_get_contents($imagePath));
                
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
     * Método auxiliar para obtener el ID del usuario del token JWT
     * Implementar según tu lógica de autenticación
     */
    private function getUserIdFromToken()
    {
        // Aquí implementarías la lógica para extraer el user_id del token JWT
        // Por ahora retornamos null para que se implemente según tu sistema
        return null;
    }
}
