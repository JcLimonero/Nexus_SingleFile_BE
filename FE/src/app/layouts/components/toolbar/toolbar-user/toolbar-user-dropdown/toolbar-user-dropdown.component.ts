import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { trackById } from '../../../../../core/utils/track-by';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor, NgIf } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';

export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  colorClass: string;
  route: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    NgFor,
    MatRippleModule,
    RouterLink,
    NgIf,
    AsyncPipe
  ]
})
export class ToolbarUserDropdownComponent implements OnInit {
  @Output() closeMenu = new EventEmitter<void>();
  currentUser$: Observable<User | null>;

  items: MenuItem[] = [
    {
      id: '1',
      icon: 'mat:account_circle',
      label: 'Mi Perfil',
      description: 'Información Personal',
      colorClass: 'text-teal-600',
      route: '/apps/social'
    }
    // Ocultas por el momento: Mi Bandeja, Mis Proyectos, Información de Facturación
  ];

  trackById = trackById;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {}

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
