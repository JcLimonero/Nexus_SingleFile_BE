import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'vex-sidenav-user-menu',
  templateUrl: './sidenav-user-menu.component.html',
  styleUrls: ['./sidenav-user-menu.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf, RouterLink]
})
export class SidenavUserMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private readonly authService: AuthService) {}

  close(): void {
    this.closeMenu.emit();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.close(),
      error: () => this.close()
    });
  }
}
