import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface EliminarPedidoData {
  cliente: any;
}

export interface EliminarPedidoResult {
  confirmado: boolean;
}

@Component({
  selector: 'app-eliminar-pedido-dialog',
  templateUrl: './eliminar-pedido-dialog.component.html',
  styleUrls: ['./eliminar-pedido-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class EliminarPedidoDialogComponent {
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<EliminarPedidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EliminarPedidoData,
    private snackBar: MatSnackBar
  ) {}

  onCancelar(): void {
    this.dialogRef.close({ confirmado: false });
  }

  onConfirmar(): void {
    this.loading = true;

    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close({ confirmado: true });
    }, 1000);
  }
}
