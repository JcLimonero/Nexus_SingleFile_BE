import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { WizardStateService } from '../../state/wizard-state.service';

interface BbForm {
  backblaze_endpoint?: string;
  backblaze_bucket_id?: string;
  backblaze_bucket_name?: string;
  backblaze_key_id?: string;
  backblaze_application_key?: string;
}
interface OaForm {
  nexfile_base_url?: string;
  nexfile_provider_token?: string;
}

@Component({
  selector: 'wiz-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatExpansionModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Integraciones (opcional)</h2>
        <p>
          Estos valores se guardan cifrados en <code>tenant_config</code> de la central DB.
          Puedes dejarlos vacíos ahora y llenarlos después en /configuracion/integraciones.
        </p>

        <mat-accordion multi>
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>Backblaze B2 (storage de documentos)</mat-panel-title>
            </mat-expansion-panel-header>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Endpoint</mat-label>
              <input matInput [(ngModel)]="bb.backblaze_endpoint" placeholder="https://s3.us-west-002.backblazeb2.com" />
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Bucket ID</mat-label>
              <input matInput [(ngModel)]="bb.backblaze_bucket_id" />
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Bucket Name</mat-label>
              <input matInput [(ngModel)]="bb.backblaze_bucket_name" />
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Key ID</mat-label>
              <input matInput [(ngModel)]="bb.backblaze_key_id" />
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Application Key</mat-label>
              <input matInput type="password" [(ngModel)]="bb.backblaze_application_key" />
            </mat-form-field>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>Orders API (DWH)</mat-panel-title>
            </mat-expansion-panel-header>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Base URL</mat-label>
              <input matInput [(ngModel)]="oa.nexfile_base_url" placeholder="https://app.example.com:8102/" />
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Provider Token</mat-label>
              <input matInput type="password" [(ngModel)]="oa.nexfile_provider_token" />
            </mat-form-field>
          </mat-expansion-panel>
        </mat-accordion>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/branding"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class IntegrationsComponent {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  bb: BbForm = { ...(this.state.integrations().backblaze ?? {}) };
  oa: OaForm = { ...(this.state.integrations().ordersApi ?? {}) };

  next() {
    // Strip empty values to keep config table clean
    const stripEmpty = (o: Record<string, string | undefined>) => {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(o)) {
        if (v !== undefined && v !== null && v !== '') out[k] = v;
      }
      return out;
    };
    this.state.integrations.set({
      backblaze: stripEmpty(this.bb as Record<string, string | undefined>),
      ordersApi: stripEmpty(this.oa as Record<string, string | undefined>),
    });
    this.router.navigate(['/confirm']);
  }
}
