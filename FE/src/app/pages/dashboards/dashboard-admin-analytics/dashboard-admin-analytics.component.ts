import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { WidgetAgencyMetricsComponent } from '../components/widgets/widget-agency-metrics/widget-agency-metrics.component';
import { CompanyAgencyFilterComponent } from '../../../shared/components/company-agency-filter/company-agency-filter.component';
import { DateRangeFilterComponent, DateRange } from '../components/date-range-filter/date-range-filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnalyticsService, AnalyticsFilters } from '../../../core/services/analytics.service';
import { AgencyService } from '../../../core/services/agency.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { RealTimeAnalyticsService } from '../../../core/services/real-time-analytics.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorBannerComponent } from '../../../shared/error-banner/error-banner.component';

@Component({
  selector: 'vex-dashboard-admin-analytics',
  templateUrl: './dashboard-admin-analytics.component.html',
  styleUrls: ['./dashboard-admin-analytics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatSnackBarModule,
                WidgetAgencyMetricsComponent,
                CompanyAgencyFilterComponent,
                DateRangeFilterComponent,
                MatFormFieldModule,
                MatSelectModule,
                MatDatepickerModule,
                MatInputModule,
                MatNativeDateModule,
                MatTooltipModule,
                ReactiveFormsModule,
                ErrorBannerComponent
  ]
})
export class DashboardAdminAnalyticsComponent implements OnInit, OnDestroy {
  dashboardData: any = null;
  loading = true;
  error: string | null = null;
  currentFilters: AnalyticsFilters = {};
  selectedAgencyId: number | null = null;
  selectedDateRange: DateRange | null = null;
  selectedUserId: number | null = null;
  showManualDateInputs = false;
  agencies: any[] = [];
  users: any[] = [];
  dateRangeForm: FormGroup;
  activeDateRange: string | null = null;
  currentUser: any = null;
  isUserFilterDisabled = false;
  selectedTab = 0;

  // Métricas específicas para administradores
  adminMetrics = {
    systemHealth: {
      uptime: 99.9,
      responseTime: 150,
      memoryUsage: 65,
      cpuUsage: 45,
      diskUsage: 78
    },
    securityMetrics: {
      failedLogins: 12,
      suspiciousActivity: 3,
      blockedIPs: 5,
      lastSecurityScan: new Date()
    },
    performanceMetrics: {
      averageLoadTime: 1.2,
      peakConcurrentUsers: 156,
      databaseConnections: 23,
      cacheHitRate: 94.5
    },
    businessMetrics: {
      totalRevenue: 125000,
      monthlyGrowth: 12.5,
      customerSatisfaction: 4.6,
      supportTickets: 45
    }
  };

  private destroy$ = new Subject<void>();

  @ViewChild('userSelect') userSelect!: MatSelect;

  constructor(
    private analyticsService: AnalyticsService,
    private agencyService: AgencyService,
    private defaultAgencyService: DefaultAgencyService,
    private userService: UserService,
    private authService: AuthService,
    private realTimeService: RealTimeAnalyticsService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) {
    this.dateRangeForm = new FormGroup({
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });
  }

