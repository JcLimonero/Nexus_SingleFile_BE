import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'vex-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {
  @Input() selectedDateRange: DateRange | null = null;
  @Output() dateRangeChange = new EventEmitter<DateRange | null>();

  dateRangeForm: FormGroup;
  loading = false;
  showManualDateInputs = false;

  private destroy$ = new Subject<void>();

  constructor() {
    this.dateRangeForm = new FormGroup({
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });
  }

  ngOnInit(): void {
    // Inicializar con el rango seleccionado si existe
    if (this.selectedDateRange) {
      this.dateRangeForm.patchValue({
        startDate: this.selectedDateRange.startDate,
        endDate: this.selectedDateRange.endDate
      });
    }

    // Suscribirse a cambios en el formulario
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

  private onDateRangeChange(): void {
    const formValue = this.dateRangeForm.value;
    const dateRange: DateRange = {
      startDate: formValue.startDate,
      endDate: formValue.endDate
    };

    // Validar que el rango sea válido
    if (this.isValidDateRange(dateRange)) {
      this.selectedDateRange = dateRange;
      this.dateRangeChange.emit(dateRange);
    } else {
      this.selectedDateRange = null;
      this.dateRangeChange.emit(null);
    }
  }

  private isValidDateRange(dateRange: DateRange): boolean {
    if (!dateRange.startDate || !dateRange.endDate) {
      return false;
    }
    return dateRange.startDate <= dateRange.endDate;
  }

  clearDateRange(): void {
    this.dateRangeForm.patchValue({
      startDate: null,
      endDate: null
    });
    this.selectedDateRange = null;
    this.dateRangeChange.emit(null);
  }

  setLast7Days(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
  }

  setLast30Days(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
  }

  setLast90Days(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
  }

  setThisMonth(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
  }

  setLastMonth(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
  }

  setThisYear(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);

    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
  }

  getDateRangeText(): string {
    if (!this.selectedDateRange || !this.selectedDateRange.startDate || !this.selectedDateRange.endDate) {
      return 'Seleccionar rango de fechas';
    }

    const startDate = this.selectedDateRange.startDate.toLocaleDateString('es-ES');
    const endDate = this.selectedDateRange.endDate.toLocaleDateString('es-ES');
    return `${startDate} - ${endDate}`;
  }

  hasDateRange(): boolean {
    return this.selectedDateRange !== null && 
           this.selectedDateRange.startDate !== null && 
           this.selectedDateRange.endDate !== null;
  }

  toggleManualDateInputs(): void {
    this.showManualDateInputs = !this.showManualDateInputs;
  }
}
