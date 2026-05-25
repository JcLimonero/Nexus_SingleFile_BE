import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { WizardStateService, CompanyInput } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Razones sociales (companies)</h2>
        <p>Una o más empresas legales bajo el grupo <b>{{ state.clientGroup().name }}</b>.</p>

        <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 12px; align-items: center;">
          <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput [(ngModel)]="draft.name" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>RFC (opcional)</mat-label><input matInput [(ngModel)]="draft.rfc" /></mat-form-field>
          <button mat-flat-button color="primary" (click)="add()" [disabled]="!draft.name" style="height: 40px;">
            <mat-icon>add</mat-icon> Agregar
          </button>
        </div>

        @if (items().length) {
          <table mat-table [dataSource]="items()" style="width:100%; margin-top: 12px;">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let r">{{ r.name }}</td>
            </ng-container>
            <ng-container matColumnDef="rfc">
              <th mat-header-cell *matHeaderCellDef>RFC</th>
              <td mat-cell *matCellDef="let r">{{ r.rfc || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="del">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let r; let i = index">
                <button mat-icon-button (click)="remove(i)"><mat-icon>delete</mat-icon></button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>
        } @else {
          <p style="color:#888; margin-top: 12px;">Aún no agregas ninguna razón social.</p>
        }

        <div class="wiz-step-actions">
          <a mat-button routerLink="/client-group"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!items().length">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class CompaniesComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  cols = ['name', 'rfc', 'del'];
  items = signal<CompanyInput[]>([...this.state.companies()]);
  draft: CompanyInput = { name: '', rfc: '' };

  add() {
    if (!this.draft.name) return;
    this.items.update((it) => [...it, { ...this.draft }]);
    this.draft = { name: '', rfc: '' };
  }
  remove(i: number) { this.items.update((it) => it.filter((_, idx) => idx !== i)); }
  next() { this.state.companies.set(this.items()); this.router.navigate(['/agencies']); }
}
