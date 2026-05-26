import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';

interface CompanyRow { id: string | number; name: string }
interface AgencyRow { id: string | number; name: string; id_company: string | number | null }

/**
 * Filtro 2 niveles: razón social (company) → agencia.
 *
 * Reemplaza el patrón duplicado en 15+ componentes donde había un solo
 * `<mat-select>` de agencia sin filtro previo. La razón social se
 * selecciona primero y filtra qué agencias aparecen.
 *
 * Reutiliza DefaultAgencyService (cache localStorage) para no hacer
 * round-trip extra cuando el usuario ya navegó con una agencia activa.
 *
 *   <app-company-agency-filter
 *     [selectedAgencyId]="myId"
 *     (agencyChange)="onAgencyChange($event)">
 *   </app-company-agency-filter>
 */
@Component({
  selector: 'app-company-agency-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="company-agency-filter" style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;">
      <mat-form-field appearance="outline" [style.min-width.px]="200">
        <mat-label>Razón Social</mat-label>
        <mat-select [ngModel]="selectedCompanyId()" (ngModelChange)="onCompanyChange($event)"
                    [disabled]="loading()">
          <mat-option [value]="null">— Todas —</mat-option>
          <mat-option *ngFor="let c of companies()" [value]="c.id">
            {{ c.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" [style.min-width.px]="220">
        <mat-label>Agencia</mat-label>
        <mat-select [ngModel]="selectedAgencyIdInternal()" (ngModelChange)="onAgencySelectionChange($event)"
                    [disabled]="loading() || !filteredAgencies().length">
          <mat-option [value]="null" *ngIf="allowEmpty">— Sin agencia —</mat-option>
          <mat-option *ngFor="let a of filteredAgencies()" [value]="a.id">
            {{ a.name }}
          </mat-option>
        </mat-select>
        <mat-hint *ngIf="!loading() && !filteredAgencies().length">
          No hay agencias para esta razón social
        </mat-hint>
      </mat-form-field>

      <mat-spinner *ngIf="loading()" diameter="20" style="margin-top:18px;"></mat-spinner>
    </div>
  `,
})
export class CompanyAgencyFilterComponent implements OnInit, OnChanges, OnDestroy {
  /** Agencia preseleccionada — pre-selecciona la razón social correspondiente. */
  @Input() selectedAgencyId: number | string | null = null;

  /** Si true, agrega opción "Sin agencia" (null). Default false. */
  @Input() allowEmpty: boolean = false;

  /** Emite al cambiar la agencia. null si se limpia o se cambia la company a una sin agencias. */
  @Output() agencyChange = new EventEmitter<number | null>();

  /** Emite la company seleccionada (útil si el parent quiere mostrar info adicional). */
  @Output() companyChange = new EventEmitter<number | null>();

  // ===== State =====
  loading = signal(true);
  companies = signal<CompanyRow[]>([]);
  agencies = signal<AgencyRow[]>([]);
  selectedCompanyId = signal<string | number | null>(null);
  selectedAgencyIdInternal = signal<string | number | null>(null);

  filteredAgencies = computed(() => {
    const cid = this.selectedCompanyId();
    const list = this.agencies();
    if (cid === null || cid === undefined) return list;
    return list.filter((a) => String(a.id_company) === String(cid));
  });

  private destroy$ = new Subject<void>();

  constructor(
    private defaultAgencyService: DefaultAgencyService,
    private http: HttpClient,
    private apiBase: ApiBaseService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAgencyId'] && !changes['selectedAgencyId'].firstChange) {
      this.syncFromExternalAgencyId();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== Load =====

  private loadData(): void {
    this.loading.set(true);

    // 1. Companies vía API directo (no hay servicio cache aparte)
    this.http.get<any>(this.apiBase.buildApiUrl('company'))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          const list: CompanyRow[] = (resp?.data?.companies ?? [])
            .filter((c: any) => String(c.enabled ?? 1) === '1')
            .map((c: any) => ({ id: c.id, name: c.name }));
          this.companies.set(list);
          this.maybeFinishLoading();
        },
        error: () => {
          this.companies.set([]);
          this.maybeFinishLoading();
        },
      });

    // 2. Agencies vía DefaultAgencyService (cache localStorage)
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: any[]) => {
          const normalized: AgencyRow[] = (list ?? [])
            .filter((a: any) => String(a.enabled ?? a.Enabled ?? 1) === '1')
            .map((a: any) => ({
              id: a.id ?? a.Id ?? a.IdAgency,
              name: a.name ?? a.Name,
              id_company: a.id_company ?? a.IdCompany ?? null,
            }));
          this.agencies.set(normalized);
          this.maybeFinishLoading();
        },
        error: () => {
          this.agencies.set([]);
          this.maybeFinishLoading();
        },
      });
  }

  private companiesLoaded = false;
  private agenciesLoaded = false;
  private maybeFinishLoading(): void {
    if (this.companies().length || this.agencies().length) {
      // Al menos una respuesta llegó — sincronizar y dejar de mostrar spinner
      this.syncFromExternalAgencyId();
      this.loading.set(false);
    }
  }

  /** Si el parent pasa selectedAgencyId, derivar la company y pre-seleccionar. */
  private syncFromExternalAgencyId(): void {
    const extId = this.selectedAgencyId;
    if (extId === null || extId === undefined) {
      this.selectedAgencyIdInternal.set(null);
      return;
    }
    const ag = this.agencies().find((a) => String(a.id) === String(extId));
    if (ag) {
      this.selectedCompanyId.set(ag.id_company);
      this.selectedAgencyIdInternal.set(ag.id);
    }
  }

  // ===== Event handlers =====

  onCompanyChange(companyId: string | number | null): void {
    this.selectedCompanyId.set(companyId);
    this.companyChange.emit(companyId === null ? null : Number(companyId));

    // Auto-resetear la agencia si la actual ya no pertenece a la nueva company
    const currentAgency = this.agencies().find((a) => String(a.id) === String(this.selectedAgencyIdInternal()));
    if (currentAgency && companyId !== null && String(currentAgency.id_company) !== String(companyId)) {
      this.selectedAgencyIdInternal.set(null);
      this.agencyChange.emit(null);
    }
  }

  onAgencySelectionChange(agencyId: string | number | null): void {
    this.selectedAgencyIdInternal.set(agencyId);
    this.agencyChange.emit(agencyId === null ? null : Number(agencyId));
  }
}
