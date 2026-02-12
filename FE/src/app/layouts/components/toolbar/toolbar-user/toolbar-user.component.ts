import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../../core/services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'vex-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule,
    MatMenuModule,
    ToolbarUserDropdownComponent,
    AsyncPipe,
    NgIf
  ]
})
export class ToolbarUserComponent {
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  constructor(private readonly authService: AuthService) {}

  closeUserMenu(trigger: MatMenuTrigger): void {
    trigger.closeMenu();
  }
}
