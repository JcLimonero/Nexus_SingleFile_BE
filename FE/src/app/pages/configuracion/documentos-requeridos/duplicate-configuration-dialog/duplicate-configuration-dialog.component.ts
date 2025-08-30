
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { AgencyService, Agency } from '../../../../core/services/agency.service';
import { DocumentoRequeridoService } from '../../../../core/services/documento-requerido.service';

export interface DuplicateConfigurationData {
  configuracion: {
    IdProcess: string;
    IdAgency: number;
    IdCostumerType: string;
    IdOperationType: string;
  };
  currentAgencyName: string;
  processName: string;
  customerTypeName: string;
  operationTypeName: string;
}

@Component({
  selector: 'app-duplicate-configuration-dialog',
  templateUrl: './duplicate-configuration-dialog.component.html',
  styleUrls: ['./duplicate-configuration-dialog.component.scss'],
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
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ]
})
export class DuplicateConfigurationDialogComponent implements OnInit {
  loading = false;
  agencies: Agency[] = [];
  availableAgencies: Agency[] = [];
  selectedAgencies: number[] = [];
  searchTerm = '';

  constructor(
    public dialogRef: MatDialogRef<DuplicateConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DuplicateConfigurationData,
    private agencyService: AgencyService,
    private documentoRequeridoService: DocumentoRequeridoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  async loadAgencies(): Promise<void> {
    this.loading = true;
    try {
      // Cargar todas las agencias
      const response = await this.agencyService.getAgencies().toPromise();
      this.agencies = response?.data?.agencies || [];
      
      // Filtrar agencias disponibles (excluyendo la actual)
      this.availableAgencies = this.agencies.filter(agency => 
        agency.Id !== this.data.configuracion.IdAgency
      );

      // Verificar qué agencias ya tienen esta configuración
      await this.checkExistingConfigurations();
      
    } catch (error) {
      console.error('Error cargando agencias:', error);
      this.snackBar.open('Error cargando agencias', 'Error', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async checkExistingConfigurations(): Promise<void> {
    try {
      // Para cada agencia disponible, verificar si ya tiene esta configuración
      const promises = this.availableAgencies.map(async (agency) => {
        // Verificar si existe configuración para esta agencia
        const hasConfig = await this.documentoRequeridoService.getDocumentosRequeridos({
          IdProcess: this.data.configuracion.IdProcess,
          IdAgency: agency.Id.toString(),
          IdCostumerType: this.data.configuracion.IdCostumerType,
          IdOperationType: this.data.configuracion.IdOperationType
        }).toPromise();
        
        return { agency, hasConfig: hasConfig?.success && hasConfig.data?.documentos?.length > 0 };
      });

      const results = await Promise.all(promises);
      
      // Solo mostrar agencias que NO tienen esta configuración
      this.availableAgencies = results
        .filter(result => !result.hasConfig)
        .map(result => result.agency);

    } catch (error) {
      console.error('Error verificando configuraciones existentes:', error);
      // En caso de error, mostrar todas las agencias disponibles
    }
  }

  onAgencySelectionChange(agencyId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedAgencies.includes(agencyId)) {
        this.selectedAgencies.push(agencyId);
      }
    } else {
      this.selectedAgencies = this.selectedAgencies.filter(id => id !== agencyId);
    }
  }

  isAgencySelected(agencyId: number): boolean {
    return this.selectedAgencies.includes(agencyId);
  }

  getAgencyName(agencyId: number): string {
    const agency = this.agencies.find(a => a.Id === agencyId);
    return agency ? agency.Name : `Agencia ${agencyId}`;
  }

  selectAllAgencies(): void {
    this.selectedAgencies = this.availableAgencies.map(agency => agency.Id);
  }

  deselectAllAgencies(): void {
    this.selectedAgencies = [];
  }

  get filteredAgencies(): Agency[] {
    if (!this.searchTerm) {
      return this.availableAgencies;
    }
    
    return this.availableAgencies.filter(agency =>
      agency.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  canDuplicate(): boolean {
    return this.selectedAgencies.length > 0 && !this.loading;
  }

  async duplicateConfiguration(): Promise<void> {
    if (!this.canDuplicate()) {
      return;
    }

    this.loading = true;
    try {
      // Duplicar la configuración para cada agencia seleccionada
      const promises = this.selectedAgencies.map(async (agencyId) => {
        const sourceConfig = {
          IdProcess: this.data.configuracion.IdProcess,
          IdAgency: this.data.configuracion.IdAgency.toString(),
          IdCostumerType: this.data.configuracion.IdCostumerType,
          IdOperationType: this.data.configuracion.IdOperationType
        };

        const targetConfig = {
          IdProcess: this.data.configuracion.IdProcess,
          IdAgency: agencyId.toString(),
          IdCostumerType: this.data.configuracion.IdCostumerType,
          IdOperationType: this.data.configuracion.IdOperationType
        };

        return this.documentoRequeridoService.duplicateConfiguracion(sourceConfig, targetConfig).toPromise();
      });

      await Promise.all(promises);

      this.snackBar.open(
        `Configuración duplicada exitosamente a ${this.selectedAgencies.length} agencia(s)`, 
        'Éxito', 
        { duration: 3000 }
      );

      this.dialogRef.close({ success: true, agenciesCount: this.selectedAgencies.length });

    } catch (error) {
      console.error('Error duplicando configuración:', error);
      this.snackBar.open('Error duplicando configuración', 'Error', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
