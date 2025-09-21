<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;

class UserProfileImage extends BaseController
{
    protected $format = 'json';
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * Subir imagen de perfil
     */
    public function uploadProfileImage()
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ])->setStatusCode(401);
            }
            
            $userId = $currentUser['user_id'];

            // Obtener archivo
            $file = $this->request->getFile('profile_image');
            if (!$file || !$file->isValid()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se proporcionó un archivo válido'
                ])->setStatusCode(400);
            }

            // Validar tipo de archivo
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, $allowedTypes)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WEBP'
                ])->setStatusCode(400);
            }

            // Validar tamaño (máximo 5MB)
            $maxSize = 5 * 1024 * 1024; // 5MB
            if ($file->getSize() > $maxSize) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El archivo es demasiado grande. Máximo 5MB permitido'
                ])->setStatusCode(400);
            }

            // Validar dimensiones (máximo 2048x2048)
            $imageInfo = getimagesize($file->getTempName());
            if ($imageInfo[0] > 2048 || $imageInfo[1] > 2048) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La imagen es demasiado grande. Máximo 2048x2048 píxeles'
                ])->setStatusCode(400);
            }

            // Convertir imagen a base64
            $imageData = base64_encode(file_get_contents($file->getTempName()));
            $imageType = $mimeType;
            $imageSize = $file->getSize();

            // Actualizar usuario en la base de datos
            $result = $this->userModel->updateProfileImage($userId, $imageData, $imageType, $imageSize);

            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Imagen de perfil actualizada correctamente',
                    'data' => [
                        'image_type' => $imageType,
                        'image_size' => $imageSize,
                        'dimensions' => [
                            'width' => $imageInfo[0],
                            'height' => $imageInfo[1]
                        ]
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar la imagen de perfil'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en uploadProfileImage: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener imagen de perfil
     */
    public function getProfileImage($userId = null)
    {
        try {
            // Si no se especifica userId, usar el usuario autenticado
            if (!$userId) {
                $currentUser = $this->getAuthenticatedUser();
                if (!$currentUser) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Usuario no autenticado'
                    ])->setStatusCode(401);
                }
                $userId = $currentUser['user_id'];
            }

            // Obtener imagen del usuario
            $profileImage = $this->userModel->getProfileImage($userId);

            if (!$profileImage || empty($profileImage['image'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El usuario no tiene imagen de perfil',
                    'data' => null
                ]);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Imagen de perfil obtenida correctamente',
                'data' => $profileImage
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en getProfileImage: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Eliminar imagen de perfil
     */
    public function removeProfileImage()
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ])->setStatusCode(401);
            }
            
            $userId = $currentUser['user_id'];

            // Eliminar imagen del usuario
            $result = $this->userModel->removeProfileImage($userId);

            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Imagen de perfil eliminada correctamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar la imagen de perfil'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en removeProfileImage: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener información de la imagen de perfil (sin la imagen completa)
     */
    public function getProfileImageInfo($userId = null)
    {
        try {
            // Si no se especifica userId, usar el usuario autenticado
            if (!$userId) {
                $currentUser = $this->getAuthenticatedUser();
                if (!$currentUser) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Usuario no autenticado'
                    ])->setStatusCode(401);
                }
                $userId = $currentUser['user_id'];
            }

            // Obtener información de la imagen
            $profileImage = $this->userModel->getProfileImage($userId);

            if (!$profileImage || empty($profileImage['image'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El usuario no tiene imagen de perfil',
                    'data' => null
                ]);
            }

            // Devolver solo la información, no la imagen completa
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Información de imagen obtenida correctamente',
                'data' => [
                    'has_image' => true,
                    'image_type' => $profileImage['type'],
                    'image_size' => $profileImage['size'],
                    'image_size_formatted' => $this->formatBytes($profileImage['size'])
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en getProfileImageInfo: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Formatear bytes a formato legible
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
