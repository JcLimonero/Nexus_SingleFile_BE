import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { AgencyService } from '../../../../core/services/agency.service';

@Component({
  selector: 'vex-agency-filter',
  templateUrl: './agency-filter.component.html',
  styleUrls: ['./agency-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class AgencyFilterComponent implements OnInit, OnDestroy {
  @Input() selectedAgencyId: number | null = null;
  @Output() agencyChange = new EventEmitter<number | null>();

  agencies: any[] = [];
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAgencies(): void {
    this.loading = true;
    
    // Obtener solo agencias habilitadas
    this.agencyService.getAgencies({ enabled: true, limit: 100 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Agencies response:', response);
          
          // Manejar la respuesta según la estructura del servicio
          if (response && response.data && response.data.agencies) {
            this.agencies = response.data.agencies;
          } else if (Array.isArray(response)) {
            this.agencies = response;
          } else if (response && typeof response === 'object') {
            // Intentar extraer agencias de diferentes estructuras posibles
            const data = (response as any).agencies || (response as any).data;
            this.agencies = Array.isArray(data) ? data : [];
          } else {
            this.agencies = [];
          }
          
          // Verificar que es un array antes de asignar
          if (!Array.isArray(this.agencies)) {
            console.warn('Agencies is not an array, converting to empty array');
            this.agencies = [];
          }
          
          console.log('Processed agencies:', this.agencies);
          console.log('Agencies count:', this.agencies.length);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading agencies:', error);
          this.agencies = [];
          this.loading = false;
        }
      });
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    this.agencyChange.emit(agencyId);
  }

  clearFilter(): void {
    this.selectedAgencyId = null;
    this.agencyChange.emit(null);
  }

  trackByAgencyId(index: number, agency: any): any {
    return agency?.Id || index;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getAgenciesCount(): number {
    return Array.isArray(this.agencies) ? this.agencies.length : 0;
  }

  hasAgencies(): boolean {
    return Array.isArray(this.agencies) && this.agencies.length > 0;
  }
}
