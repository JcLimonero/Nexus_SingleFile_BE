import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface EliminarDocumentoData {
  documento: any;
}

export interface EliminarDocumentoResult {
  confirmado: boolean;
}

@Component({
  selector: 'app-eliminar-documento-dialog',
  templateUrl: './eliminar-documento-dialog.component.html',
  styleUrls: ['./eliminar-documento-dialog.component.scss'],
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
export class EliminarDocumentoDialogComponent {
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<EliminarDocumentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EliminarDocumentoData
  ) {}

  onCancelar(): void {
    this.dialogRef.close({ confirmado: false });
  }

  onConfirmar(): void {
    this.dialogRef.close({ confirmado: true });
  }
}

