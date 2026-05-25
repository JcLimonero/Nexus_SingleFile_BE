import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Tenant,
  TenantConfigEntry,
  TenantService,
  TenantStatus,
  TenantStatusHistory,
  TenantSubscription,
} from '../../core/tenant.service';

@Component({
  selector: 'adm-tenant-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  template: `
    <a mat-button routerLink="/tenants" style="margin-bottom: 16px;">
      <mat-icon>arrow_back</mat-icon> Volver
    </a>

    @if (loading()) {
      <div style="text-align: center; padding: 48px;">
        <mat-spinner diameter="36" style="margin: 0 auto;"></mat-spinner>
      </div>
    } @else if (error()) {
      <mat-card class="adm-card">
        <mat-card-content>
          <div style="color: crimson;">{{ error() }}</div>
        </mat-card-content>
      </mat-card>
    } @else if (tenant()) {
      <mat-card class="adm-card">
        <mat-card-content>
          <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
            <div style="flex: 1; min-width: 240px;">
              <h2 style="margin: 0;">{{ tenant()!.name }}</h2>
              <p style="margin: 4px 0; color: #666;">
                slug <code>{{ tenant()!.slug }}</code> ·
                <span class="adm-status-chip" [class]="'adm-status-chip adm-status-' + tenant()!.status">{{ tenant()!.status }}</span>
              </p>
              <p style="margin: 4px 0; color: #999; font-size: 12px;">
                ID #{{ tenant()!.id }} · creado {{ tenant()!.created_at | date:'short' }}
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              @if (tenant()!.status !== 'active') {
                <button mat-stroked-button color="primary" (click)="changeStatus('active')" [disabled]="saving()">
                  <mat-icon>play_arrow</mat-icon> Reactivar
                </button>
              }
              @if (tenant()!.status === 'active') {
                <button mat-stroked-button (click)="changeStatus('readonly')" [disabled]="saving()">
                  <mat-icon>lock</mat-icon> Solo-lectura
                </button>
              }
              @if (tenant()!.status !== 'suspended' && tenant()!.status !== 'terminated') {
                <button mat-stroked-button color="warn" (click)="changeStatus('suspended')" [disabled]="saving()">
                  <mat-icon>block</mat-icon> Suspender
                </button>
              }
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-tab-group style="margin-top: 24px;" mat-stretch-tabs="false" mat-align-tabs="start">
        <!-- ============================== INFO ============================== -->
        <mat-tab label="Info">
          <mat-card class="adm-card" style="margin-top: 24px;">
            <mat-card-content>
              <h3>Conexión a la DB del tenant</h3>
              <table style="width:100%; border-collapse: collapse;">
                <tr><th style="text-align:left; padding:6px 12px; width:200px;">Host</th><td style="padding:6px 12px;"><code>{{ tenant()!.db_host }}</code></td></tr>
                <tr><th style="text-align:left; padding:6px 12px;">Puerto</th><td style="padding:6px 12px;">{{ tenant()!.db_port }}</td></tr>
                <tr><th style="text-align:left; padding:6px 12px;">DB name</th><td style="padding:6px 12px;"><code>{{ tenant()!.db_name }}</code></td></tr>
                <tr><th style="text-align:left; padding:6px 12px;">Usuario</th><td style="padding:6px 12px;"><code>{{ tenant()!.db_username }}</code></td></tr>
                <tr><th style="text-align:left; padding:6px 12px;">Password</th><td style="padding:6px 12px; color:#999;">cifrado en central DB</td></tr>
                <tr><th style="text-align:left; padding:6px 12px;">Subdomain</th><td style="padding:6px 12px;">
                  <a [href]="'https://' + tenant()!.slug + '.nexfile.app'" target="_blank">{{ tenant()!.slug }}.nexfile.app</a>
                </td></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- ============================ SUBSCRIPTION ============================ -->
        <mat-tab label="Subscription">
          <mat-card class="adm-card" style="margin-top: 24px;">
            <mat-card-content>
              @if (subscription()) {
                <table style="width:100%; border-collapse: collapse;">
                  <tr><th style="text-align:left; padding:6px 12px; width:240px;">Plan</th><td style="padding:6px 12px;">{{ subscription()!.plan }}</td></tr>
                  <tr><th style="text-align:left; padding:6px 12px;">Periodo actual</th><td style="padding:6px 12px;">
                    {{ subscription()!.current_period_start | date:'mediumDate' }}
                    →
                    <b>{{ subscription()!.current_period_end | date:'mediumDate' }}</b>
                  </td></tr>
                  <tr><th style="text-align:left; padding:6px 12px;">Último pago</th><td style="padding:6px 12px;">
                    {{ subscription()!.last_payment_at ? (subscription()!.last_payment_at | date:'mediumDate') : '—' }}
                  </td></tr>
                  <tr><th style="text-align:left; padding:6px 12px;">Próxima facturación</th><td style="padding:6px 12px;">
                    {{ subscription()!.next_billing_at ? (subscription()!.next_billing_at | date:'mediumDate') : '—' }}
                  </td></tr>
                  @if (subscription()!.grace_started_at) {
                    <tr><th style="text-align:left; padding:6px 12px;">Grace inició</th>
                      <td style="padding:6px 12px; color:#ff8f00;">{{ subscription()!.grace_started_at | date:'mediumDate' }}</td>
                    </tr>
                  }
                  @if (subscription()!.readonly_started_at) {
                    <tr><th style="text-align:left; padding:6px 12px;">Readonly inició</th>
                      <td style="padding:6px 12px; color:#e65100;">{{ subscription()!.readonly_started_at | date:'mediumDate' }}</td>
                    </tr>
                  }
                  @if (subscription()!.suspended_at) {
                    <tr><th style="text-align:left; padding:6px 12px;">Suspendido</th>
                      <td style="padding:6px 12px; color:#c62828;">{{ subscription()!.suspended_at | date:'mediumDate' }}</td>
                    </tr>
                  }
                </table>
              } @else {
                <p style="color:#888;">Sin registro de suscripción.</p>
              }

              <h3 style="margin-top: 32px;">Extender periodo</h3>
              <p style="color:#666; font-size:13px;">
                Empuja el <code>current_period_end</code> por N días desde hoy (o desde el end actual,
                lo mayor). Si el tenant está en grace/readonly/suspended, lo regresa a <b>active</b>.
              </p>
              <div style="display: flex; gap: 12px; align-items: center;">
                <mat-form-field appearance="outline" style="width: 160px;">
                  <mat-label>Días</mat-label>
                  <mat-select [(ngModel)]="extendDays">
                    <mat-option [value]="30">30 días</mat-option>
                    <mat-option [value]="90">90 días</mat-option>
                    <mat-option [value]="180">180 días</mat-option>
                    <mat-option [value]="365">365 días</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-flat-button color="primary" (click)="extend()" [disabled]="saving()">
                  <mat-icon>schedule</mat-icon> Extender
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- =============================== CONFIG =============================== -->
        <mat-tab [label]="'Config (' + config().length + ')'">
          <mat-card class="adm-card" style="margin-top: 24px;">
            <mat-card-content>
              <p style="color:#666; font-size:13px; margin-top: 0;">
                Pares clave/valor en <code>tenant_config</code> de la central DB.
                Los marcados <mat-icon style="font-size:14px; height:14px; width:14px; vertical-align:middle;">lock</mat-icon>
                son <b>sensitive</b> (Backblaze keys, API secrets) — el valor no se envía al cliente.
              </p>

              <table mat-table [dataSource]="config()" style="width:100%;">
                <ng-container matColumnDef="key">
                  <th mat-header-cell *matHeaderCellDef>Key</th>
                  <td mat-cell *matCellDef="let r">
                    @if (r.sensitive === 1) { <mat-icon style="font-size:14px; height:14px; width:14px; vertical-align:middle; color:#999;">lock</mat-icon> }
                    <code>{{ r.config_key }}</code>
                  </td>
                </ng-container>
                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Categoría</th>
                  <td mat-cell *matCellDef="let r" style="font-size:12px; color:#999;">{{ r.category || '—' }}</td>
                </ng-container>
                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef>Valor</th>
                  <td mat-cell *matCellDef="let r">
                    <mat-form-field appearance="outline" subscriptSizing="dynamic" style="width: 100%;">
                      <input matInput [(ngModel)]="r.config_value"
                             [type]="r.sensitive === 1 ? 'password' : 'text'"
                             [placeholder]="r._has_value ? 'sin cambios' : 'vacío'" />
                    </mat-form-field>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="cfgCols"></tr>
                <tr mat-row *matRowDef="let row; columns: cfgCols"></tr>
              </table>

              @if (!config().length) {
                <p style="color:#999; padding: 24px; text-align: center;">Sin entradas de configuración.</p>
              }

              <div style="display:flex; gap:12px; margin-top: 16px;">
                <button mat-flat-button color="primary" (click)="saveConfig()" [disabled]="saving() || !config().length">
                  <mat-icon>save</mat-icon> Guardar cambios
                </button>
                <span style="color:#999; font-size:12px; align-self:center;">
                  Los valores sensitive con texto <code>••••••••</code> se preservan al guardar.
                </span>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- =========================== STATUS HISTORY ============================ -->
        <mat-tab [label]="'Status History (' + history().length + ')'">
          <mat-card class="adm-card" style="margin-top: 24px;">
            <mat-card-content>
              @if (!history().length) {
                <p style="color:#999;">Sin cambios de estado registrados.</p>
              } @else {
                <table mat-table [dataSource]="history()" style="width:100%;">
                  <ng-container matColumnDef="when">
                    <th mat-header-cell *matHeaderCellDef>Cuándo</th>
                    <td mat-cell *matCellDef="let r">{{ r.changed_at | date:'medium' }}</td>
                  </ng-container>
                  <ng-container matColumnDef="from">
                    <th mat-header-cell *matHeaderCellDef>De</th>
                    <td mat-cell *matCellDef="let r">
                      @if (r.status_from) {
                        <span class="adm-status-chip" [class]="'adm-status-chip adm-status-' + r.status_from">{{ r.status_from }}</span>
                      } @else { <span style="color:#999;">—</span> }
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="arrow">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let r" style="color:#999;"><mat-icon>arrow_forward</mat-icon></td>
                  </ng-container>
                  <ng-container matColumnDef="to">
                    <th mat-header-cell *matHeaderCellDef>A</th>
                    <td mat-cell *matCellDef="let r">
                      <span class="adm-status-chip" [class]="'adm-status-chip adm-status-' + r.status_to">{{ r.status_to }}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="who">
                    <th mat-header-cell *matHeaderCellDef>Quién</th>
                    <td mat-cell *matCellDef="let r" style="color:#666;">
                      {{ r.changed_by_super_admin ? ('super-admin #' + r.changed_by_super_admin) : 'cron' }}
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="reason">
                    <th mat-header-cell *matHeaderCellDef>Razón</th>
                    <td mat-cell *matCellDef="let r" style="color:#666; font-size:13px;">{{ r.reason || '—' }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="histCols"></tr>
                  <tr mat-row *matRowDef="let row; columns: histCols"></tr>
                </table>
              }
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    }
  `,
})
export class TenantDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc = inject(TenantService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly tenant = signal<Tenant | null>(null);
  readonly subscription = signal<TenantSubscription | null>(null);
  readonly config = signal<TenantConfigEntry[]>([]);
  readonly history = signal<TenantStatusHistory[]>([]);

  readonly cfgCols = ['key', 'category', 'value'];
  readonly histCols = ['when', 'from', 'arrow', 'to', 'who', 'reason'];

  extendDays = 30;

  ngOnInit() {
    this.load();
  }

  private load() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!id || isNaN(id)) {
      this.error.set('ID de tenant inválido en la URL');
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.svc.get(id).subscribe({
      next: (r) => {
        this.loading.set(false);
        if (!r.success || !r.data) {
          this.error.set('Tenant no encontrado');
          return;
        }
        this.tenant.set(r.data.tenant);
        this.subscription.set(r.data.subscription);
        this.config.set(r.data.config ?? []);
        this.history.set(r.data.status_history ?? []);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Error al cargar tenant');
      },
    });
  }

  changeStatus(status: TenantStatus) {
    const t = this.tenant();
    if (!t) return;
    const reason = prompt(`Razón para mover ${t.slug} a ${status} (opcional):`) ?? undefined;
    this.saving.set(true);
    this.svc.setStatus(t.id, status, reason).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackbar.open(`Estado actualizado a ${status}`, 'OK', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'Error', 'OK', { duration: 5000 });
      },
    });
  }

  saveConfig() {
    const t = this.tenant();
    if (!t) return;
    this.saving.set(true);
    const entries = this.config().map((c) => ({
      config_key: c.config_key,
      config_value: c.config_value,
      category: c.category,
      sensitive: c.sensitive,
    }));
    this.svc.setConfig(t.id, entries).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackbar.open('Configuración guardada', 'OK', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'Error', 'OK', { duration: 5000 });
      },
    });
  }

  extend() {
    const t = this.tenant();
    if (!t) return;
    this.saving.set(true);
    this.svc.extendSubscription(t.id, this.extendDays).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.snackbar.open(`Extendido ${this.extendDays} días — nuevo end: ${r.data?.new_period_end}`, 'OK', { duration: 4000 });
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'Error', 'OK', { duration: 5000 });
      },
    });
  }
}
