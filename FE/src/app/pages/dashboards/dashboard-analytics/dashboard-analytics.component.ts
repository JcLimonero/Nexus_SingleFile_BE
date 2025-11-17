import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaultChartOptions } from '@vex/utils/default-chart-options';
import { AnalyticsService, AnalyticsFilters } from '../../../core/services/analytics.service';
import { WidgetLargeGoalChartComponent } from '../components/widgets/widget-large-goal-chart/widget-large-goal-chart.component';
import { WidgetQuickLineChartComponent } from '../components/widgets/widget-quick-line-chart/widget-quick-line-chart.component';
import { WidgetAssistantComponent } from '../components/widgets/widget-assistant/widget-assistant.component';
import { WidgetAgencyMetricsComponent } from '../components/widgets/widget-agency-metrics/widget-agency-metrics.component';
import { WidgetTrendChartComponent } from '../components/widgets/widget-trend-chart/widget-trend-chart.component';
import { WidgetDistributionMetricsDonutComponent } from '../components/widgets/widget-distribution-metrics-donut/widget-distribution-metrics-donut.component';
import { WidgetProcessDistributionComponent } from '../components/widgets/widget-process-distribution/widget-process-distribution.component';
import { WidgetStatusDistributionComponent } from '../components/widgets/widget-status-distribution/widget-status-distribution.component';
import { WidgetCurrentMonthStatusComponent } from '../components/widgets/widget-current-month-status/widget-current-month-status.component';
import { WidgetPreviousMonthsComponent } from '../components/widgets/widget-previous-months/widget-previous-months.component';
import { WidgetHistoricalStatusComponent } from '../components/widgets/widget-historical-status/widget-historical-status.component';
import { WidgetAdvisorDistributionComponent } from '../components/widgets/widget-advisor-distribution/widget-advisor-distribution.component';
import { WidgetWeeklyChartComponent } from '../components/widgets/widget-weekly-chart/widget-weekly-chart.component';
import { WidgetAttentionPeriodComponent } from '../components/widgets/widget-attention-period/widget-attention-period.component';
import { WidgetCurrentMonthAttentionComponent } from '../components/widgets/widget-current-month-attention/widget-current-month-attention.component';
import { WidgetCurrentMonthLiberatedComponent } from '../components/widgets/widget-current-month-liberated/widget-current-month-liberated.component';
import { WidgetTotalLiberatedComponent } from '../components/widgets/widget-total-liberated/widget-total-liberated.component';
import { WidgetAgencyUsersComponent } from '../components/widgets/widget-agency-users/widget-agency-users.component';
import { WidgetTodayCasesComponent } from '../components/widgets/widget-today-cases/widget-today-cases.component';
import { WidgetMonthlyCasesComponent } from '../components/widgets/widget-monthly-cases/widget-monthly-cases.component';
import { WidgetTotalCasesComponent } from '../components/widgets/widget-total-cases/widget-total-cases.component';
import { AgencyFilterComponent } from '../components/agency-filter/agency-filter.component';
import { DateRangeFilterComponent, DateRange } from '../components/date-range-filter/date-range-filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AgencyService } from '../../../core/services/agency.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
                WidgetAssistantComponent,
                WidgetQuickLineChartComponent,
                WidgetLargeGoalChartComponent,
    WidgetAgencyMetricsComponent,
    WidgetTrendChartComponent,
    WidgetDistributionMetricsDonutComponent,
    WidgetProcessDistributionComponent,
    WidgetStatusDistributionComponent,
    WidgetCurrentMonthStatusComponent,
    WidgetPreviousMonthsComponent,
    WidgetHistoricalStatusComponent,
    WidgetAdvisorDistributionComponent,
    WidgetWeeklyChartComponent,
    WidgetAttentionPeriodComponent,
        WidgetCurrentMonthAttentionComponent,
        WidgetCurrentMonthLiberatedComponent,
        WidgetTotalLiberatedComponent,
        WidgetAgencyUsersComponent,
        WidgetTodayCasesComponent,
        WidgetMonthlyCasesComponent,
        WidgetTotalCasesComponent,
    AgencyFilterComponent,
                DateRangeFilterComponent,
                MatFormFieldModule,
                MatSelectModule,
                MatDatepickerModule,
                MatInputModule,
                MatNativeDateModule,
                MatTooltipModule,
                ReactiveFormsModule
  ]
})
export class DashboardAnalyticsComponent implements OnInit, OnDestroy {
  // Datos del dashboard
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

