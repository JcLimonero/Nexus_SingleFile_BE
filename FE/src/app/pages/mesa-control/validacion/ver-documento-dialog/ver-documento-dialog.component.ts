import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ver-documento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ver-documento-dialog.component.html',
  styleUrls: ['./ver-documento-dialog.component.scss']
})
export class VerDocumentoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<VerDocumentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documento: any }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getEstatusIcon(): string {
    const estatus = this.data.documento.idEstatus;
    switch (estatus) {
      case '2':
        return 'warning';
      case '4':
        return 'verified';
      default:
        return 'hourglass_empty';
    }
  }

  getEstatusColor(): string {
    const estatus = this.data.documento.idEstatus;
    switch (estatus) {
      case '2':
        return 'text-orange-500';
      case '4':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  }

  getEstatusText(): string {
    const estatus = this.data.documento.idEstatus;
    switch (estatus) {
      case '2':
        return 'Pendiente de validación';
      case '4':
        return 'Validado y aprobado';
      default:
        return 'En proceso de revisión';
    }
  }
}
