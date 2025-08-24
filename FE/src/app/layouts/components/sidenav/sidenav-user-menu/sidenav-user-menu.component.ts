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
    this.authService.logout();
    this.close();
  }
}
