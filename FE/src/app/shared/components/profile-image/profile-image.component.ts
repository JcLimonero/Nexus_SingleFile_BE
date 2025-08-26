import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-image',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <div class="profile-image-container">
      <!-- Imagen de perfil -->
      <div class="profile-image-wrapper" [class.has-image]="imageUrl">
        <img 
          *ngIf="imageUrl" 
          [src]="imageUrl" 
          [alt]="altText"
          class="profile-image"
          (error)="onImageError()"
        />
        
        <!-- Placeholder cuando no hay imagen -->
        <div *ngIf="!imageUrl" class="profile-placeholder">
          <mat-icon>person</mat-icon>
        </div>
        
        <!-- Overlay para acciones -->
        <div class="image-overlay" *ngIf="showActions">
          <button 
            mat-icon-button 
            class="action-button"
            matTooltip="Cambiar imagen"
            (click)="fileInput.click()"
          >
            <mat-icon>photo_camera</mat-icon>
          </button>
          
          <button 
            *ngIf="imageUrl"
            mat-icon-button 
            class="action-button remove-button"
            matTooltip="Eliminar imagen"
            (click)="removeImage()"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
      
      <!-- Input de archivo oculto -->
      <input
        #fileInput
        type="file"
        accept="image/*"
        style="display: none"
        (change)="onFileSelected($event)"
      />
      
      <!-- Indicador de carga -->
      <div *ngIf="loading" class="loading-overlay">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
      </div>
    </div>
  `,
  styles: [`
    .profile-image-container {
      position: relative;
      display: inline-block;
    }
    
    .profile-image-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f5f5f5;
      border: 3px solid #e0e0e0;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .profile-image-wrapper:hover {
      border-color: #1976d2;
      transform: scale(1.05);
    }
    
    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #9e9e9e;
    }
    
    .profile-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .profile-image-wrapper:hover .image-overlay {
      opacity: 1;
    }
    
    .action-button {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .action-button:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .remove-button {
      background-color: rgba(244, 67, 54, 0.8);
    }
    
    .remove-button:hover {
      background-color: rgba(244, 67, 54, 1);
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .loading-icon {
      animation: spin 1s linear infinite;
      color: #1976d2;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProfileImageComponent implements OnInit, OnDestroy {
  @Input() userId?: number;
  @Input() showActions: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() altText: string = 'Imagen de perfil';
  
  @Output() imageChanged = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();
  
  imageUrl: string | null = null;
  loading: boolean = false;
  
  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.loadProfileImage();
  }
  
  ngOnDestroy() {
    if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
      this.userProfileService.revokeImageUrl(this.imageUrl);
    }
  }
  
  loadProfileImage() {
    if (!this.userId) {
      const currentUser = this.authService.getCurrentUser();
      this.userId = currentUser?.id || undefined;
    }
    
    if (this.userId) {
      this.loading = true;
      this.userProfileService.getProfileImage(this.userId).subscribe({
        next: (blob) => {
          this.imageUrl = this.userProfileService.createImageUrl(blob);
          this.loading = false;
        },
        error: (error) => {
          // Usuario sin imagen de perfil o error al cargar
          this.loading = false;
        }
      });
    }
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar archivo
    const validation = this.userProfileService.validateImageFile(file);
    if (!validation.valid) {
      this.snackBar.open(validation.message || 'Archivo inválido', 'Error', {
        duration: 3000
      });
      return;
    }
    
    // Subir imagen
    this.loading = true;
    this.userProfileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Imagen de perfil actualizada exitosamente', 'OK', {
            duration: 3000
          });
          
          // Recargar imagen
          this.loadProfileImage();
          this.imageChanged.emit(response.data?.profile_image || '');
        } else {
          this.snackBar.open(response.message || 'Error al actualizar imagen', 'Error', {
            duration: 5000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al subir la imagen', 'Error', {
          duration: 5000
        });
        this.loading = false;
      }
    });
    
    // Limpiar input
    event.target.value = '';
  }
  
  removeImage() {
    if (confirm('¿Estás seguro de que quieres eliminar tu imagen de perfil?')) {
      this.loading = true;
      this.userProfileService.removeProfileImage().subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Imagen de perfil eliminada exitosamente', 'OK', {
              duration: 3000
            });
            
            // Limpiar imagen
            if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
              this.userProfileService.revokeImageUrl(this.imageUrl);
            }
            this.imageUrl = null;
            this.imageRemoved.emit();
          } else {
            this.snackBar.open(response.message || 'Error al eliminar imagen', 'Error', {
              duration: 5000
            });
          }
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar la imagen', 'Error', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }
  
  onImageError() {
    this.imageUrl = null;
  }
}
