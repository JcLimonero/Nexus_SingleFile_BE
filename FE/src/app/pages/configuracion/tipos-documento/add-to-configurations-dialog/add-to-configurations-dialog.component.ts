import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentType } from '../../../../core/interfaces/document-type.interface';
import { DocumentTypeService } from '../../../../core/services/document-type.service';
import { ProcesoService } from '../../../../core/services/proceso.service';
import { AgencyService } from '../../../../core/services/agency.service';
import { CostumerTypeService } from '../../../../core/services/costumer-type.service';
import { TipoOperacionService } from '../../../../core/services/tipo-operacion.service';

export interface ConfigToAdd {
  IdConfigurationProcess: number;
  IdProcess?: number;
  ProcesoName?: string;
  IdAgency?: number;
  AgenciaName?: string;
  IdCostumerType?: number;
  TipoClienteName?: string;
  IdOperationType?: number;
  TipoOperacionName?: string;
  Enabled?: number | string;
}

export interface AddToConfigurationsDialogData {
  documentType: DocumentType;
}

@Component({
  selector: 'app-add-to-configurations-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-to-configurations-dialog.component.html',
  styleUrls: ['./add-to-configurations-dialog.component.scss']
})
export class AddToConfigurationsDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  loading = true;
  adding = false;
  configurations: ConfigToAdd[] = [];
  dataSource = new MatTableDataSource<ConfigToAdd>([]);
  displayedColumns: string[] = ['select', 'AgenciaName', 'ProcesoName', 'TipoClienteName', 'TipoOperacionName'];
  selectedIds = new Set<number>();

  selectedProcess = '';
  selectedAgency = '';
  selectedCostumerType = '';
  selectedOperationType = '';

  procesos: any[] = [];
  agencias: any[] = [];
  tiposCliente: any[] = [];
  tiposOperacion: any[] = [];
  filtered: ConfigToAdd[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddToConfigurationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddToConfigurationsDialogData,
    private documentTypeService: DocumentTypeService,
    private procesoService: ProcesoService,
    private agencyService: AgencyService,
    private costumerTypeService: CostumerTypeService,
    private tipoOperacionService: TipoOperacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadConfigurationsToAdd();
  }

  private loadCatalogs(): void {
    this.procesoService.getProcesos().subscribe({
      next: (r: any) => { if (r?.success && r?.data) this.procesos = r.data.processes || []; }
    });
    this.agencyService.getAgencies({}).subscribe({
      next: (r: any) => { if (r?.success && r?.data) this.agencias = r.data.agencies || []; }
    });
    this.costumerTypeService.getCostumerTypes().subscribe({
      next: (r: any) => { if (r?.success && r?.data) this.tiposCliente = r.data.costumer_types || []; }
    });
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (r: any) => { if (r?.success && r?.data) this.tiposOperacion = r.data.operationTypes || []; }
    });
  }

  private loadConfigurationsToAdd(): void {
    this.loading = true;
    const id = String(this.data.documentType.Id!);
    this.documentTypeService.getConfigurationsToAdd(id).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.configurations = (res?.data?.configurations ?? []) as ConfigToAdd[];
        this.applyFilters();
        setTimeout(() => { if (this.paginator) this.dataSource.paginator = this.paginator; });
      },
      error: () => {
        this.loading = false;
        this.configurations = [];
        this.dataSource.data = [];
        this.snackBar.open('Error al cargar configuraciones disponibles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.configurations.filter(c => {
      const okProcess = !this.selectedProcess || String(c.IdProcess) === String(this.selectedProcess);
      const okAgency = !this.selectedAgency || String(c.IdAgency) === String(this.selectedAgency);
      const okCostumer = !this.selectedCostumerType || String(c.IdCostumerType) === String(this.selectedCostumerType);
      const okOp = !this.selectedOperationType || String(c.IdOperationType) === String(this.selectedOperationType);
      return okProcess && okAgency && okCostumer && okOp;
    });
    this.dataSource.data = this.filtered;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.firstPage();
    }
  }

  private getCurrentPageData(): ConfigToAdd[] {
    const d = this.dataSource.data;
    const p = this.dataSource.paginator;
    if (!p) return d;
    const start = p.pageIndex * p.pageSize;
    return d.slice(start, start + p.pageSize);
  }

  isSelected(c: ConfigToAdd): boolean {
    return this.selectedIds.has(c.IdConfigurationProcess);
  }

  toggleSelection(c: ConfigToAdd): void {
    if (this.selectedIds.has(c.IdConfigurationProcess)) this.selectedIds.delete(c.IdConfigurationProcess);
    else this.selectedIds.add(c.IdConfigurationProcess);
    this.selectedIds = new Set(this.selectedIds);
  }

  isAllOnPageSelected(): boolean {
    const page = this.getCurrentPageData();
    return page.length > 0 && page.every(x => this.selectedIds.has(x.IdConfigurationProcess));
  }

  toggleAllOnPage(): void {
    const page = this.getCurrentPageData();
    if (this.isAllOnPageSelected()) page.forEach(c => this.selectedIds.delete(c.IdConfigurationProcess));
    else page.forEach(c => this.selectedIds.add(c.IdConfigurationProcess));
    this.selectedIds = new Set(this.selectedIds);
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  addToConfigurations(): void {
    if (this.selectedIds.size === 0) return;
    this.adding = true;
    const id = String(this.data.documentType.Id!);
    const ids = Array.from(this.selectedIds);
    this.documentTypeService.addToConfigurations(id, ids).subscribe({
      next: (res: any) => {
        this.adding = false;
        if (res?.success) {
          this.snackBar.open(res?.message ?? 'Configuraciones agregadas', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ added: true, count: res?.data?.added ?? ids.length });
        } else {
          this.snackBar.open(res?.message ?? 'Error al agregar', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.adding = false;
        this.snackBar.open('Error al agregar a configuraciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