  ngOnInit(): void {
    // Obtener la agencia guardada inmediatamente al inicializar
    const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
    if (savedAgencyId !== null) {
      this.selectedAgencyId = savedAgencyId;
    }

    // Suscribirse a los cambios de agencia del servicio compartido
    this.defaultAgencyService.selectedAgency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(agenciaId => {
        if (agenciaId !== null && agenciaId !== this.selectedAgencyId) {
          this.selectedAgencyId = agenciaId;
        }
      });

    // Cargar usuario actual PRIMERO
    this.loadCurrentUser();
    
    // Luego cargar datos del dashboard
    this.loadDashboardData();
    this.loadAgencies();
    this.initializeRealTimeConnection();
    
    // Establecer "Este mes" como período por defecto
    this.setThisMonth();
    
    // Suscribirse a cambios en el formulario de fechas
    this.dateRangeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onDateRangeChange();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getDashboardData(this.currentFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar datos del dashboard de administración';
          this.loading = false;
        }
      });
  }

  private initializeRealTimeConnection(): void {
    this.realTimeService.connect();
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    this.currentFilters = { ...this.currentFilters, agencyId: agencyId || undefined };
    
    // Cargar usuarios para la agencia seleccionada
    this.loadUsers(agencyId);
    
    // Si el usuario es gerente o administrador, seleccionar automáticamente "Todos los usuarios"
    if (this.isManagerOrAdmin(this.currentUser)) {
      this.selectedUserId = null;
      this.currentFilters = { ...this.currentFilters, userId: undefined };
    }
    
    // Actualizar el caché usando seleccionarAgencia (ya actualiza cookie y BehaviorSubject)
    if (agencyId !== null) {
      this.defaultAgencyService.seleccionarAgencia(agencyId);
    }
    
    // COMENTADO: Llamada HTTP deshabilitada para mejorar performance
    // seleccionarAgencia() ya actualiza el caché (cookie y BehaviorSubject)
    // La actualización del servidor se puede hacer de forma asíncrona o en otro momento
    /*
    // Actualizar la agencia predeterminada del usuario
    if (agencyId !== null) {
      this.defaultAgencyService.actualizarAgenciaPredeterminada(agencyId).subscribe({
        next: (success) => {
          if (success) {

          } else {

          }
        },
        error: (error) => {

        }
      });
    }
    */
    
    this.loadDashboardData();
  }

  onDateRangeChange(): void {
    const formValue = this.dateRangeForm.value;
    const dateRange: DateRange = {
      startDate: formValue.startDate,
      endDate: formValue.endDate
    };

    if (this.isValidDateRange(dateRange)) {
      this.selectedDateRange = dateRange;
      this.currentFilters = { 
        ...this.currentFilters, 
        dateRange: dateRange 
      };
      this.loadDashboardData();
    } else {
      this.selectedDateRange = null;
      this.currentFilters = { 
        ...this.currentFilters, 
        dateRange: undefined 
      };
      this.loadDashboardData();
    }
  }

  private isValidDateRange(dateRange: DateRange): boolean {
    if (!dateRange.startDate || !dateRange.endDate) {
      return false;
    }
    return dateRange.startDate <= dateRange.endDate;
  }

  private loadAgencies(): void {
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          this.agencies = agencias;
          
          // Establecer agencia predeterminada DESPUÉS de que las agencias se carguen
          setTimeout(() => {
            // Obtener la agencia guardada
            const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
            
            // Verificar que la agencia guardada existe en la lista
            if (savedAgencyId !== null && this.agencies.some(ag => ag.Id === savedAgencyId)) {
              // La agencia guardada existe, usarla
              this.selectedAgencyId = savedAgencyId;
              this.onAgencyChange(savedAgencyId);
            } else {
              // Si no hay agencia guardada válida, establecer la predeterminada
              this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
                next: (agenciaId) => {
                  if (agenciaId && this.agencies.some(ag => ag.Id === agenciaId)) {
                    this.selectedAgencyId = agenciaId;
                    this.onAgencyChange(agenciaId);
                  }
                },
                error: (error) => {
                }
              });
            }
          }, 150); // Aumentar el timeout para asegurar que las opciones se rendericen
        },
        error: (error) => {
          this.agencies = [];
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private loadUsers(agencyId: number | null): void {
    this.userService.getUsersByAgency(agencyId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
                      if (response.success && response.data && response.data.users) {
                        this.users = response.data.users;
                        
                        // Verificar si debemos aplicar selección automática para administradores
                        if (this.isManagerOrAdmin(this.currentUser)) {
                          setTimeout(() => {
                            // Estrategia diferente: cambiar temporalmente el valor y luego establecerlo a null
                            this.selectedUserId = -1; // Valor temporal que no existe
                            this.changeDetector.detectChanges();
                            
                            setTimeout(() => {
                              this.selectedUserId = null;
                              this.currentFilters = { ...this.currentFilters, userId: undefined };
                              
                              // Forzar detección de cambios para actualizar el dropdown
                              this.changeDetector.detectChanges();
                              
                              // Forzar actualización del mat-select directamente
                              if (this.userSelect) {
                                this.userSelect.writeValue(null);
                              }
                            }, 50);
                          }, 100);
                        }
                      } else {
            this.users = [];
          }
        },
        error: (error) => {
          this.users = [];
          this.snackBar.open('Error al cargar los usuarios', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private loadCurrentUser(): void {
    // Obtener usuario actual del servicio de autenticación
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      // Verificar si el usuario es asesor u operador
      this.isUserFilterDisabled = this.isAdvisorOrOperator(this.currentUser);
      
      if (this.isUserFilterDisabled) {
        // Seleccionar automáticamente el usuario actual
        this.selectedUserId = parseInt(this.currentUser.id);
        this.onUserChange(this.selectedUserId);
      } else if (this.isManagerOrAdmin(this.currentUser)) {
        // Seleccionar automáticamente "Todos los usuarios"
        this.selectedUserId = null;
        this.onUserChange(null);
      }
    }
  }

  private isAdvisorOrOperator(user: any): boolean {
    if (!user || !user.role_name) {
      return false;
    }
    
    const roleName = user.role_name.toLowerCase();
    return roleName.includes('asesor') || roleName.includes('operador');
  }

  private isManagerOrAdmin(user: any): boolean {
    if (!user) {
      return false;
    }
    
    // Verificar por role_id (admin tiene role_id = '7' o '8')
    if (user.role_id === '7' || user.role_id === 7 || user.role_id === '8' || user.role_id === 8) {
      return true;
    }
    
    // Verificar por role_name
    if (user.role_name) {
      const roleName = user.role_name.toLowerCase();
      return roleName.includes('gerente') || roleName.includes('administrador') || roleName.includes('admin');
    }
    
    return false;
  }

  hasAgencies(): boolean {
    return Array.isArray(this.agencies) && this.agencies.length > 0;
  }

  hasUsers(): boolean {
    return Array.isArray(this.users) && this.users.length > 0;
  }

  trackByUserId(index: number, user: any): any {
    return user?.Id || index;
  }

  onUserChange(userId: number | null): void {
    this.selectedUserId = userId;
    this.currentFilters = { ...this.currentFilters, userId: userId || undefined };
    this.loadDashboardData();
  }

  // Método para verificar el estado actual del filtro
  getCurrentUserFilterState(): void {
    // Método para debugging (sin logs)
  }

  clearUserFilter(): void {
    this.selectedUserId = null;
    this.onUserChange(null);
  }

  trackByAgencyId(index: number, agency: any): any {
    return agency?.Id || index;
  }

  clearAgencyFilter(): void {
    this.selectedAgencyId = null;
    this.onAgencyChange(null);
  }

  hasDateRange(): boolean {
    return this.selectedDateRange !== null && 
           this.selectedDateRange.startDate !== null && 
           this.selectedDateRange.endDate !== null;
  }

  toggleManualDateInputs(): void {
    this.showManualDateInputs = !this.showManualDateInputs;
  }

  clearDateRange(): void {
    this.dateRangeForm.patchValue({
      startDate: null,
      endDate: null
    });
    this.selectedDateRange = null;
    this.activeDateRange = null;
    this.currentFilters = { 
      ...this.currentFilters, 
      dateRange: undefined 
    };
    this.loadDashboardData();
  }

  setLast7Days(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    this.dateRangeForm.patchValue({ startDate, endDate });
    this.activeDateRange = '7d';
  }

  setLast30Days(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    this.dateRangeForm.patchValue({ startDate, endDate });
    this.activeDateRange = '30d';
  }

  setLast90Days(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);
    this.dateRangeForm.patchValue({ startDate, endDate });
    this.activeDateRange = '90d';
  }

  setThisMonth(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.dateRangeForm.patchValue({ startDate, endDate });
    this.activeDateRange = 'thisMonth';
  }

  setLastMonth(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    this.dateRangeForm.patchValue({ startDate, endDate });
    this.activeDateRange = 'lastMonth';
  }

  setThisYear(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);
    this.dateRangeForm.patchValue({ startDate, endDate });
    this.activeDateRange = 'thisYear';
  }

  searchData(): void {
    this.loadDashboardData();
  }

  hasAnyFilter(): boolean {
    return this.selectedAgencyId !== null || this.selectedUserId !== null || this.hasDateRange();
  }

  clearAllFilters(): void {
    // Limpiar agencia
    this.selectedAgencyId = null;
    
    // Limpiar usuario
    this.selectedUserId = null;
    
    // Limpiar fechas
    this.dateRangeForm.patchValue({
      startDate: null,
      endDate: null
    });
    this.selectedDateRange = null;
    this.activeDateRange = null;
    
    // Limpiar filtros
    this.currentFilters = {};
    
    // Recargar datos
    this.loadDashboardData();
    
    this.snackBar.open('Todos los filtros han sido limpiados', 'Cerrar', {
      duration: 2000
    });
  }

  onFiltersChange(filters: AnalyticsFilters): void {
    this.currentFilters = filters;
    this.loadDashboardData();
  }

  onExportRequest(event: { format: 'pdf' | 'excel'; filters: AnalyticsFilters }): void {
    this.analyticsService.exportAnalytics(event.format, event.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `admin-analytics-report.${event.format === 'pdf' ? 'pdf' : 'xlsx'}`;
          link.click();
          window.URL.revokeObjectURL(url);
          
          this.snackBar.open(
            `Reporte de administración exportado como ${event.format.toUpperCase()}`,
            'Cerrar',
            { duration: 3000 }
          );
        },
        error: (error) => {
          this.snackBar.open(
            'Error al exportar el reporte de administración',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getHealthStatusColor(metric: number, thresholds: { warning: number; critical: number }): string {
    if (metric >= thresholds.critical) return 'text-red-600';
    if (metric >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  }

  getHealthStatusIcon(metric: number, thresholds: { warning: number; critical: number }): string {
    if (metric >= thresholds.critical) return 'mat:error';
    if (metric >= thresholds.warning) return 'mat:warning';
    return 'mat:check_circle';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}
