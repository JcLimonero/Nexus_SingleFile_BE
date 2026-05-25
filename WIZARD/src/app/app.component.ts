import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface StepDef { route: string; label: string }

@Component({
  selector: 'wiz-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatIconModule],
  template: `
    <div class="wiz-shell">
      <mat-toolbar color="primary">
        <mat-icon style="margin-right: 12px">settings</mat-icon>
        <span>NexFile Wizard</span>
        <span style="flex: 1"></span>
        <span style="font-size: 14px; opacity: 0.8" *ngIf="currentLabel()">
          Paso: {{ currentLabel() }}
        </span>
      </mat-toolbar>

      <nav class="wiz-stepper" *ngIf="showStepper">
        <div style="display:flex; gap:6px; padding: 8px 16px; overflow-x:auto; font-size: 13px;">
          <a *ngFor="let s of steps; let i = index"
             [routerLink]="['/', s.route]"
             style="text-decoration:none; color:inherit; padding: 6px 10px; border-radius: 4px; white-space: nowrap;"
             [style.background]="currentRoute === s.route ? '#e0e0ff' : 'transparent'">
            <span style="font-size: 11px; opacity: 0.65">{{ i + 1 }}.</span>
            <span style="margin-left: 4px;">{{ s.label }}</span>
          </a>
        </div>
      </nav>

      <main class="wiz-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  showStepper = true;
  currentRoute = 'welcome';

  steps: StepDef[] = [
    { route: 'welcome',       label: 'Bienvenida' },
    { route: 'central-db',    label: 'Central DB' },
    { route: 'admin-login',   label: 'Super-admin' },
    { route: 'tenant-info',   label: 'Tenant' },
    { route: 'schema',        label: 'Schema' },
    { route: 'client-group',  label: 'Grupo' },
    { route: 'companies',     label: 'Razones Soc.' },
    { route: 'agencies',      label: 'Agencias' },
    { route: 'processes',     label: 'Procesos' },
    { route: 'catalogs',      label: 'Catálogos' },
    { route: 'admin-user',    label: 'Admin' },
    { route: 'branding',      label: 'Branding' },
    { route: 'integrations',  label: 'Integraciones' },
    { route: 'confirm',       label: 'Confirmar' },
    { route: 'done',          label: 'Listo' },
  ];

  constructor(router: Router) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = (e.urlAfterRedirects as string).replace(/^#?\/?/, '');
      this.currentRoute = url || 'welcome';
    });
  }

  currentLabel(): string {
    return this.steps.find((s) => s.route === this.currentRoute)?.label ?? '';
  }
}
