import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { trackById } from '@vex/utils/track-by';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { NgFor, NgClass, NgIf } from '@angular/common';
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

export interface OnlineStatus {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
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
    MatMenuModule,
    NgFor,
    MatRippleModule,
    RouterLink,
    NgClass,
    NgIf,
    AsyncPipe
  ]
})
export class ToolbarUserDropdownComponent implements OnInit {
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

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'En línea',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600'
    },
    {
      id: 'away',
      label: 'Ausente',
      icon: 'mat:access_time',
      colorClass: 'text-orange-600'
    },
    {
      id: 'dnd',
      label: 'No molestar',
      icon: 'mat:do_not_disturb',
      colorClass: 'text-red-600'
    },
    {
      id: 'offline',
      label: 'Desconectado',
      icon: 'mat:offline_bolt',
      colorClass: 'text-gray-600'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;

  constructor(
    private cd: ChangeDetectorRef,
    private popoverRef: VexPopoverRef<ToolbarUserDropdownComponent>,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {}

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    this.popoverRef.close();
  }

  logout() {
    this.authService.logout();
    this.close();
  }
}
