import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileExtraordinaryReasonService, FileExtraordinaryReason } from '../../../../core/services/file-extraordinary-reason.service';

export interface ExcepcionPedidoData {
  cliente: any;
}

export interface ExcepcionPedidoResult {
  motivoId: number;
  comentario: string;
}

@Component({
  selector: 'app-excepcion-pedido-dialog',
  templateUrl: './excepcion-pedido-dialog.component.html',
  styleUrls: ['./excepcion-pedido-dialog.component.scss'],
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
export class ExcepcionPedidoDialogComponent implements OnInit {
  motivos: FileExtraordinaryReason[] = [];
  motivoSeleccionado: number | null = null;
  comentario: string = '';
  loading = false;
  loadingMotivos = true;

  constructor(
    public dialogRef: MatDialogRef<ExcepcionPedidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExcepcionPedidoData,
    private fileExtraordinaryReasonService: FileExtraordinaryReasonService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarMotivos();
  }

  cargarMotivos(): void {
    this.loadingMotivos = true;
    
    // Cargar motivos extraordinarios con IdTypeReason = 1 (motivos de excepción)
    this.fileExtraordinaryReasonService.getFileExtraordinaryReasons({ 
      id_type_reason: 1,
      limit: 1000 // Obtener todos los motivos de excepción
    }).subscribe({
      next: (response) => {
        this.motivos = response.data.file_extraordinary_reasons;
        this.loadingMotivos = false;
        console.log('Motivos extraordinarios de excepción cargados:', this.motivos);
      },
      error: (error) => {
        console.error('Error cargando motivos extraordinarios de excepción:', error);
        this.snackBar.open('Error al cargar los motivos de excepción', 'Error', { duration: 3000 });
        this.loadingMotivos = false;
      }
    });
  }

  /**
   * Verificar si el formulario es válido para habilitar el botón
   */
  get isFormValid(): boolean {
    return this.motivoSeleccionado !== null && 
           this.motivoSeleccionado !== undefined && 
           this.comentario.trim().length > 0;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onConfirmar(): void {
    if (!this.motivoSeleccionado) {
      this.snackBar.open('Por favor selecciona un motivo', 'Error', { duration: 3000 });
      return;
    }

    if (!this.comentario.trim()) {
      this.snackBar.open('Por favor escribe un comentario', 'Error', { duration: 3000 });
      return;
    }

    this.loading = true;

    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close({
        motivoId: this.motivoSeleccionado,
        comentario: this.comentario.trim()
      });
    }, 1000);
  }
}
