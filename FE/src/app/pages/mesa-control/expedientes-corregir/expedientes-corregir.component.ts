import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ValidacionService } from '../validacion/validacion.service';

export interface ExpedienteCorregir {
  id: number;
  idFile: number;
  idAgency: number;
  ndCliente: string;
  api_result?: { success?: boolean; idClient?: number; raw?: string } | null;
  created_at: string | null;
  tipoReparacion: 'repairClientRelation';
}

export interface GrupoAgencia {
  idAgency: number;
  nombreAgencia: string;
  total: number;
  expedientes: ExpedienteCorregir[];
}

@Component({
  selector: 'app-expedientes-corregir',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './expedientes-corregir.component.html',
  styleUrls: ['./expedientes-corregir.component.scss']
})
export class ExpedientesCorregirComponent implements OnInit {
  loading = false;
  reparandoSiguientes10 = false;
  reparandoTodos = false;
  porAgencia: GrupoAgencia[] = [];
  totalGeneral = 0;
  reparandoIds = new Set<number>();
  reparandoAgencia: number | null = null;

  displayedColumns = ['idExpediente', 'ndDMS', 'api_result', 'created_at', 'acciones'];

  constructor(
    private validacionService: ValidacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.validacionService.getExpedientesCorregir().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.porAgencia = res.data.porAgencia ?? [];
          this.totalGeneral = res.data.totalGeneral ?? 0;
        } else {
          this.porAgencia = [];
          this.totalGeneral = 0;
          this.snackBar.open(res.message || 'Error al cargar expedientes', 'Cerrar', { duration: 5000 });
        }
        this.loading = false;
      },
      error: (err) => {
        this.porAgencia = [];
        this.totalGeneral = 0;
        this.loading = false;
        const msg = err?.error?.message || err?.message || 'Error al cargar expedientes';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  repararUno(exp: ExpedienteCorregir, idAgency: number): void {
    if (this.reparandoIds.has(exp.idFile)) return;
    if (exp.api_result?.success) return;
    this.reparandoIds.add(exp.idFile);
    this.validacionService.repairClientRelation(exp.ndCliente, idAgency, exp.idFile).subscribe({
      next: (res) => {
        this.reparandoIds.delete(exp.idFile);
        if (res?.success) {
          exp.api_result = { success: true, idClient: res.data?.idClient };
          this.snackBar.open('Relación reparada correctamente', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open(res?.message || 'Error al reparar', 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        this.reparandoIds.delete(exp.idFile);
        const msg = err?.error?.message || err?.message || 'Error al reparar';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  repararTodos(grupo: GrupoAgencia): void {
    if (this.reparandoAgencia !== null) return;
    if (grupo.expedientes.length === 0) return;
    this.reparandoAgencia = grupo.idAgency;
    this.repararSecuencial(grupo.expedientes, 0, grupo.idAgency);
  }

  private repararSecuencial(expedientes: ExpedienteCorregir[], index: number, idAgency: number): void {
    if (index >= expedientes.length) {
      this.reparandoAgencia = null;
      this.snackBar.open('Expedientes procesados', 'Cerrar', { duration: 3000 });
      return;
    }
    const exp = expedientes[index];
    if (exp.api_result?.success) {
      this.repararSecuencial(expedientes, index + 1, idAgency);
      return;
    }
    this.reparandoIds.add(exp.idFile);
    this.validacionService.repairClientRelation(exp.ndCliente, idAgency, exp.idFile).subscribe({
      next: (res) => {
        this.reparandoIds.delete(exp.idFile);
        if (res?.success) {
          exp.api_result = { success: true, idClient: res.data?.idClient };
          this.repararSecuencial(expedientes, index + 1, idAgency);
        } else {
          this.reparandoAgencia = null;
          this.snackBar.open(res?.message || `Error al reparar expediente ${exp.idFile}`, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        this.reparandoIds.delete(exp.idFile);
        this.reparandoAgencia = null;
        const msg = err?.error?.message || err?.message || `Error al reparar expediente ${exp.idFile}`;
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  repararSiguientes10(): void {
    if (this.reparandoSiguientes10) return;
    this.reparandoSiguientes10 = true;
    this.validacionService.autoRepararSiguientes10().subscribe({
      next: (res) => this.handleRepararResponse(res, () => { this.reparandoSiguientes10 = false; }),
      error: (err) => {
        this.reparandoSiguientes10 = false;
        this.snackBar.open(err?.error?.message || err?.message || 'Error al reparar', 'Cerrar', { duration: 5000 });
      }
    });
  }

  repararTodosPendientes(): void {
    if (this.reparandoTodos) return;
    this.reparandoTodos = true;
    this.validacionService.autoRepararTodos().subscribe({
      next: (res) => this.handleRepararResponse(res, () => { this.reparandoTodos = false; }),
      error: (err) => {
        this.reparandoTodos = false;
        this.snackBar.open(err?.error?.message || err?.message || 'Error al reparar', 'Cerrar', { duration: 5000 });
      }
    });
  }

  private handleRepararResponse(res: any, onDone: () => void): void {
    onDone();
    if (res?.success) {
      const d = res.data;
      const msg = d?.reparados !== undefined
        ? `${d.reparados} expediente(s) reparado(s)${d.errores?.length ? `, ${d.errores.length} error(es)` : ''}`
        : res.message;
      this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      this.cargar();
    } else {
      this.snackBar.open(res?.message || 'Error al reparar', 'Cerrar', { duration: 5000 });
    }
  }

  estaReparando(idFile: number): boolean {
    return this.reparandoIds.has(idFile);
  }

  estaReparandoAgencia(idAgency: number): boolean {
    return this.reparandoAgencia === idAgency;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('es-MX');
  }
}
