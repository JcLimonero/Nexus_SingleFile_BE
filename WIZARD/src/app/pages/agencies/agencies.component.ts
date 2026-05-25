import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { WizardStateService, AgencyInput } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-agencies',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatTableModule,
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Agencias</h2>
        <p>Cada agencia pertenece a una razón social. Los usuarios del tenant pertenecen a una agencia.</p>

        <div style="display: grid; grid-template-columns: 1fr 2fr 2fr auto; gap: 12px; align-items: center;">
          <mat-form-field appearance="outline">
            <mat-label>Razón social</mat-label>
            <mat-select [(ngModel)]="draft.companyIndex">
              @for (c of state.companies(); track c.name; let i = $index) {
                <mat-option [value]="i">{{ c.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nombre agencia</mat-label>
            <input matInput [(ngModel)]="draft.name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Dirección (opcional)</mat-label>
            <input matInput [(ngModel)]="draft.address" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="add()" [disabled]="!draft.name || draft.companyIndex === undefined" style="height:40px;">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        @if (items().length) {
          <table mat-table [dataSource]="items()" style="width:100%; margin-top:12px;">
            <ng-container matColumnDef="company">
              <th mat-header-cell *matHeaderCellDef>Razón social</th>
              <td mat-cell *matCellDef="let r">{{ state.companies()[r.companyIndex]?.name }}</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Agencia</th>
              <td mat-cell *matCellDef="let r">{{ r.name }}</td>
            </ng-container>
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Dirección</th>
              <td mat-cell *matCellDef="let r">{{ r.address || '—' }}</td>
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
        }

        <div class="wiz-step-actions">
          <a mat-button routerLink="/companies"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!items().length">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class AgenciesComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  cols = ['company', 'name', 'address', 'del'];
  items = signal<AgencyInput[]>([...this.state.agencies()]);
  draft: AgencyInput = { companyIndex: 0, name: '', address: '' };

  add() {
    this.items.update((it) => [...it, { ...this.draft }]);
    this.draft = { companyIndex: this.draft.companyIndex, name: '', address: '' };
  }
  remove(i: number) { this.items.update((it) => it.filter((_, idx) => idx !== i)); }
  next() { this.state.agencies.set(this.items()); this.router.navigate(['/processes']); }
}
