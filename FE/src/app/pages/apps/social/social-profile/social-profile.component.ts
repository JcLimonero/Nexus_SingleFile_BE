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
import { Observable } from 'rxjs';

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

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.currentUser$ = this.authService.currentUser$;
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
}
