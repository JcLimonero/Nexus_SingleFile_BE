import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Agencia, AgenciaUpdateRequest } from '../../../../../core/interfaces/agencia.interface';
import { AgenciaService } from '../../../../../core/services/agencia.service';

export interface AgenciaEditDialogData {
  agencia: Agencia;
  mode: 'edit' | 'create';
}

@Component({
  selector: 'app-agencia-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6 min-w-[500px]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ data.mode === 'edit' ? 'Editar Agencia' : 'Nueva Agencia' }}
        </h2>
        <button mat-icon-button (click)="onCancel()" matTooltip="Cerrar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Formulario -->
      <form [formGroup]="agenciaForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Nombre -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre de la Agencia</mat-label>
          <input 
            matInput 
            formControlName="Name" 
            placeholder="Ej: HONDA GALERIAS"
            maxlength="100">
          <mat-hint>Nombre completo de la agencia</mat-hint>
          <mat-error *ngIf="agenciaForm.get('Name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
          <mat-error *ngIf="agenciaForm.get('Name')?.hasError('minlength')">
            El nombre debe tener al menos 3 caracteres
          </mat-error>
        </mat-form-field>

        <!-- Código de Agencia -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nd de Agencia</mat-label>
          <input 
            matInput 
            formControlName="IdAgency" 
            placeholder="Ej: 10017"
            maxlength="20">
          <mat-hint>Código único de identificación</mat-hint>
          <mat-error *ngIf="agenciaForm.get('IdAgency')?.hasError('required')">
            El código es requerido
          </mat-error>
          <mat-error *ngIf="agenciaForm.get('IdAgency')?.hasError('minlength')">
            El código debe tener al menos 1 carácter
          </mat-error>
        </mat-form-field>



        <!-- Estado -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="Enabled">
            <mat-option value="1">Activo</mat-option>
            <mat-option value="0">Inactivo</mat-option>
          </mat-select>
          <mat-hint>Estado actual de la agencia</mat-hint>
        </mat-form-field>

        <!-- Información adicional (solo lectura en modo edición) -->
        <div *ngIf="data.mode === 'edit'" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Información del Sistema</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">ID:</span>
              <span class="ml-2 font-mono">{{ data.agencia.Id }}</span>
            </div>
            <div>
              <span class="text-gray-500">Último Usuario:</span>
              <span class="ml-2">{{ data.agencia.IdLastUserUpdate || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-gray-500">Fecha Registro:</span>
              <span class="ml-2">{{ data.agencia.RegistrationDate || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-gray-500">Última Actualización:</span>
              <span class="ml-2">{{ data.agencia.UpdateDate || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button" 
            mat-button 
            (click)="onCancel()"
            [disabled]="loading">
            Cancelar
          </button>
          <button 
            type="submit" 
            mat-raised-button 
            color="primary"
            [disabled]="agenciaForm.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20" class="mr-2"></mat-spinner>
            <mat-icon *ngIf="!loading">{{ data.mode === 'edit' ? 'save' : 'add' }}</mat-icon>
            {{ data.mode === 'edit' ? 'Guardar Cambios' : 'Crear Agencia' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class AgenciaEditDialogComponent implements OnInit {
  agenciaForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private agenciaService: AgenciaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AgenciaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgenciaEditDialogData
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.agenciaForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3)]],
      IdAgency: ['', [Validators.required, Validators.minLength(1)]],
      Enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.agencia) {
      this.agenciaForm.patchValue({
        Name: this.data.agencia.Name,
        IdAgency: this.data.agencia.IdAgency,
        Enabled: this.data.agencia.Enabled
      });
    }
  }

  onSubmit(): void {
    if (this.agenciaForm.valid) {
      this.loading = true;
      
      if (this.data.mode === 'edit') {
        this.updateAgencia();
      } else {
        this.createAgencia();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private updateAgencia(): void {
    const updateData: AgenciaUpdateRequest = {
      Id: this.data.agencia.Id,
      ...this.agenciaForm.value
    };

    this.agenciaService.updateAgencia(updateData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Agencia actualizada exitosamente', 'Éxito', {
            duration: 3000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar agencia', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating agencia:', error);
        this.snackBar.open('Error de conexión al actualizar agencia', 'Error', {
          duration: 3000
        });
      }
    });
  }

  private createAgencia(): void {
    const createData = this.agenciaForm.value;

    this.agenciaService.createAgencia(createData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Agencia creada exitosamente', 'Éxito', {
            duration: 3000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear agencia', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating agencia:', error);
        this.snackBar.open('Error de conexión al crear agencia', 'Error', {
          duration: 3000
        });
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.agenciaForm.controls).forEach(key => {
      const control = this.agenciaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
