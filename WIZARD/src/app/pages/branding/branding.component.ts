import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-branding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Branding (opcional)</h2>
        <p>El portal del tenant se personaliza con estos datos. Puedes editarlo después en <code>/configuracion/branding</code>.</p>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Nombre de la app</mat-label>
          <input matInput [(ngModel)]="b.appName" placeholder="NexFile Volkswagen" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Color primario (hex)</mat-label>
          <input matInput [(ngModel)]="b.primaryColor" placeholder="#1976d2" />
        </mat-form-field>
        <p style="color:#888; font-size: 13px;">
          (Logo: subir un archivo desde acá requiere el file-picker IPC, que se conecta en una iteración posterior.
          Por ahora puedes subir el logo manualmente vía /configuracion/branding luego del setup.)
        </p>
        <div class="wiz-step-actions">
          <a mat-button routerLink="/admin-user"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class BrandingComponent {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  b = { ...this.state.branding() };
  next() { this.state.branding.set({ ...this.b }); this.router.navigate(['/integrations']); }
}
