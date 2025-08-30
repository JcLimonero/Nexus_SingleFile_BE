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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FileExtraordinaryReason, FileExtraordinaryReasonService } from '../../../../core/services/file-extraordinary-reason.service';

export interface MotivoExtraordinarioEditData {
  motivo?: FileExtraordinaryReason;
  isEdit: boolean;
}

@Component({
  selector: 'app-motivo-extraordinario-edit-dialog',
  templateUrl: './motivo-extraordinario-edit-dialog.component.html',
  styleUrls: ['./motivo-extraordinario-edit-dialog.component.scss'],
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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MotivoExtraordinarioEditDialogComponent implements OnInit {
  motivo: Partial<FileExtraordinaryReason> = {};
  isEdit: boolean = false;
  loading = false;

  tipoRazonOptions = [
    { value: 2, label: 'Excepción' },
    { value: 1, label: 'Cancelación' }
  ];

  constructor(
    public dialogRef: MatDialogRef<MotivoExtraordinarioEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MotivoExtraordinarioEditData,
    private fileExtraordinaryReasonService: FileExtraordinaryReasonService,
    private snackBar: MatSnackBar
  ) {
    this.isEdit = data.isEdit;
    
    if (data.motivo) {
      this.motivo = {
        ...data.motivo,
        // Asegurar que los valores numéricos sean del tipo correcto
        IdTypeReason: Number(data.motivo.IdTypeReason),
        Enabled: Number(data.motivo.Enabled),
        // Formatear nombre existente
        Name: this.formatName(data.motivo.Name || '')
      };
    }
  }

  ngOnInit(): void {
    if (!this.isEdit) {
      this.motivo = {
        Name: '',
        IdTypeReason: 2,
        Enabled: 1
      };
    }
  }

  saveMotivo(): void {
    if (!this.motivo.Name || !this.motivo.Name.trim()) {
      this.snackBar.open('El nombre del motivo es requerido', 'Error', { duration: 3000 });
      return;
    }
    
    // Convertir nombre a formato de mayúsculas y minúsculas
    this.motivo.Name = this.formatName(this.motivo.Name.trim());

    this.loading = true;

    if (this.isEdit) {
      this.fileExtraordinaryReasonService.updateFileExtraordinaryReason(this.motivo.Id!, this.motivo).subscribe({
        next: (response) => {
          this.snackBar.open('Motivo extraordinario actualizado exitosamente', 'Éxito', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error actualizando motivo extraordinario:', error);
          
          // Obtener mensaje de error más descriptivo
          let errorMessage = 'Error al actualizar el motivo extraordinario';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          // Mostrar mensaje de error completo
          this.snackBar.open(errorMessage, 'Error', { duration: 5000 });
          
          // Log adicional para debug
          if (error.error && error.error.debug_info) {
            console.log('Debug info del error:', error.error.debug_info);
          }
          
          this.loading = false;
        }
      });
    } else {
      this.fileExtraordinaryReasonService.createFileExtraordinaryReason(this.motivo).subscribe({
        next: (response) => {
          this.snackBar.open('Motivo extraordinario creado exitosamente', 'Éxito', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creando motivo extraordinario:', error);
          
          // Obtener mensaje de error más descriptivo
          let errorMessage = 'Error al crear el motivo extraordinario';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          // Mostrar mensaje de error completo
          this.snackBar.open(errorMessage, 'Error', { duration: 5000 });
          
          // Log adicional para debug
          if (error.error && error.error.debug_info) {
            console.log('Debug info del error:', error.error.debug_info);
          }
          
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
  
  /**
   * Formatear nombre a mayúsculas y minúsculas
   * Ejemplo: "hola mundo" -> "Hola Mundo"
   */
  private formatName(name: string): string {
    if (!name) return name;
    
    // Dividir por espacios y convertir cada palabra
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
