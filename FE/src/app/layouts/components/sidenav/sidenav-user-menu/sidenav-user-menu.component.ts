import { Component, OnInit } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
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
export class SidenavUserMenuComponent implements OnInit {
  constructor(
    private popoverRef: VexPopoverRef<SidenavUserMenuComponent>,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  close() {
    this.popoverRef.close();
  }

  logout() {
    console.log('SidenavUserMenuComponent: Iniciando logout...');
    try {
      this.authService.logout().subscribe({
        next: () => {
          console.log('SidenavUserMenuComponent: Logout exitoso');
          this.close();
          // El servicio ya maneja la redirección
        },
        error: (error) => {
          console.error('SidenavUserMenuComponent: Error en logout:', error);
          this.close();
          // El servicio ya maneja la redirección incluso en caso de error
        }
      });
    } catch (error) {
      console.error('SidenavUserMenuComponent: Error al ejecutar logout:', error);
      this.close();
    }
  }
}
