import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface ProfileImageInfo {
  has_image: boolean;
  image_type?: string;
  image_size?: number;
  image_size_formatted?: string;
}

export interface ProfileImageData {
  image: string;
  type: string;
  size: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    image_type: string;
    image_size: number;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileImageService {
  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  /**
   * Subir imagen de perfil
   */
  uploadProfileImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('profile_image', file);
    
    const url = this.apiBaseService.buildApiUrl('user/profile-image/upload');
    return this.http.post<UploadResponse>(url, formData);
  }

  /**
   * Obtener imagen de perfil del usuario autenticado
   */
  getProfileImage(): Observable<{ success: boolean; message: string; data: ProfileImageData | null }> {
    const url = this.apiBaseService.buildApiUrl('user/profile-image/get');
    return this.http.get<{ success: boolean; message: string; data: ProfileImageData | null }>(url);
  }

  /**
   * Obtener imagen de perfil de un usuario específico
   */
  getProfileImageById(userId: string): Observable<{ success: boolean; message: string; data: ProfileImageData | null }> {
    const url = this.apiBaseService.buildApiUrl(`user/profile-image/get/${userId}`);
    return this.http.get<{ success: boolean; message: string; data: ProfileImageData | null }>(url);
  }

  /**
   * Obtener información de la imagen de perfil (sin la imagen completa)
   */
  getProfileImageInfo(): Observable<{ success: boolean; message: string; data: ProfileImageInfo | null }> {
    const url = this.apiBaseService.buildApiUrl('user/profile-image/info');
    return this.http.get<{ success: boolean; message: string; data: ProfileImageInfo | null }>(url);
  }

  /**
   * Obtener información de la imagen de perfil de un usuario específico
   */
  getProfileImageInfoById(userId: string): Observable<{ success: boolean; message: string; data: ProfileImageInfo | null }> {
    const url = this.apiBaseService.buildApiUrl(`user/profile-image/info/${userId}`);
    return this.http.get<{ success: boolean; message: string; data: ProfileImageInfo | null }>(url);
  }

  /**
   * Eliminar imagen de perfil
   */
  removeProfileImage(): Observable<{ success: boolean; message: string }> {
    const url = this.apiBaseService.buildApiUrl('user/profile-image/remove');
    return this.http.delete<{ success: boolean; message: string }>(url);
  }

  /**
   * Convertir imagen base64 a URL de datos
   */
  getProfileImageUrl(imageData: string, imageType: string): string {
    return `data:${imageType};base64,${imageData}`;
  }

  /**
   * Validar archivo de imagen
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WEBP' 
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'El archivo es demasiado grande. Máximo 5MB permitido' 
      };
    }

    return { valid: true };
  }

  /**
   * Comprimir imagen antes de subir (opcional)
   */
  async compressImage(file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, 0.8); // Calidad 0.8
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
