import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface AprobarDocumentoData {
  documento: any;
}

export interface AprobarDocumentoResult {
  aprobado: boolean;
  estatus: string;
  comentario?: string;
  fechaExpiracion?: Date;
}

@Component({
  selector: 'app-aprobar-documento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './aprobar-documento-dialog.component.html',
  styleUrls: ['./aprobar-documento-dialog.component.scss']
})
export class AprobarDocumentoDialogComponent {

  estatusSeleccionado: string = '';
  comentario: string = '';
  fechaExpiracion: Date | null = null;
  
  opcionesEstatus = [
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AprobarDocumentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AprobarDocumentoData
  ) {}

  onCancelar(): void {
    this.dialogRef.close();
  }

  onConfirmar(): void {
    if (!this.estatusSeleccionado) {
      return;
    }

    // Si el documento requiere expiración y está siendo aprobado, validar fecha
    if (this.requiereExpiracion && this.estatusSeleccionado === 'aprobado' && !this.fechaExpiracion) {
      return;
    }

    // Si está siendo rechazado, validar comentario
    if (this.estatusSeleccionado === 'rechazado' && !this.comentario.trim()) {
      return;
    }

    const result: AprobarDocumentoResult = {
      aprobado: this.estatusSeleccionado === 'aprobado',
      estatus: this.estatusSeleccionado,
      comentario: this.comentario.trim() || undefined,
      fechaExpiracion: this.fechaExpiracion || undefined
    };

    this.dialogRef.close(result);
  }

  get puedeConfirmar(): boolean {
    if (!this.estatusSeleccionado) {
      return false;
    }

    // Si requiere expiración y está siendo aprobado, debe tener fecha
    if (this.requiereExpiracion && this.estatusSeleccionado === 'aprobado') {
      return this.fechaExpiracion !== null;
    }

    // Si está siendo rechazado, debe tener comentario
    if (this.estatusSeleccionado === 'rechazado') {
      return this.comentario.trim() !== '';
    }

    return true;
  }

  get requiereExpiracion(): boolean {
    return this.data.documento.ReqExpiration == 1 || this.data.documento.ReqExpiration === "1";
  }
}
