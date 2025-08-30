import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FileReason, FileReasonService } from '../../../../core/services/file-reason.service';

export interface MotivoEditData {
  motivo?: FileReason;
  isEdit: boolean;
}

@Component({
  selector: 'app-motivo-edit-dialog',
  templateUrl: './motivo-edit-dialog.component.html',
  styleUrls: ['./motivo-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class MotivoEditDialogComponent implements OnInit {
  motivo: Partial<FileReason> = {};
  isEdit: boolean = false;
  loading = false;

  // Opciones para el tipo de razón
  tipoRazonOptions = [
    { value: 4, label: 'Aprobación' },
    { value: 5, label: 'Rechazo' }
  ];

  constructor(
    public dialogRef: MatDialogRef<MotivoEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MotivoEditData,
    private fileReasonService: FileReasonService,
    private snackBar: MatSnackBar
  ) {
    this.isEdit = data.isEdit;
    
    // Debug: verificar datos recibidos
    console.log('MotivoEditDialog - constructor data:', data);
    
    if (data.motivo) {
      this.motivo = { 
        ...data.motivo,
        // Asegurar que los valores numéricos sean del tipo correcto
        IdTypeReason: Number(data.motivo.IdTypeReason),
        Enabled: Number(data.motivo.Enabled)
      };
      
      // Debug: verificar valores convertidos
      console.log('MotivoEditDialog - valores convertidos:', {
        original: data.motivo,
        converted: this.motivo
      });
    }
  }

  ngOnInit(): void {
    // Si es creación, establecer valores por defecto
    if (!this.isEdit) {
      this.motivo = {
        Name: '',
        IdTypeReason: 5, // Por defecto Rechazo
        Enabled: 1
      };
    }
    
    // Debug: verificar valores asignados
    console.log('MotivoEditDialog - ngOnInit:', {
      isEdit: this.isEdit,
      motivo: this.motivo,
      IdTypeReason: this.motivo.IdTypeReason,
      Enabled: this.motivo.Enabled,
      IdTypeReasonType: typeof this.motivo.IdTypeReason,
      EnabledType: typeof this.motivo.Enabled
    });
  }

  /**
   * Guardar o actualizar el motivo
   */
  saveMotivo(): void {
    if (!this.motivo.Name || !this.motivo.Name.trim()) {
      this.snackBar.open('El nombre del motivo es requerido', 'Error', { duration: 3000 });
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      // Actualizar motivo existente
      this.fileReasonService.updateFileReason(this.motivo.Id!, this.motivo).subscribe({
        next: (response) => {
          console.log('Respuesta de actualización:', response);
          this.snackBar.open('Motivo actualizado exitosamente', 'Éxito', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error actualizando motivo:', error);
          this.snackBar.open('Error al actualizar el motivo', 'Error', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // Crear nuevo motivo
      this.fileReasonService.createFileReason(this.motivo).subscribe({
        next: (response) => {
          this.snackBar.open('Motivo creado exitosamente', 'Éxito', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creando motivo:', error);
          this.snackBar.open('Error al crear el motivo', 'Error', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Cancelar la operación
   */
  cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Obtener el título del diálogo
   */
  getDialogTitle(): string {
    return this.isEdit ? 'Editar Motivo' : 'Nuevo Motivo';
  }

  /**
   * Obtener el texto del botón de guardar
   */
  getSaveButtonText(): string {
    return this.isEdit ? 'Actualizar' : 'Crear';
  }
}
