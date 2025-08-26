import { Component, OnInit } from '@angular/core';
import { FriendSuggestion } from '../social.component';
import { friendSuggestions } from '../../../../../static-data/friend-suggestions';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService, User } from '../../../../core/services/auth.service';
import { UserProfileImageService, ProfileImageInfo } from '../../../../core/services/user-profile-image.service';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'vex-social-profile',
  templateUrl: './social-profile.component.html',
  styleUrls: ['./social-profile.component.scss'],
  animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms],
  standalone: true,
  imports: [MatIconModule, NgFor, NgIf, MatButtonModule, MatDialogModule, AsyncPipe]
})
export class SocialProfileComponent implements OnInit {
  suggestions = friendSuggestions;
  currentUser$: Observable<User | null>;
  profileImageInfo$: Observable<ProfileImageInfo | null>;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private userProfileImageService: UserProfileImageService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.profileImageInfo$ = this.userProfileImageService.getProfileImageInfo().pipe(
      map(response => response.success ? response.data : null)
    );
  }

  ngOnInit(): void {}

  addFriend(friend: FriendSuggestion) {
    friend.added = true;
  }

  removeFriend(friend: FriendSuggestion) {
    friend.added = false;
  }

  trackByName(index: number, friend: FriendSuggestion) {
    return friend.name;
  }

  async openChangePasswordDialog(): Promise<void> {
    const { ChangePasswordDialogComponent } = await import('../change-password-dialog');
    
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'change-password-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Contraseña actualizada exitosamente');
      }
    });
  }

  async uploadProfileImage(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo
    const validation = this.userProfileImageService.validateImageFile(file);
    if (!validation.valid) {
      console.error('Archivo no válido:', validation.error);
      return;
    }

    try {
      // Comprimir imagen antes de subir
      const compressedFile = await this.userProfileImageService.compressImage(file);
      
      // Subir imagen
      const result = await firstValueFrom(this.userProfileImageService.uploadProfileImage(compressedFile));
      
      if (result?.success) {
        // Recargar información del usuario
        // No es necesario recargar desde el AuthService, solo actualizar la información de imagen
        this.refreshProfileImageInfo();
        console.log('Imagen de perfil actualizada correctamente');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  }

  async removeProfileImage(): Promise<void> {
    try {
      const result = await firstValueFrom(this.userProfileImageService.removeProfileImage());
      
      if (result?.success) {
        // Recargar información del usuario
        // No es necesario recargar desde el AuthService, solo actualizar la información de imagen
        this.refreshProfileImageInfo();
        console.log('Imagen de perfil eliminada correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  }

  getProfileImageUrl(user: User): string | null {
    if (user?.profile_image && user?.image_type) {
      return this.userProfileImageService.getProfileImageUrl(user.profile_image, user.image_type);
    }
    return null;
  }

  private refreshProfileImageInfo(): void {
    this.profileImageInfo$ = this.userProfileImageService.getProfileImageInfo().pipe(
      map(response => response.success ? response.data : null)
    );
  }
}
