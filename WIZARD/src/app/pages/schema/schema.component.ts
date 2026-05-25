import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WizardStateService } from '../../state/wizard-state.service';

interface Step { label: string; status: 'pending' | 'running' | 'done' | 'error'; detail?: string }

@Component({
  selector: 'wiz-schema',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Crear DB del tenant + esquema base</h2>
        <p>
          Crea <code>{{ state.tenantDb().database }}</code> en
          <code>{{ state.tenantDb().host }}:{{ state.tenantDb().port }}</code> y
          aplica las migraciones esenciales (client_group, junctions).
        </p>
        @if (running()) { <mat-progress-bar mode="indeterminate" style="margin: 16px 0;"></mat-progress-bar> }

        <ul style="list-style:none; padding:0;">
          @for (s of steps(); track s.label) {
            <li style="padding:8px 0; display:flex; align-items:center; gap:12px;">
              @switch (s.status) {
                @case ('pending') { <mat-icon style="color:#999;">radio_button_unchecked</mat-icon> }
                @case ('running') { <mat-icon style="color:#1976d2;" class="rotate">sync</mat-icon> }
                @case ('done')    { <mat-icon style="color:#2e7d32;">check_circle</mat-icon> }
                @case ('error')   { <mat-icon style="color:#c62828;">error</mat-icon> }
              }
              <span>{{ s.label }}</span>
              @if (s.detail) { <span style="color:#666; font-size:12px;">— {{ s.detail }}</span> }
            </li>
          }
        </ul>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/tenant-info"><mat-icon>arrow_back</mat-icon> Atrás</a>
          @if (!schemaDone()) {
            <button mat-flat-button color="primary" (click)="run()" [disabled]="running()">
              <mat-icon>play_arrow</mat-icon> Ejecutar
            </button>
          } @else {
            <button mat-flat-button color="primary" (click)="next()">
              Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
            </button>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.rotate { animation: rotate 1.2s linear infinite; } @keyframes rotate { to { transform: rotate(360deg); } }`],
})
export class SchemaComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);

  readonly running = signal(false);
  readonly schemaDone = signal(this.state.schemaReady());
  readonly steps = signal<Step[]>([
    { label: 'Crear base de datos del tenant', status: 'pending' },
    { label: 'Aplicar migraciones del esquema', status: 'pending' },
  ]);

  private patch(idx: number, p: Partial<Step>) {
    this.steps.update((s) => s.map((st, i) => (i === idx ? { ...st, ...p } : st)));
  }

  async run() {
    if (!window.wizardApi) {
      this.patch(0, { status: 'error', detail: 'wizardApi no disponible' });
      return;
    }
    this.running.set(true);
    const cfg = this.state.tenantDb();
    this.patch(0, { status: 'running' });
    const r1 = await window.wizardApi.db.createDatabase(cfg, cfg.database || '');
    if (!r1.ok) { this.patch(0, { status: 'error', detail: r1.message }); this.running.set(false); return; }
    this.patch(0, { status: 'done' });

    this.patch(1, { status: 'running' });
    const r2 = await window.wizardApi.db.runMigrations(cfg);
    if (!r2.ok) {
      this.patch(1, { status: 'error', detail: `${r2.failed?.name ?? '?'}: ${r2.failed?.error ?? ''}` });
      this.running.set(false); return;
    }
    this.patch(1, { status: 'done', detail: `${r2.executed} migraciones aplicadas` });
    this.state.schemaReady.set(true);
    this.schemaDone.set(true);
    this.running.set(false);
  }

  next() { this.router.navigate(['/client-group']); }
}
