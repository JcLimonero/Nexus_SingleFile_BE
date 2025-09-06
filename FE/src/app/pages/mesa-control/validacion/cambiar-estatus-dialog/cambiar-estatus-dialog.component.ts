import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface CambiarEstatusData {
  cliente: any;
}

export interface CambiarEstatusResult {
  nuevoEstatus: string;
  nuevoIdCurrentState: number;
}

@Component({
  selector: 'app-cambiar-estatus-dialog',
  templateUrl: './cambiar-estatus-dialog.component.html',
  styleUrls: ['./cambiar-estatus-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class CambiarEstatusDialogComponent implements OnInit {
  fasesDisponibles = [
    { nombre: 'Integración', id: 1 },
    { nombre: 'Liberación', id: 4 },
    { nombre: 'Liquidación', id: 7 }
  ];
  
  faseSeleccionada: number | null = null;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CambiarEstatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CambiarEstatusData,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Establecer la fase actual como seleccionada por defecto
    this.faseSeleccionada = parseInt(this.data.cliente.IdCurrentState);
  }

  /**
   * Obtener el ID del estado actual como número
   */
  get estadoActualId(): number {
    return parseInt(this.data.cliente.IdCurrentState);
  }

  /**
   * Obtener el nombre de la fase seleccionada
   */
  get nombreFaseSeleccionada(): string {
    if (!this.faseSeleccionada) {
      return 'No seleccionada';
    }
    const fase = this.fasesDisponibles.find(f => f.id === this.faseSeleccionada);
    return fase ? fase.nombre : 'No seleccionada';
  }

  /**
   * Verificar si el formulario es válido para habilitar el botón
   */
  get isFormValid(): boolean {
    return this.faseSeleccionada !== null && 
           this.faseSeleccionada !== undefined &&
           this.faseSeleccionada !== this.estadoActualId;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onConfirmar(): void {
    if (!this.faseSeleccionada) {
      this.snackBar.open('Por favor selecciona una fase', 'Error', { duration: 3000 });
      return;
    }

    if (this.faseSeleccionada === this.estadoActualId) {
      this.snackBar.open('Debes seleccionar una fase diferente a la actual', 'Error', { duration: 3000 });
      return;
    }

    this.loading = true;

    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      
      const faseSeleccionadaObj = this.fasesDisponibles.find(f => f.id === this.faseSeleccionada);
      
      this.dialogRef.close({
        nuevoEstatus: faseSeleccionadaObj?.nombre || '',
        nuevoIdCurrentState: this.faseSeleccionada
      });
    }, 1000);
  }
}
