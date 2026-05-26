import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WizardStateService } from '../../state/wizard-state.service';

const CATALOGS = [
  { id: 'process', label: 'Líneas de negocio' },
  { id: 'customer_type', label: 'Tipos de cliente' },
  { id: 'operation_type', label: 'Tipos de operación' },
  { id: 'payment_method', label: 'Métodos de pago' },
  { id: 'document_type', label: 'Tipos de documento' },
  { id: 'expedient_reason', label: 'Motivos de rechazo' },
  { id: 'document_error', label: 'Errores de documento' },
  { id: 'expedient_exception_reason', label: 'Motivos de excepción' },
];

@Component({
  selector: 'wiz-catalogs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatCheckboxModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Catálogos base</h2>
        <p>
          Carga los catálogos por default (extraídos de la DB de referencia) y
          deselecciona los que no apliquen para este tenant.
        </p>

        <button mat-stroked-button (click)="loadAllDefaults()" [disabled]="loading()" style="margin-bottom: 16px;">
          <mat-icon>cloud_download</mat-icon> Cargar todos los defaults
        </button>

        <mat-tab-group>
          @for (cat of catalogs; track cat.id) {
            <mat-tab [label]="cat.label + ' (' + (countFor(cat.id)) + ')'">
              <div style="padding: 16px 0;">
                @if (!rowsFor(cat.id).length) {
                  <p style="color:#888;">No se han cargado defaults para esta tabla.</p>
                } @else {
                  <div style="max-height: 280px; overflow:auto; border: 1px solid #eee; border-radius: 4px;">
                    <table style="width:100%; border-collapse: collapse;">
                      <thead style="background:#f5f5f5;">
                        <tr>
                          <th style="text-align:left; padding:6px 12px;">Incluir</th>
                          <th style="text-align:left; padding:6px 12px;">id</th>
                          <th style="text-align:left; padding:6px 12px;">name / description</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (r of rowsFor(cat.id); track $index) {
                          <tr style="border-top: 1px solid #f0f0f0;">
                            <td style="padding:4px 12px;">
                              <mat-checkbox [(ngModel)]="r.__include" (change)="touch(cat.id)"></mat-checkbox>
                            </td>
                            <td style="padding:4px 12px; font-family: monospace; color:#666;">{{ r.id }}</td>
                            <td style="padding:4px 12px;">{{ r.name ?? r.description ?? '—' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </mat-tab>
          }
        </mat-tab-group>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/phases"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class CatalogsComponent implements OnInit {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  catalogs = CATALOGS;
  loading = signal(false);
  rows = signal<Record<string, any[]>>({});

  ngOnInit() {
    // Pre-load anything already in state, otherwise load all defaults
    const existing = this.state.catalogSeeds();
    if (Object.keys(existing).length) {
      const withFlag: Record<string, any[]> = {};
      for (const [k, v] of Object.entries(existing)) {
        withFlag[k] = v.map((r) => ({ ...r, __include: true }));
      }
      this.rows.set(withFlag);
    } else {
      this.loadAllDefaults();
    }
  }

  async loadAllDefaults() {
    if (!window.wizardApi) return;
    this.loading.set(true);
    const out: Record<string, any[]> = {};
    for (const c of this.catalogs) {
      const r = await window.wizardApi.defaults.load(c.id);
      out[c.id] = r.ok && r.rows ? r.rows.map((row: any) => ({ ...row, __include: true })) : [];
    }
    this.rows.set(out);
    this.loading.set(false);
  }

  touch(_id: string) { /* signal already updates via ngModel mutation */ }

  rowsFor(id: string): any[] {
    return this.rows()[id] ?? [];
  }
  countFor(id: string): number {
    return this.rowsFor(id).length;
  }

  next() {
    // Strip the __include flag and filter to selected rows only
    const out: Record<string, any[]> = {};
    for (const c of this.catalogs) {
      const arr = this.rowsFor(c.id);
      out[c.id] = arr.filter((r) => r.__include).map(({ __include: _x, ...rest }) => rest);
    }
    this.state.catalogSeeds.set(out);
    this.router.navigate(['/admin-user']);
  }
}
