import { Component, Inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ClientSearchResponse, ClientSearchService } from '../../../core/services/client-search.service';
import { VanguardiaClientService, VanguardiaResponse } from '../../../core/services/vanguardia-client.service';
import { VanguardiaClientImportResponse, VanguardiaClientImportService } from '../../../core/services/vanguardia-client-import.service';
import { ClientSelectionDialogComponent } from '../../procesos/integracion/client-selection-dialog.component';
import { ClienteCredito, CreditoService, RelacionCredito } from './credito.service';

export interface CreditoRelacionDialogData {
  idAgency: number;
  agencies: any[];
  cliente: ClienteCredito;
}

@Component({
  selector: 'vex-confirmar-nombre-relacion',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Nombres distintos</h2>
    <mat-dialog-content>
      <p>Los nombres de los clientes no coinciden. ¿Está seguro de que desea establecer la relación?</p>
      <p class="nombres"><strong>{{ data.nombrePrincipal }}</strong></p>
      <p class="nombres"><strong>{{ data.nombreRelacionado }}</strong></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" [mat-dialog-close]="false">Cancelar</button>
      <button mat-raised-button color="primary" type="button" [mat-dialog-close]="true">Sí, relacionar</button>
    </mat-dialog-actions>
  `,
  styles: [`.nombres { margin: 0.25rem 0; }`]
})
export class ConfirmarNombreRelacionComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { nombrePrincipal: string; nombreRelacionado: string }
  ) {}
}

@Component({
  selector: 'vex-credito-relacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './credito-relacion-dialog.component.html',
  styleUrls: ['./credito-relacion-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditoRelacionDialogComponent implements OnDestroy {
  relaciones: RelacionCredito[] = [];
  cargando = true;
  guardando = false;
  searchTerm = '';
  idAgenciaRelacion: number | null = null;
  sinResultados = false;
  private changed = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreditoRelacionDialogData,
    private dialogRef: MatDialogRef<CreditoRelacionDialogComponent, boolean>,
    private dialog: MatDialog,
    private creditoService: CreditoService,
    private clientSearchService: ClientSearchService,
    private vanguardiaClientService: VanguardiaClientService,
    private vanguardiaClientImportService: VanguardiaClientImportService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.cargarRelaciones();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrar(): void {
    this.dialogRef.close(this.changed);
  }

  buscar(): void {
    const termino = this.searchTerm.trim();
    if (termino.length < 1 || this.guardando) {
      return;
    }
    if (!this.idAgenciaRelacion) {
      this.snackBar.open('Seleccione la agencia del cliente a relacionar', 'Cerrar', { duration: 3000 });
      return;
    }

    this.guardando = true;
    this.sinResultados = false;
    this.cdr.markForCheck();

    this.clientSearchService.searchClients(this.idAgenciaRelacion, termino, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ClientSearchResponse) => {
          const clientes = response?.success && response.data?.clientes ? response.data.clientes : [];
          if (clientes.length > 1) {
            this.guardando = false;
            this.abrirSeleccion(clientes);
          } else if (clientes.length === 1) {
            this.guardarCliente(clientes[0]);
          } else {
            this.buscarEnVanguardia(termino);
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.guardando = false;
          this.sinResultados = true;
          this.cdr.markForCheck();
          this.snackBar.open('Error al buscar clientes', 'Cerrar', { duration: 3000 });
        }
      });
  }

  quitar(relacion: RelacionCredito): void {
    this.creditoService.eliminarRelacion(relacion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.snackBar.open(response.message || 'No se pudo quitar la relación', 'Cerrar', { duration: 3000 });
            return;
          }
          this.relaciones = this.relaciones.filter(item => item.id !== relacion.id);
          this.changed = true;
          this.snackBar.open('Relación eliminada', 'Cerrar', { duration: 2000 });
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'No se pudo quitar la relación', 'Cerrar', { duration: 3000 });
        }
      });
  }

  private cargarRelaciones(): void {
    this.cargando = true;
    this.creditoService.listarRelaciones(this.data.idAgency, this.data.cliente.idCliente)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.relaciones = response.success && response.data?.relaciones ? response.data.relaciones : [];
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.relaciones = [];
          this.cargando = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar las relaciones', 'Cerrar', { duration: 3000 });
        }
      });
  }

  private abrirSeleccion(clientes: any[]): void {
    const dialogRef = this.dialog.open(ClientSelectionDialogComponent, {
      width: '95vw',
      height: '80vh',
      maxWidth: '1200px',
      data: { clients: clientes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarCliente(result);
      }
      this.cdr.markForCheck();
    });
  }

  private guardarCliente(client: any): void {
    const idRelacionado = Number(client.idCliente);
    if (!idRelacionado) {
      this.guardando = false;
      this.snackBar.open('El cliente no tiene un identificador válido', 'Cerrar', { duration: 3000 });
      this.cdr.markForCheck();
      return;
    }
    if (
      idRelacionado === Number(this.data.cliente.idCliente) &&
      this.idAgenciaRelacion === this.data.idAgency
    ) {
      this.guardando = false;
      this.snackBar.open('No se puede relacionar un cliente consigo mismo', 'Cerrar', { duration: 3000 });
      this.cdr.markForCheck();
      return;
    }
    if (this.relaciones.some(item =>
      item.idCliente === idRelacionado && item.idAgencyRelacionado === this.idAgenciaRelacion
    )) {
      this.guardando = false;
      this.snackBar.open('Ese cliente ya está relacionado', 'Cerrar', { duration: 3000 });
      this.cdr.markForCheck();
      return;
    }

    const nombrePrincipal = this.nombreComparable(this.data.cliente);
    const nombreRelacionado = this.nombreComparable(client);
    if (!this.nombresCoinciden(nombrePrincipal, nombreRelacionado)) {
      this.confirmarNombres(nombrePrincipal, nombreRelacionado, idRelacionado);
      return;
    }

    this.persistirRelacion(idRelacionado);
  }

  private confirmarNombres(nombrePrincipal: string, nombreRelacionado: string, idRelacionado: number): void {
    const dialogRef = this.dialog.open(ConfirmarNombreRelacionComponent, {
      width: '480px',
      data: {
        nombrePrincipal: nombrePrincipal || 'Sin nombre',
        nombreRelacionado: nombreRelacionado || 'Sin nombre'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (!confirmado) {
        this.guardando = false;
        this.cdr.markForCheck();
        return;
      }
      this.persistirRelacion(idRelacionado);
    });
  }

  private persistirRelacion(idRelacionado: number): void {
    if (!this.idAgenciaRelacion) {
      this.guardando = false;
      this.cdr.markForCheck();
      return;
    }

    this.guardando = true;
    this.creditoService.crearRelacion(
      this.data.idAgency,
      this.data.cliente.idCliente,
      this.idAgenciaRelacion,
      idRelacionado
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.guardando = false;
          if (!response.success) {
            this.snackBar.open(response.message || 'No se pudo guardar la relación', 'Cerrar', { duration: 3000 });
            this.cdr.markForCheck();
            return;
          }
          this.searchTerm = '';
          this.sinResultados = false;
          this.changed = true;
          this.snackBar.open('Relación guardada', 'Cerrar', { duration: 3000 });
          this.cargarRelaciones();
        },
        error: (error) => {
          this.guardando = false;
          this.cdr.markForCheck();
          this.snackBar.open(error.error?.message || 'No se pudo guardar la relación', 'Cerrar', { duration: 4000 });
        }
      });
  }

  agenciasDisponibles(): any[] {
    return (this.data.agencies || []).filter(agency => agency.Id !== this.data.idAgency);
  }

  private nombreComparable(cliente: { cliente?: string; razonSocial?: string }): string {
    const nombre = (cliente.cliente || '').trim();
    if (nombre) {
      return nombre;
    }
    return (cliente.razonSocial || '').trim();
  }

  private nombresCoinciden(a: string, b: string): boolean {
    const normalizar = (value: string) => value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const izquierda = normalizar(a);
    const derecha = normalizar(b);
    return izquierda.length > 0 && izquierda === derecha;
  }

  private agenciaSeleccionada(): any | null {
    return this.agenciasDisponibles().find(agency => agency.Id === this.idAgenciaRelacion) || null;
  }

  private buscarEnVanguardia(termino: string): void {
    const agency = this.agenciaSeleccionada();
    if (!agency?.AgencyConnection) {
      this.guardando = false;
      this.sinResultados = true;
      this.cdr.markForCheck();
      this.snackBar.open('No se encontraron clientes y la agencia no tiene conexión a Vanguardia', 'Cerrar', { duration: 4000 });
      return;
    }

    this.vanguardiaClientService.searchClients(agency.AgencyConnection, termino)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: VanguardiaResponse) => {
          const encontrados = response?.status === 200 ? response.data?.data : null;
          if (!encontrados || encontrados.length === 0) {
            this.guardando = false;
            this.sinResultados = true;
            this.cdr.markForCheck();
            this.snackBar.open('No se encontraron clientes en el sistema local ni en Vanguardia', 'Cerrar', { duration: 4000 });
            return;
          }
          const convertido = this.vanguardiaClientService.convertVanguardiaClient(encontrados[0]);
          this.snackBar.open('Cliente encontrado en Vanguardia. Importando al sistema local...', 'Cerrar', { duration: 4000 });
          this.importarDesdeVanguardia(convertido);
        },
        error: (error) => {
          this.guardando = false;
          this.sinResultados = true;
          this.cdr.markForCheck();
          this.snackBar.open('Error al buscar en Vanguardia: ' + (error.error?.message || error.message), 'Cerrar', { duration: 4000 });
        }
      });
  }

  private importarDesdeVanguardia(vanguardiaClient: any): void {
    const importData = this.vanguardiaClientImportService.convertVanguardiaDataForImport(vanguardiaClient);
    importData.idAgency = String(this.idAgenciaRelacion);

    this.vanguardiaClientImportService.importClient(importData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: VanguardiaClientImportResponse) => {
          if (!response.success || !response.data) {
            this.guardando = false;
            this.sinResultados = true;
            this.snackBar.open('Error al importar cliente desde Vanguardia: ' + (response.message || 'Error desconocido'), 'Cerrar', { duration: 4000 });
            this.cdr.markForCheck();
            return;
          }
          this.guardarCliente({
            idCliente: response.data.idCliente,
            ndCliente: response.data.ndCliente || vanguardiaClient.ndDMS,
            cliente: response.data.cliente ||
              `${response.data.nombre || ''} ${response.data.apellidoPaterno || ''} ${response.data.apellidoMaterno || ''}`.trim() ||
              response.data.razonSocial
          });
        },
        error: (error) => {
          const ndDMS = importData.ndDMS;
          if (error.error?.message?.includes('ya existe') && ndDMS) {
            this.clientSearchService.searchClients(this.idAgenciaRelacion!, ndDMS, 10)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (searchResponse: ClientSearchResponse) => {
                  const found = searchResponse.data?.clientes?.find(c => c.ndCliente === ndDMS);
                  if (found) {
                    this.guardarCliente(found);
                  } else {
                    this.guardando = false;
                    this.sinResultados = true;
                    this.snackBar.open('El cliente ya existe, pero no se pudo cargar. Búsquelo de nuevo.', 'Cerrar', { duration: 4000 });
                    this.cdr.markForCheck();
                  }
                },
                error: () => {
                  this.guardando = false;
                  this.cdr.markForCheck();
                }
              });
            return;
          }
          this.guardando = false;
          this.sinResultados = true;
          this.cdr.markForCheck();
          this.snackBar.open('Error al importar cliente desde Vanguardia: ' + (error.error?.message || error.message), 'Cerrar', { duration: 4000 });
        }
      });
  }
}
