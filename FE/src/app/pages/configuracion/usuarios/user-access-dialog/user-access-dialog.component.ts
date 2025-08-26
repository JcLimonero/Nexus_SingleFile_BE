import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { UserAccessDialogData, UserAccess, Agency, Process, AgencyResponse, ProcessResponse } from '../../../../core/interfaces/user-access.interface';
import { UserAccessService } from '../../../../core/services/user-access.service';

@Component({
  selector: 'app-user-access-dialog',
  templateUrl: './user-access-dialog.component.html',
  styleUrls: ['./user-access-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule
  ]
})
export class UserAccessDialogComponent implements OnInit {
  accessForm!: FormGroup;
  loading = false;
  
  // Datos disponibles
  allAgencies: Agency[] = [];
  allProcesses: Process[] = [];
  
  // Datos asignados al usuario
  userAgencies: string[] = [];
  userProcesses: string[] = [];
  
  // Datos temporales para el formulario
  selectedAgencies: string[] = [];
  selectedProcesses: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userAccessService: UserAccessService,
    private dialogRef: MatDialogRef<UserAccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserAccessDialogData,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.accessForm = this.fb.group({
      agencies: [[]],
      processes: [[]]
    });
  }

  private loadData(): void {
    this.loading = true;
    
    // Cargar agencias y procesos disponibles, y los accesos actuales del usuario
    Promise.all([
      this.userAccessService.getActiveAgencies().toPromise(),
      this.userAccessService.getActiveProcesses().toPromise(),
      this.userAccessService.getUserAccess(this.data.user.Id).toPromise()
    ]).then(([agenciesResponse, processesResponse, userAccessResponse]) => {
      // Procesar agencias disponibles
      if (agenciesResponse?.success) {
        this.allAgencies = agenciesResponse.data.agencies || [];
      }
      
      // Procesar procesos disponibles
      if (processesResponse?.success) {
        this.allProcesses = processesResponse.data.processes || [];
      }
      
      // Cargar accesos actuales del usuario
      if (userAccessResponse?.success) {
        this.userAgencies = userAccessResponse.data.agencies || [];
        this.userProcesses = userAccessResponse.data.processes || [];
      } else {
        // Si no hay accesos o hay error, inicializar vacío
        this.userAgencies = [];
        this.userProcesses = [];
      }
      
      // Inicializar selecciones con los datos del usuario
      this.selectedAgencies = [...this.userAgencies];
      this.selectedProcesses = [...this.userProcesses];
      
      // Actualizar formulario
      this.accessForm.patchValue({
        agencies: this.selectedAgencies,
        processes: this.selectedProcesses
      });
      
      this.loading = false;
    }).catch(error => {
      this.snackBar.open('Error al cargar datos de acceso', 'Error', {
        duration: 3000
      });
      this.loading = false;
    });
  }

  onAgencySelectionChange(agencies: string[]): void {
    this.selectedAgencies = agencies;
  }

  onProcessSelectionChange(processes: string[]): void {
    this.selectedProcesses = processes;
  }

  removeAgency(agencyId: string): void {
    this.selectedAgencies = this.selectedAgencies.filter(id => id !== agencyId);
    this.accessForm.patchValue({ agencies: this.selectedAgencies });
  }

  removeProcess(processId: string): void {
    this.selectedProcesses = this.selectedProcesses.filter(id => id !== processId);
    this.accessForm.patchValue({ processes: this.selectedProcesses });
  }

  getAgencyName(agencyId: string): string {
    const agency = this.allAgencies.find(a => a.Id === agencyId);
    return agency?.Name || `Agencia ${agencyId}`;
  }

  getProcessName(processId: string): string {
    const process = this.allProcesses.find(p => p.Id === processId);
    return process?.Name || `Proceso ${processId}`;
  }

  onSubmit(): void {
    if (this.data.mode === 'view') {
      this.onCancel();
      return;
    }

    this.loading = true;

    const accessData: UserAccess = {
      userId: this.data.user.Id,
      agencies: this.selectedAgencies,
      processes: this.selectedProcesses
    };

    this.userAccessService.updateUserAccess(this.data.user.Id, accessData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Accesos actualizados exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar accesos', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar accesos', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get dialogTitle(): string {
    return `${this.data.mode === 'view' ? 'Ver' : 'Gestionar'} Accesos - ${this.data.user.Name}`;
  }

  get submitButtonText(): string {
    return this.data.mode === 'view' ? 'Cerrar' : 'Guardar Cambios';
  }

  get isReadonly(): boolean {
    return this.data.mode === 'view';
  }
}
