import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ValidacionService } from '../validacion.service';

export interface BeneficiariosDialogData {
  cliente: any;
}

export interface Beneficiario {
  Id: number;
  IdFile: number;
  Nombre: string;
  RFC?: string | null;
  CURP?: string | null;
  PorcentajeParticipacion?: number | null;
}

@Component({
  selector: 'app-beneficiarios-dialog',
  templateUrl: './beneficiarios-dialog.component.html',
  styleUrls: ['./beneficiarios-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ]
})
export class BeneficiariosDialogComponent implements OnInit {
  beneficiarios: Beneficiario[] = [];
  loading = true;
  loadingAdd = false;

  nombre = '';
  rfc = '';
  curp = '';
  porcentajeParticipacion: number | null = null;

  /** Si los datos fueron copiados del cliente, solo se puede editar el % */
  datosCopiadosDelCliente = false;

  displayedColumns = ['nombre', 'rfc', 'curp', 'porcentaje', 'acciones'];

  /** Suma actual de porcentajes de beneficiarios existentes */
  get totalPorcentaje(): number {
    return this.beneficiarios.reduce((s, b) => s + (b.PorcentajeParticipacion ?? 0), 0);
  }

  /** Porcentaje disponible para agregar (100 - total actual) */
  get porcentajeDisponible(): number {
    return Math.max(0, 100 - this.totalPorcentaje);
  }

  /** Si al agregar el nuevo porcentaje se superaría 100% */
  get excederiaCien(): boolean {
    const nuevo = this.porcentajeParticipacion ?? 0;
    return nuevo > 0 && this.totalPorcentaje + nuevo > 100;
  }

  /** Si el botón Agregar debe estar deshabilitado por validación de porcentaje */
  get puedeAgregar(): boolean {
    if (!this.nombre.trim()) return false;
    const p = this.porcentajeParticipacion;
    if (p != null && (p < 0 || p > 100)) return false;
    if (this.excederiaCien) return false;
    return true;
  }

  constructor(
    public dialogRef: MatDialogRef<BeneficiariosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BeneficiariosDialogData,
    private validacionService: ValidacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarBeneficiarios();
  }

  usarDatosDelCliente(): void {
    this.validacionService.getClienteDetalle(this.data.cliente.idFile).subscribe({
      next: (d) => {
        this.nombre = d.cliente || '';
        this.rfc = d.rfc || '';
        this.curp = d.curp || '';
        this.datosCopiadosDelCliente = true;
        this.snackBar.open('Datos del cliente copiados. Indica el % de participación.', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al obtener datos del cliente', 'Cerrar', { duration: 4000 });
      }
    });
  }

  limpiarDatosCopiados(): void {
    this.datosCopiadosDelCliente = false;
    this.nombre = '';
    this.rfc = '';
    this.curp = '';
    this.porcentajeParticipacion = null;
  }

  cargarBeneficiarios(): void {
    this.loading = true;
    this.validacionService.getBeneficiarios(this.data.cliente.idFile).subscribe({
      next: (list) => {
        this.beneficiarios = list;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar beneficiarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  agregar(): void {
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.snackBar.open('El nombre es requerido', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.excederiaCien) {
      this.snackBar.open('La suma de porcentajes no puede superar 100%', 'Cerrar', { duration: 4000 });
      return;
    }
    this.loadingAdd = true;
    this.validacionService.addBeneficiario(this.data.cliente.idFile, {
      nombre,
      rfc: this.rfc.trim() || undefined,
      curp: this.curp.trim() || undefined,
      porcentajeParticipacion: this.porcentajeParticipacion ?? undefined
    }).subscribe({
      next: () => {
        this.nombre = '';
        this.rfc = '';
        this.curp = '';
        this.porcentajeParticipacion = null;
        this.datosCopiadosDelCliente = false;
        this.cargarBeneficiarios();
        this.loadingAdd = false;
        this.snackBar.open('Beneficiario agregado', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al agregar beneficiario', 'Cerrar', { duration: 4000 });
        this.loadingAdd = false;
      }
    });
  }

  eliminar(b: Beneficiario): void {
    if (!confirm(`¿Eliminar a ${b.Nombre}?`)) return;
    this.validacionService.deleteBeneficiario(b.Id).subscribe({
      next: () => {
        this.cargarBeneficiarios();
        this.snackBar.open('Beneficiario eliminado', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al eliminar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
