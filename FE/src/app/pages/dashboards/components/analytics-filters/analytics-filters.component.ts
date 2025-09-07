import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AnalyticsFilters } from '../../../../core/services/analytics.service';
import { UserService } from '../../../../core/services/user.service';
import { AgencyService } from '../../../../core/services/agency.service';

@Component({
  selector: 'vex-analytics-filters',
  templateUrl: './analytics-filters.component.html',
  styleUrls: ['./analytics-filters.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule
  ]
})
export class AnalyticsFiltersComponent implements OnInit, OnDestroy {
  @Input() showAdvanced = false;
  @Input() compact = false;
  @Output() filtersChange = new EventEmitter<AnalyticsFilters>();
  @Output() exportRequest = new EventEmitter<{ format: 'pdf' | 'excel'; filters: AnalyticsFilters }>();

  filtersForm: FormGroup;
  users: any[] = [];
  agencies: any[] = [];
  processes: any[] = [];
  documentTypes: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private agencyService: AgencyService
  ) {
    this.filtersForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      startDate: [''],
      endDate: [''],
      userId: [''],
      agencyId: [''],
      processId: [''],
      documentTypeId: [''],
      quickFilter: ['']
    });
  }

  private loadInitialData(): void {
    // Cargar usuarios
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (Array.isArray(users)) {
          this.users = users;
        } else if (users && typeof users === 'object') {
          this.users = (users as any).users || (users as any).data || [];
        } else {
          this.users = [];
        }
      });

    // Cargar agencias
    this.agencyService.getAgencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe(agencies => {
        if (Array.isArray(agencies)) {
          this.agencies = agencies;
        } else if (agencies && typeof agencies === 'object') {
          this.agencies = (agencies as any).agencies || (agencies as any).data || [];
        } else {
          this.agencies = [];
        }
      });
  }

  private setupFormSubscriptions(): void {
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.emitFilters(value);
      });
  }

  private emitFilters(formValue: any): void {
    const filters: AnalyticsFilters = {
      startDate: formValue.startDate ? this.formatDate(formValue.startDate) : undefined,
      endDate: formValue.endDate ? this.formatDate(formValue.endDate) : undefined,
      userId: formValue.userId || undefined,
      agencyId: formValue.agencyId || undefined,
      processId: formValue.processId || undefined,
      documentTypeId: formValue.documentTypeId || undefined
    };

    this.filtersChange.emit(filters);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  applyQuickFilter(filter: string): void {
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (filter) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday;
        endDate = yesterday;
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startDate = startOfWeek;
        endDate = new Date(today);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today);
        break;
    }

    if (startDate && endDate) {
      this.filtersForm.patchValue({
        startDate,
        endDate,
        quickFilter: filter
      });
    }
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.filtersChange.emit({});
  }

  exportData(format: 'pdf' | 'excel'): void {
    const filters = this.getCurrentFilters();
    this.exportRequest.emit({ format, filters });
  }

  private getCurrentFilters(): AnalyticsFilters {
    const formValue = this.filtersForm.value;
    return {
      startDate: formValue.startDate ? this.formatDate(formValue.startDate) : undefined,
      endDate: formValue.endDate ? this.formatDate(formValue.endDate) : undefined,
      userId: formValue.userId || undefined,
      agencyId: formValue.agencyId || undefined,
      processId: formValue.processId || undefined,
      documentTypeId: formValue.documentTypeId || undefined
    };
  }

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }
}
