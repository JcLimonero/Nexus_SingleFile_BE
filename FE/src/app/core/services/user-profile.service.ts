import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data?: {
    profile_image: string;
    image_type: string;
  };
}

export interface RemoveImageResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly API_URL = '/api/user/profile';

  constructor(private http: HttpClient) {}

  /**
   * Subir imagen de perfil
   */
  uploadProfileImage(file: File): Observable<UploadImageResponse> {
    const formData = new FormData();
    formData.append('profile_image', file);
    
    return this.http.post<UploadImageResponse>(`${this.API_URL}/upload-image`, formData);
  }

  /**
   * Eliminar imagen de perfil
   */
  removeProfileImage(): Observable<RemoveImageResponse> {
    return this.http.delete<RemoveImageResponse>(`${this.API_URL}/remove-image`);
  }

  /**
   * Obtener URL de imagen de perfil
   */
  getProfileImageUrl(userId: number): string {
    return `${this.API_URL}/image/${userId}`;
  }

  /**
   * Obtener imagen de perfil como blob
   */
  getProfileImage(userId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/image/${userId}`, { responseType: 'blob' });
  }

  /**
   * Crear URL de objeto para mostrar imagen
   */
  createImageUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  /**
   * Liberar URL de objeto
   */
  revokeImageUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Validar archivo de imagen
   */
  validateImageFile(file: File): { valid: boolean; message?: string } {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WEBP, GIF'
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        message: 'La imagen es demasiado grande. Máximo 5MB'
      };
    }

    return { valid: true };
  }
}
