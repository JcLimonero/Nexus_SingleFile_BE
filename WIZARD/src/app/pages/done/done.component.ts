import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-done',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content style="text-align: center; padding: 32px;">
        <mat-icon style="font-size: 64px; height: 64px; width: 64px; color: #2e7d32;">check_circle</mat-icon>
        <h1>Tenant provisionado</h1>
        <p>
          El tenant <b>{{ state.tenantName() }}</b> (slug <code>{{ state.tenantSlug() }}</code>) está listo.
          ID en central DB: <b>{{ state.provisionResult()?.tenantId ?? '?' }}</b>
        </p>
        <p>Próximos pasos:</p>
        <ol style="text-align: left; max-width: 560px; margin: 0 auto;">
          <li>Apuntar el DNS wildcard <code>*.nexfile.app</code> al servidor del tenant BE.</li>
          <li>Habilitar el feature flag <code>MULTITENANT_ENABLED=true</code> en BE/.env.</li>
          <li>Verificar login en <code>https://{{ state.tenantSlug() }}.nexfile.app</code> con
              <code>{{ state.adminUserDraft().email }}</code>.</li>
          <li>Si configuraste integraciones, validar Backblaze y Orders API desde el portal del tenant.</li>
        </ol>

        <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: center;">
          <button mat-stroked-button (click)="reset()">
            <mat-icon>refresh</mat-icon> Provisionar otro tenant
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class DoneComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  reset() {
    this.state.reset();
    this.router.navigate(['/welcome']);
  }
}