  private destroy$ = new Subject<void>();
  private filtersChange$ = new Subject<void>();
  private isInitializing = true; // Bandera para evitar doble carga en inicialización

  @ViewChild('userSelect') userSelect!: MatSelect;

  constructor(
    private analyticsService: AnalyticsService,
    private agencyService: AgencyService,
    private defaultAgencyService: DefaultAgencyService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) {
    this.dateRangeForm = new FormGroup({
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });

    // Configurar debounce para evitar llamadas múltiples
    this.setupFiltersDebounce();
  }

  private setupFiltersDebounce(): void {
    this.filtersChange$
      .pipe(
        debounceTime(300), // Esperar 300ms después del último cambio
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadDashboardData();
      });
  }

  ngOnInit(): void {
    // Cargar usuario actual PRIMERO
    this.loadCurrentUser();

    // Cargar agencias (esto establecerá la agencia predeterminada y cargará el dashboard)
    this.loadAgencies();

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

  loadDashboardData(): void {
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
          this.error = 'Error al cargar datos del dashboard';
          this.loading = false;
        }
      });
  }

  onAgencyChange(agencyId: number | null, skipReload: boolean = false): void {
    this.selectedAgencyId = agencyId;
    this.currentFilters = { ...this.currentFilters, agencyId: agencyId || undefined };

    // Cargar usuarios para la agencia seleccionada
    this.loadUsers(agencyId);

    // Si el usuario es gerente o administrador, seleccionar automáticamente "Todos los usuarios"
    if (this.isManagerOrAdmin(this.currentUser)) {
      this.selectedUserId = null;
      this.currentFilters = { ...this.currentFilters, userId: undefined };
    }

    // Solo disparar recarga si no es la inicialización o si se solicita explícitamente
    if (!skipReload) {
      this.filtersChange$.next();
    }
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
      // Solo disparar recarga si no estamos en inicialización
      if (!this.isInitializing) {
        this.filtersChange$.next();
      }
    } else {
      this.selectedDateRange = null;
      this.currentFilters = {
        ...this.currentFilters,
        dateRange: undefined
      };
      // Solo disparar recarga si no estamos en inicialización
      if (!this.isInitializing) {
        this.filtersChange$.next();
      }
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

          // Establecer agencia predeterminada
          setTimeout(() => {
            this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
              next: (agenciaId) => {
                if (agenciaId) {
                  this.selectedAgencyId = agenciaId;
                  // En la inicialización, no recargar el dashboard (skipReload = true)
                  // El dashboard se cargará después cuando se establezcan todos los filtros
                  this.onAgencyChange(agenciaId, this.isInitializing);
                } else {
                  // Si no hay agencia predeterminada, cargar dashboard sin filtros
                  if (this.isInitializing) {
                    this.isInitializing = false;
                    this.filtersChange$.next();
                  }
                }
              },
              error: (error) => {
                // Si falla, intentar seleccionar la primera agencia disponible
                if (this.agencies.length > 0) {
                  const primeraAgencia = this.agencies[0];
                  this.selectedAgencyId = primeraAgencia.Id;
                  this.onAgencyChange(primeraAgencia.Id, this.isInitializing);
                } else {
                  // Si no hay agencias, cargar dashboard sin filtros
                  if (this.isInitializing) {
                    this.isInitializing = false;
                    this.filtersChange$.next();
                  }
                }
              }
            });
          }, 100);
        },
        error: (error) => {
          this.agencies = [];
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', {
            duration: 3000
          });
          // Si estamos en inicialización y hay error, marcar como completa y cargar dashboard
          if (this.isInitializing) {
            this.isInitializing = false;
            setTimeout(() => {
              this.filtersChange$.next();
            }, 200);
          }
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

                              // Si estamos en inicialización, marcar como completa y cargar dashboard una sola vez
                              if (this.isInitializing) {
                                this.isInitializing = false;
                                // Esperar un momento para que todos los filtros estén establecidos
                                setTimeout(() => {
                                  this.filtersChange$.next();
                                }, 100);
                              }
                            }, 50);
                          }, 100);
                        } else {
                          // Si no es admin, también marcar inicialización como completa
                          if (this.isInitializing) {
                            this.isInitializing = false;
                            setTimeout(() => {
                              this.filtersChange$.next();
                            }, 200);
                          }
                        }
                      } else {
            this.users = [];
            // Si estamos en inicialización y no hay usuarios, marcar como completa
            if (this.isInitializing) {
              this.isInitializing = false;
              setTimeout(() => {
                this.filtersChange$.next();
              }, 200);
            }
          }
        },
        error: (error) => {
          this.users = [];
          this.snackBar.open('Error al cargar los usuarios', 'Cerrar', {
            duration: 3000
          });
          // Si estamos en inicialización y hay error, marcar como completa
          if (this.isInitializing) {
            this.isInitializing = false;
            setTimeout(() => {
              this.filtersChange$.next();
            }, 200);
          }
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
        // Seleccionar automáticamente el usuario actual (sin disparar recarga durante inicialización)
        this.selectedUserId = parseInt(this.currentUser.id);
        this.currentFilters = { ...this.currentFilters, userId: this.selectedUserId };
      } else if (this.isManagerOrAdmin(this.currentUser)) {
        // Seleccionar automáticamente "Todos los usuarios" (sin disparar recarga durante inicialización)
        this.selectedUserId = null;
        this.currentFilters = { ...this.currentFilters, userId: undefined };
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

    // Verificar por role_id (admin tiene role_id = '7')
    if (user.role_id === '7' || user.role_id === 7) {
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
    this.filtersChange$.next();
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
    this.filtersChange$.next();
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
    this.filtersChange$.next();

    this.snackBar.open('Todos los filtros han sido limpiados', 'Cerrar', {
      duration: 2000
    });
  }

  onFiltersChange(filters: AnalyticsFilters): void {
    this.currentFilters = filters;
    this.filtersChange$.next();
  }

  onExportRequest(event: { format: 'pdf' | 'excel'; filters: AnalyticsFilters }): void {
    this.analyticsService.exportAnalytics(event.format, event.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `analytics-report.${event.format === 'pdf' ? 'pdf' : 'xlsx'}`;
          link.click();
          window.URL.revokeObjectURL(url);

          this.snackBar.open(
            `Reporte exportado exitosamente como ${event.format.toUpperCase()}`,
            'Cerrar',
            { duration: 3000 }
          );
        },
        error: (error) => {
          this.snackBar.open(
            'Error al exportar el reporte',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
  }

  series: ApexAxisChartSeries = [
    {
      name: 'Subscribers',
      data: [28, 40, 36, 0, 52, 38, 60, 55, 67, 33, 89, 44]
    }
  ];

  salesSeries: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [28, 40, 36, 0, 52, 38, 60, 55, 99, 54, 38, 87]
    }
  ];

  pageViewsSeries: ApexAxisChartSeries = [
    {
      name: 'Page Views',
      data: [405, 800, 200, 600, 105, 788, 600, 204]
    }
  ];

  uniqueUsersSeries: ApexAxisChartSeries = [
    {
      name: 'Unique Users',
      data: [356, 806, 600, 754, 432, 854, 555, 1004]
    }
  ];

  uniqueUsersOptions = defaultChartOptions({
    chart: {
      type: 'area',
      height: 100
    },
    colors: ['#ff9800']
  });
}
