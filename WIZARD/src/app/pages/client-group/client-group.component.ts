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
  selector: 'wiz-client-group',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Grupo de cliente</h2>
        <p>Entidad raíz de la jerarquía. Una distribuidora o agrupación corporativa.</p>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Nombre del grupo</mat-label>
          <input matInput [(ngModel)]="group.name" placeholder="Volkswagen Group" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea matInput [(ngModel)]="group.description" rows="3"></textarea>
        </mat-form-field>
        <div class="wiz-step-actions">
          <a mat-button routerLink="/schema"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!group.name">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ClientGroupComponent {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  group = { ...this.state.clientGroup() };

  next() {
    this.state.clientGroup.set({ ...this.group });
    this.router.navigate(['/companies']);
  }
}
