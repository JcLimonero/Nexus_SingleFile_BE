import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { DefaultAgencyService } from '../../../../core/services/default-agency.service';

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

  constructor(private defaultAgencyService: DefaultAgencyService) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAgencies(): void {
    this.loading = true;
    
    // Usar DefaultAgencyService que maneja caché en localStorage
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          // Filtrar solo agencias habilitadas
          this.agencies = agencias.filter(ag => 
            this.defaultAgencyService.esAgenciaHabilitada(ag)
          );
          this.loading = false;
        },
        error: (error) => {
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
