import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { ClientSearchResponse, ClientSearchService } from '../../../core/services/client-search.service';
import { VanguardiaClientService, VanguardiaResponse } from '../../../core/services/vanguardia-client.service';
import { VanguardiaClientImportResponse, VanguardiaClientImportService } from '../../../core/services/vanguardia-client-import.service';
import { ClientSelectionDialogComponent } from '../../procesos/integracion/client-selection-dialog.component';

interface ConsultaCredito {
  id: number;
  searchTerm: string;
  loading: boolean;
  client: any | null;
  sinResultados: boolean;
}

@Component({
  selector: 'vex-credito',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditoComponent implements OnInit, OnDestroy {
  agencies: any[] = [];
  selectedAgencyId: number | null = null;
  selectedAgency: any = null;
  agenciesLoading = true;

  consultas: ConsultaCredito[] = [];

  private nextId = 1;
  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private defaultAgencyService: DefaultAgencyService,
    private dialog: MatDialog,
    private clientSearchService: ClientSearchService,
    private vanguardiaClientService: VanguardiaClientService,
    private vanguardiaClientImportService: VanguardiaClientImportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
    if (savedAgencyId !== null) {
      this.selectedAgencyId = savedAgencyId;
    }

    this.consultas = [this.crearConsulta()];
    this.loadAgencies();

    this.defaultAgencyService.selectedAgency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(agenciaId => {
        if (agenciaId !== null && agenciaId !== this.selectedAgencyId) {
          this.selectedAgencyId = agenciaId;
          this.selectedAgency = this.agencies.find(agency => agency.Id === agenciaId) || null;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  tituloConsulta(consulta: ConsultaCredito, index: number): string {
    if (index === 0) {
      return 'Cliente principal';
    }
    return `Relación ${index}`;
  }

  agregarRelacion(): void {
    this.consultas = [...this.consultas, this.crearConsulta()];
    this.cdr.markForCheck();
  }

  quitarRelacion(consulta: ConsultaCredito): void {
    if (this.consultas.length <= 1) {
      this.limpiarConsulta(consulta);
      return;
    }
    this.consultas = this.consultas.filter(item => item.id !== consulta.id);
    this.cdr.markForCheck();
  }

  limpiarConsulta(consulta: ConsultaCredito): void {
    consulta.searchTerm = '';
    consulta.client = null;
    consulta.sinResultados = false;
    consulta.loading = false;
    this.cdr.markForCheck();
  }

  buscar(consulta: ConsultaCredito): void {
    const termino = consulta.searchTerm.trim();
    if (termino.length < 1) {
      this.snackBar.open('Debe ingresar al menos 1 carácter para buscar', 'Cerrar', { duration: 3000 });
      return;
    }
    if (!this.selectedAgencyId) {
      this.snackBar.open('Debe seleccionar una agencia para buscar clientes', 'Cerrar', { duration: 3000 });
      return;
    }

    consulta.loading = true;
    consulta.sinResultados = false;
    consulta.client = null;
    this.cdr.markForCheck();

    this.clientSearchService.searchClients(this.selectedAgencyId, termino, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ClientSearchResponse) => {
          const clientes = response?.success && response.data?.clientes ? response.data.clientes : [];
          if (clientes.length > 1) {
            consulta.loading = false;
            this.abrirSeleccion(consulta, clientes);
          } else if (clientes.length === 1) {
            consulta.loading = false;
            this.asignarCliente(consulta, clientes[0]);
          } else {
            this.buscarEnVanguardia(consulta, termino);
          }
          this.cdr.markForCheck();
        },
        error: () => {
          consulta.loading = false;
          consulta.sinResultados = true;
          this.cdr.markForCheck();
          this.snackBar.open('Error al buscar clientes', 'Cerrar', { duration: 3000 });
        }
      });
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    this.selectedAgency = this.agencies.find(agency => agency.Id === agencyId) || null;
    if (agencyId !== null) {
      this.defaultAgencyService.seleccionarAgencia(agencyId);
    }
    this.consultas.forEach(consulta => this.limpiarConsulta(consulta));
    this.cdr.markForCheck();
  }

  hasAgencies(): boolean {
    return this.agencies.length > 0;
  }

  trackByConsulta(_index: number, consulta: ConsultaCredito): number {
    return consulta.id;
  }

  trackByAgencyId(index: number, agency: any): any {
    return agency?.Id || index;
  }

  private crearConsulta(): ConsultaCredito {
    return {
      id: this.nextId++,
      searchTerm: '',
      loading: false,
      client: null,
      sinResultados: false
    };
  }

  private loadAgencies(): void {
    this.agenciesLoading = true;
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          this.agencies = agencias || [];
          this.agenciesLoading = false;
          const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
          if (savedAgencyId !== null && this.agencies.some(ag => ag.Id === savedAgencyId)) {
            this.selectedAgencyId = savedAgencyId;
            this.selectedAgency = this.agencies.find(agency => agency.Id === savedAgencyId) || null;
          } else if (this.agencies.length > 0) {
            this.selectedAgencyId = this.agencies[0].Id;
            this.selectedAgency = this.agencies[0];
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.agencies = [];
          this.agenciesLoading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', { duration: 3000 });
        }
      });
  }

  private abrirSeleccion(consulta: ConsultaCredito, clientes: any[]): void {
    const dialogRef = this.dialog.open(ClientSelectionDialogComponent, {
      width: '95vw',
      height: '80vh',
      maxWidth: '1200px',
      data: { clients: clientes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.asignarCliente(consulta, result);
      }
      this.cdr.markForCheck();
    });
  }

  private asignarCliente(consulta: ConsultaCredito, client: any): void {
    const duplicado = this.consultas.some(item =>
      item.id !== consulta.id &&
      item.client &&
      String(item.client.ndCliente) === String(client.ndCliente) &&
      String(item.client.idAgency ?? '') === String(client.idAgency ?? '')
    );

    if (duplicado) {
      consulta.sinResultados = false;
      this.snackBar.open('Ese cliente ya está en otra relación', 'Cerrar', { duration: 3000 });
      this.cdr.markForCheck();
      return;
    }

    consulta.client = client;
    consulta.sinResultados = false;
    consulta.searchTerm = '';
    this.snackBar.open(`Cliente seleccionado: ${client.cliente || client.ndCliente}`, 'Cerrar', { duration: 3000 });
    this.cdr.markForCheck();
  }

  private buscarEnVanguardia(consulta: ConsultaCredito, termino: string): void {
    const agency = this.agencies.find(item => item.Id === this.selectedAgencyId);
    if (!agency?.AgencyConnection) {
      consulta.loading = false;
      consulta.sinResultados = true;
      this.cdr.markForCheck();
      this.snackBar.open('No se encontraron clientes y la agencia no tiene conexión a Vanguardia', 'Cerrar', { duration: 4000 });
      return;
    }

    this.vanguardiaClientService.searchClients(agency.AgencyConnection, termino)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: VanguardiaResponse) => {
          const data = response?.status === 200 ? response.data?.data : null;
          if (!data || data.length === 0) {
            consulta.loading = false;
            consulta.sinResultados = true;
            this.cdr.markForCheck();
            this.snackBar.open('No se encontraron clientes en el sistema local ni en Vanguardia', 'Cerrar', { duration: 4000 });
            return;
          }

          const convertido = this.vanguardiaClientService.convertVanguardiaClient(data[0]);
          this.snackBar.open('Cliente encontrado en Vanguardia. Importando al sistema local...', 'Cerrar', { duration: 4000 });
          this.importarDesdeVanguardia(consulta, convertido);
        },
        error: (error) => {
          consulta.loading = false;
          consulta.sinResultados = true;
          this.cdr.markForCheck();
          this.snackBar.open('Error al buscar en Vanguardia: ' + (error.error?.message || error.message), 'Cerrar', { duration: 4000 });
        }
      });
  }

  private importarDesdeVanguardia(consulta: ConsultaCredito, vanguardiaClient: any): void {
    const importData = this.vanguardiaClientImportService.convertVanguardiaDataForImport(vanguardiaClient);
    if (this.selectedAgency?.Id) {
      importData.idAgency = String(this.selectedAgency.Id);
    }

    this.vanguardiaClientImportService.importClient(importData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: VanguardiaClientImportResponse) => {
          consulta.loading = false;
          if (!response.success || !response.data) {
            consulta.sinResultados = true;
            this.snackBar.open('Error al importar cliente desde Vanguardia: ' + (response.message || 'Error desconocido'), 'Cerrar', { duration: 4000 });
            this.cdr.markForCheck();
            return;
          }

          const responseData = response.data as any;
          const clientIdAgency = responseData.idAgency !== undefined && responseData.idAgency !== null
            ? (typeof responseData.idAgency === 'string' ? parseInt(responseData.idAgency, 10) : responseData.idAgency)
            : (this.selectedAgency?.Id || null);

          this.asignarCliente(consulta, {
            idCliente: response.data.idCliente,
            ndCliente: response.data.ndCliente || vanguardiaClient.ndDMS,
            cliente: response.data.cliente ||
              `${response.data.nombre || ''} ${response.data.apellidoPaterno || ''} ${response.data.apellidoMaterno || ''}`.trim() ||
              response.data.razonSocial,
            nombre: response.data.nombre,
            apellidoPaterno: response.data.apellidoPaterno,
            apellidoMaterno: response.data.apellidoMaterno,
            rfc: response.data.rfc,
            email: response.data.email,
            telefono: response.data.telefono,
            telefono2: response.data.telefono2,
            razonSocial: response.data.razonSocial,
            curp: response.data.curp,
            asesor: response.data.asesor,
            agenciaOrigen: response.data.agenciaOrigen || String(clientIdAgency),
            fechaRegistro: response.data.fechaRegistro,
            fechaActualizacion: response.data.fechaActualizacion,
            idAgency: clientIdAgency
          });
        },
        error: (error) => {
          consulta.loading = false;
          const ndDMS = importData.ndDMS;
          if (error.error?.message?.includes('ya existe') && ndDMS && this.selectedAgencyId) {
            this.clientSearchService.searchClients(this.selectedAgencyId, ndDMS, 10)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (searchResponse: ClientSearchResponse) => {
                  const found = searchResponse.data?.clientes?.find(c => c.ndCliente === ndDMS);
                  if (found) {
                    this.asignarCliente(consulta, found);
                  } else {
                    consulta.sinResultados = true;
                    this.snackBar.open('El cliente ya existe, pero no se pudo cargar. Búsquelo de nuevo.', 'Cerrar', { duration: 4000 });
                  }
                  this.cdr.markForCheck();
                },
                error: () => {
                  consulta.sinResultados = true;
                  this.cdr.markForCheck();
                }
              });
            return;
          }

          consulta.sinResultados = true;
          this.cdr.markForCheck();
          this.snackBar.open('Error al importar cliente desde Vanguardia: ' + (error.error?.message || error.message), 'Cerrar', { duration: 4000 });
        }
      });
  }
}
