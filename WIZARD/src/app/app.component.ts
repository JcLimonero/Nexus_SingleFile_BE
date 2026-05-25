import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface StepDef {
  route: string;
  label: string;
}

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
        <span style="font-size: 14px; opacity: 0.8" *ngIf="currentLabel()">Paso: {{ currentLabel() }}</span>
      </mat-toolbar>

      <nav class="wiz-stepper" *ngIf="showStepper">
        <div style="display:flex; gap:8px; padding: 8px 16px; overflow-x:auto;">
          <a *ngFor="let s of steps; let i = index"
             [routerLink]="['/', s.route]"
             style="text-decoration:none; color:inherit; padding: 8px 12px; border-radius: 4px;"
             [style.background]="currentRoute === s.route ? '#e0e0ff' : 'transparent'">
            <span style="font-size: 12px; opacity: 0.7">{{ i + 1 }}.</span>
            <span style="margin-left: 4px;">{{ s.label }}</span>
          </a>
        </div>
      </nav>

      <main class="wiz-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  showStepper = true;
  currentRoute = 'welcome';

  steps: StepDef[] = [
    { route: 'welcome', label: 'Bienvenida' },
    { route: 'db-connection', label: 'Conexión DB' },
    { route: 'schema', label: 'Schema' },
    { route: 'placeholder/grupo', label: 'Grupo' },
    { route: 'placeholder/companies', label: 'Razones Sociales' },
    { route: 'placeholder/agencies', label: 'Agencias' },
    { route: 'placeholder/processes', label: 'Procesos' },
    { route: 'placeholder/catalogs', label: 'Catálogos' },
    { route: 'placeholder/admin', label: 'Admin' },
    { route: 'placeholder/branding', label: 'Branding' },
    { route: 'placeholder/integrations', label: 'Integraciones' },
    { route: 'placeholder/confirm', label: 'Confirmar' },
    { route: 'placeholder/done', label: 'Listo' }
  ];

  constructor(router: Router) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = (e.urlAfterRedirects as string).replace(/^#?\/?/, '');
      this.currentRoute = url || 'welcome';
    });
  }

  currentLabel(): string {
    return this.steps.find((s) => s.route === this.currentRoute)?.label || '';
  }
}
