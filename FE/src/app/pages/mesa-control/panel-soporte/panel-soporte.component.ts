import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { DefaultAgencyService, Agencia } from '../../../core/services/default-agency.service';
import { PanelSoporteService } from './panel-soporte.service';
import { ValidacionService } from '../validacion/validacion.service';
import {
  EliminarPedidoDialogComponent,
  EliminarPedidoResult
} from '../validacion/eliminar-pedido-dialog/eliminar-pedido-dialog.component';
import {
  CambiarEstatusDialogComponent,
  CambiarEstatusResult
} from '../validacion/cambiar-estatus-dialog/cambiar-estatus-dialog.component';
import {
  CancelarPedidoDialogComponent,
  CancelarPedidoData,
  CancelarPedidoResult
} from '../validacion/cancelar-pedido-dialog/cancelar-pedido-dialog.component';

@Component({
  selector: 'vex-panel-soporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  templateUrl: './panel-soporte.component.html',
  styleUrl: './panel-soporte.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelSoporteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loadingMal = false;
  loadingDup = false;
  agencias: Agencia[] = [];
  loadingAgencias = false;
  selectedAgencyId: number | null = null;
  excluirCancelados = true;

  malColumns: string[] = [
    'id_file',
    'pedido',
    'agencia',
    'motivo',
    'estado',
    'id_client_file',
    'id_cliente_sugerido',
    'nombre_cliente_sugerido',
    'fuente_sugerencia'
  ];
  malData = new MatTableDataSource<Record<string, unknown>>([]);

  dupColumns: string[] = ['pedido', 'agencia', 'copias', 'ids_file', 'ids_estado'];
  dupData = new MatTableDataSource<Record<string, unknown>>([]);

  /** Tab diagnóstico expediente (pedido; agencia opcional vía filtro global; idFile solo uso interno al elegir candidato) */
  diagPedidoStr = '';
  loadingDiag = false;
  diagPayload: Record<string, unknown> | null = null;
  /** Respuesta sin idAgencia: un bloque de diagnóstico por expediente, agrupado por agencia */
  diagAgrupado: {
    idAgencia: number;
    nombreAgencia: string;
    expedientes: Record<string, unknown>[];
  }[] | null = null;
  diagAmbiguo: { candidatos: { id_file: number; IdCurrentState?: number; estado?: string }[] } | null =
    null;

  /** Índice de tabs: 0 Diagnóstico, 1 Análisis cliente, 2 Mal relacionados, 3 Duplicados */
  tabSoporteIndex = 0;

  /** Tab análisis por nd DMS */
  analisisNdStr = '';
  loadingAnalisis = false;
  analisisResult: Record<string, unknown> | null = null;
  analisisPedidosColumns: string[] = [
    'id_file',
    'idOrderTotal',
    'estado',
    'relacionAgenciaOk',
    'recomendaciones',
    'accion'
  ];
  analisisPedidosData = new MatTableDataSource<Record<string, unknown>>([]);
  /** Tablas por agencia (análisis cliente) */
  analisisGrupos: {
    idAgencia: number;
    nombreAgencia: string;
    ds: MatTableDataSource<Record<string, unknown>>;
  }[] = [];

  /** Reparación File.IdClient desde nd de factura Vanguardia */
  loadingRelacionCliente = false;
  /** nd capturado a mano cuando la API no devuelve clienteDMS (clave = Id expediente / file) */
  reparacionNdManual: Record<number, string> = {};

  /** Respuesta singlefileorderslastest por expediente (misma llamada que integración / soporte BE) */
  private readonly vanguardiaProviderToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';
  ordersLastestByFileId: Record<
    number,
    {
      loading: boolean;
      ok?: boolean;
      error?: string;
      httpStatus?: number;
      row?: Record<string, unknown> | null;
      totalRows?: number;
      queryEcho?: {
        idAgency: string;
        order_dms: string;
        connectionstring?: string;
      };
    }
  > = {};

  constructor(
    private http: HttpClient,
    private panelSoporte: PanelSoporteService,
    private defaultAgency: DefaultAgencyService,
    private validacionService: ValidacionService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  trackByIndex = (index: number): number => index;
  trackByAgenciaId = (_: number, ag: Agencia): number => ag.Id;
  trackByGrupoAgencia = (_: number, g: { idAgencia: number }): number => g.idAgencia;
  trackByCandidatoFile = (_: number, c: { id_file: number }): number => c.id_file;

  ngOnInit(): void {
    this.loadingAgencias = true;
    this.cdr.markForCheck();
    this.defaultAgency.obtenerAgencias().pipe(takeUntil(this.destroy$)).subscribe({
      next: (ag) => {
        this.agencias = (ag || []).filter((a) => this.defaultAgency.esAgenciaHabilitada(a));
        this.loadingAgencias = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingAgencias = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarMalRelacionados(): void {
    this.loadingMal = true;
    this.cdr.markForCheck();
    this.panelSoporte
      .malRelacionados({
        idAgencia: this.selectedAgencyId,
        excluirCancelados: this.excluirCancelados,
        limite: 2000
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loadingMal = false;
          if (res?.success && Array.isArray(res?.data?.rows)) {
            this.malData.data = res.data.rows;
          } else {
            this.malData.data = [];
            this.snack.open(res?.message || 'Sin datos', 'Cerrar', { duration: 4000 });
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingMal = false;
          const msg =
            err?.error?.message || err?.message || 'No se pudo cargar el listado (¿permisos o sesión?)';
          this.snack.open(msg, 'Cerrar', { duration: 6000 });
          this.cdr.markForCheck();
        }
      });
  }

  cargarDuplicados(): void {
    this.loadingDup = true;
    this.cdr.markForCheck();
    this.panelSoporte
      .duplicadosPedido({
        idAgencia: this.selectedAgencyId,
        limite: 500
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loadingDup = false;
          if (res?.success && Array.isArray(res?.data?.rows)) {
            this.dupData.data = res.data.rows;
          } else {
            this.dupData.data = [];
            this.snack.open(res?.message || 'Sin datos', 'Cerrar', { duration: 4000 });
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingDup = false;
          const msg =
            err?.error?.message || err?.message || 'No se pudo cargar el listado (¿permisos o sesión?)';
          this.snack.open(msg, 'Cerrar', { duration: 6000 });
          this.cdr.markForCheck();
        }
      });
  }

  ejecutarDiagnostico(): void {
    this.ordersLastestByFileId = {};
    this.diagPayload = null;
    this.diagAgrupado = null;
    this.diagAmbiguo = null;
    const ped = this.diagPedidoStr.trim();
    if (!ped) {
      this.snack.open('Indique el pedido DMS (IdOrderTotal)', 'Cerrar', { duration: 4000 });
      return;
    }
    this.loadingDiag = true;
    this.cdr.markForCheck();
    this.panelSoporte
      .diagnosticoExpediente({
        idPedido: ped,
        idAgencia: this.selectedAgencyId
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => this.onDiagnosticoResponse(res),
        error: (err) => this.onDiagnosticoError(err)
      });
  }

  usarCandidato(idFile: number): void {
    this.ordersLastestByFileId = {};
    this.diagAmbiguo = null;
    this.diagPayload = null;
    this.diagAgrupado = null;
    this.loadingDiag = true;
    this.cdr.markForCheck();
    this.panelSoporte
      .diagnosticoExpediente({ idFile })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => this.onDiagnosticoResponse(res),
        error: (err) => this.onDiagnosticoError(err)
      });
  }

  private onDiagnosticoResponse(res: any): void {
    this.loadingDiag = false;
    if (res?.success && res?.data?.ambiguo === true && Array.isArray(res?.data?.candidatos)) {
      this.diagAgrupado = null;
      this.diagAmbiguo = { candidatos: res.data.candidatos };
      this.snack.open(res.message || 'Varios expedientes; elija uno', 'Cerrar', { duration: 6000 });
      this.cdr.markForCheck();
      return;
    }
    if (
      res?.success &&
      res?.data?.modo === 'multi_agencia' &&
      Array.isArray(res?.data?.agrupadoPorAgencia)
    ) {
      this.diagPayload = null;
      this.diagAmbiguo = null;
      this.diagAgrupado = res.data.agrupadoPorAgencia as {
        idAgencia: number;
        nombreAgencia: string;
        expedientes: Record<string, unknown>[];
      }[];
      const n = this.diagAgrupado.reduce((a, g) => a + (g.expedientes?.length ?? 0), 0);
      if (n > 1) {
        this.snack.open(`Resultados en ${this.diagAgrupado.length} agencia(s), ${n} expediente(s).`, 'Cerrar', {
          duration: 5000
        });
      }
      this.aplicarSeedNdManualEnRespuesta();
      this.prefetchOrdersLastestForDiagnostico();
      this.cdr.markForCheck();
      return;
    }
    if (res?.success && res?.data && res?.data?.expediente) {
      this.diagAgrupado = null;
      this.diagPayload = res.data as Record<string, unknown>;
      this.aplicarSeedNdManualEnRespuesta();
      this.prefetchOrdersLastestForDiagnostico();
      this.cdr.markForCheck();
      return;
    }
    this.snack.open(res?.message || 'Sin datos de diagnóstico', 'Cerrar', { duration: 5000 });
    this.cdr.markForCheck();
  }

  private onDiagnosticoError(err: any): void {
    this.loadingDiag = false;
    this.ordersLastestByFileId = {};
    this.diagPayload = null;
    this.diagAgrupado = null;
    const msg =
      err?.error?.message || err?.message || 'Error al consultar diagnóstico (¿permisos o sesión?)';
    this.snack.open(msg, 'Cerrar', { duration: 6000 });
    this.cdr.markForCheck();
  }

  diagBool(v: unknown): boolean {
    return v === true || v === 1 || v === '1';
  }

  /**
   * Incidencias en un bloque de diagnóstico (validación, Vanguardia o acción de reparación).
   * Usado en cabeceras colapsadas multi-agencia.
   */
  diagBloqueTieneProblemas(d: unknown): boolean {
    if (!d || typeof d !== 'object') {
      return false;
    }
    const p = d as Record<string, unknown>;
    const val = p['validacion'] as Record<string, unknown> | undefined;
    if (val && val['apareceriaEnListadoValidacion'] === false) {
      return true;
    }
    const vgd = p['vanguardia'] as Record<string, unknown> | undefined;
    if (vgd && vgd['ok'] === false) {
      return true;
    }
    if (
      this.puedeRelacionarClienteFactura(d) ||
      this.puedeRelacionarClienteManual(d)
    ) {
      return true;
    }
    return false;
  }

  diagGrupoTieneProblemas(grp: { expedientes: Record<string, unknown>[] }): boolean {
    return grp.expedientes.some((e) => this.diagBloqueTieneProblemas(e));
  }

  /** Objeto `factura` de Vanguardia para la plantilla de diagnóstico */
  vanguardiaFactura(d: unknown): Record<string, unknown> | null {
    if (!d || typeof d !== 'object') {
      return null;
    }
    const vgd = (d as Record<string, unknown>)['vanguardia'] as Record<string, unknown> | undefined;
    if (!vgd || !vgd['ok']) {
      return null;
    }
    const f = vgd['factura'];
    return f && typeof f === 'object' ? (f as Record<string, unknown>) : null;
  }

  /**
   * Falta fila en Client con el motivo habitual; expediente con id y agencia.
   * Base para reparar con nd de factura o con nd manual.
   */
  sinClientFilaMotivoReparacion(d: unknown): boolean {
    if (!d || typeof d !== 'object') {
      return false;
    }
    const p = d as Record<string, unknown>;
    const val = p['validacion'] as Record<string, unknown> | undefined;
    if (!val || val['existeClient'] !== false) {
      return false;
    }
    const motivos = (val['motivosSiNoAparece'] as string[] | undefined) ?? [];
    if (
      !motivos.some((m) => m.includes('No existe registro en Client para File.IdClient'))
    ) {
      return false;
    }
    const exp = p['expediente'] as Record<string, unknown> | undefined;
    return exp != null && exp['id'] != null && exp['idAgency'] != null;
  }

  /**
   * Falta Client_Total_Relation para el HeaderClient del expediente y la agencia (CTR en diagnóstico).
   * Requiere Client y HeaderClient; el nd registra IdTotalDealer en CTR.
   */
  ctrFaltanteReparacion(d: unknown): boolean {
    if (!d || typeof d !== 'object') {
      return false;
    }
    const p = d as Record<string, unknown>;
    const val = p['validacion'] as Record<string, unknown> | undefined;
    if (!val || val['existeRelacionClienteAgencia'] !== false) {
      return false;
    }
    if (val['existeClient'] === false || val['joinHeaderClientOk'] !== true) {
      return false;
    }
    const motivos = (val['motivosSiNoAparece'] as string[] | undefined) ?? [];
    if (!motivos.some((m) => m.includes('Client_Total_Relation'))) {
      return false;
    }
    const exp = p['expediente'] as Record<string, unknown> | undefined;
    return exp != null && exp['id'] != null && exp['idAgency'] != null;
  }

  /** Solo CTR (sin el caso «no existe Client»). */
  esReparacionSoloCtr(d: unknown): boolean {
    return this.ctrFaltanteReparacion(d) && !this.sinClientFilaMotivoReparacion(d);
  }

  /**
   * Reparación posible con nd devuelto por Vanguardia (factura DMS).
   */
  puedeRelacionarClienteFactura(d: unknown): boolean {
    return (
      (this.sinClientFilaMotivoReparacion(d) || this.ctrFaltanteReparacion(d)) &&
      String(this.ndClienteFacturaVanguardia(d)).trim() !== ''
    );
  }

  /**
   * Mismo escenario de reparación, pero la API no devolvió nd en factura: el usuario lo indica.
   */
  puedeRelacionarClienteManual(d: unknown): boolean {
    return (
      (this.sinClientFilaMotivoReparacion(d) || this.ctrFaltanteReparacion(d)) &&
      String(this.ndClienteFacturaVanguardia(d)).trim() === ''
    );
  }

  /** Id expediente (file) en un bloque de diagnóstico — para inputs por expediente. */
  idExpedienteDiag(d: Record<string, unknown>): number {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    return exp != null && exp['id'] != null ? Number(exp['id']) : 0;
  }

  getNdManual(idFile: number): string {
    return this.reparacionNdManual[idFile] ?? '';
  }

  setNdManual(idFile: number, value: string): void {
    if (!idFile) {
      return;
    }
    this.reparacionNdManual[idFile] = value;
    this.cdr.markForCheck();
  }

  /**
   * Nd sugerido para reparación: CTR de la agencia del expediente, o primer IdTotalDealer en CTR del cliente.
   */
  ndSugeridoDesdeRelacion(d: Record<string, unknown>): string {
    const rel = d['relacion'] as Record<string, unknown> | undefined;
    if (!rel) {
      return '';
    }
    const nd = rel['ndEnRelacionAgencia'];
    if (nd !== null && nd !== undefined && String(nd).trim() !== '') {
      return String(nd).trim();
    }
    const todas = rel['todasRelacionesCliente'] as Record<string, unknown>[] | undefined;
    if (!Array.isArray(todas)) {
      return '';
    }
    for (const r of todas) {
      if (!r || typeof r !== 'object') {
        continue;
      }
      const row = r as Record<string, unknown>;
      const idT = row['IdTotalDealer'];
      if (idT !== null && idT !== undefined && String(idT).trim() !== '') {
        return String(idT).trim();
      }
    }
    return '';
  }

  private aplicarSeedNdManualEnRespuesta(): void {
    if (this.diagPayload) {
      this.seedNdManualDesdeRelacion(this.diagPayload);
    }
    if (this.diagAgrupado) {
      for (const g of this.diagAgrupado) {
        for (const bloque of g.expedientes) {
          this.seedNdManualDesdeRelacion(bloque);
        }
      }
    }
  }

  /** Rellena el input de nd manual si sigue vacío. */
  private seedNdManualDesdeRelacion(d: Record<string, unknown>): void {
    const id = this.idExpedienteDiag(d);
    if (!id || this.getNdManual(id).trim() !== '') {
      return;
    }
    const sug = this.ndSugeridoDesdeRelacion(d);
    if (sug !== '') {
      this.reparacionNdManual[id] = sug;
    }
  }

  ndClienteFacturaVanguardia(d: unknown): string {
    const vf = this.vanguardiaFactura(d);
    if (!vf) {
      return '';
    }
    const nd = vf['clienteDms'];
    return nd !== null && nd !== undefined ? String(nd).trim() : '';
  }

  private prefetchOrdersLastestForDiagnostico(): void {
    if (this.diagPayload) {
      this.loadOrdersLastestForBloque(this.diagPayload);
    }
    if (this.diagAgrupado) {
      for (const g of this.diagAgrupado) {
        for (const bloque of g.expedientes) {
          this.loadOrdersLastestForBloque(bloque);
        }
      }
    }
  }

  /**
   * GET singlefileorderslastest con idAgency DMS, order_dms y opcional connectionstring (sin customerDMS).
   */
  loadOrdersLastestForBloque(d: Record<string, unknown>, force = false): void {
    const idFile = this.idExpedienteDiag(d);
    if (!idFile) {
      return;
    }
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    if (!exp) {
      return;
    }
    const idAgencyDms =
      exp['idAgencyDms'] != null && String(exp['idAgencyDms']).trim() !== ''
        ? String(exp['idAgencyDms']).trim()
        : '';
    const orderDms =
      exp['idOrderTotal'] != null && String(exp['idOrderTotal']).trim() !== ''
        ? String(exp['idOrderTotal']).trim()
        : '';
    const agencyConnection =
      exp['agencyConnection'] != null && String(exp['agencyConnection']).trim() !== ''
        ? String(exp['agencyConnection']).trim()
        : '';

    const prev = this.ordersLastestByFileId[idFile];
    if (prev?.loading) {
      return;
    }

    if (!idAgencyDms || !orderDms) {
      this.ordersLastestByFileId[idFile] = {
        loading: false,
        ok: false,
        error: 'Falta idAgency DMS (catálogo) o pedido (IdOrderTotal) en el expediente.'
      };
      this.cdr.markForCheck();
      return;
    }

    const echo = {
      idAgency: idAgencyDms,
      order_dms: orderDms,
      ...(agencyConnection ? { connectionstring: agencyConnection } : {})
    };
    if (
      !force &&
      prev?.ok &&
      prev.queryEcho &&
      prev.queryEcho.idAgency === echo.idAgency &&
      prev.queryEcho.order_dms === echo.order_dms &&
      (prev.queryEcho.connectionstring || '') === (echo.connectionstring || '')
    ) {
      return;
    }

    this.ordersLastestByFileId[idFile] = { loading: true, queryEcho: echo };
    this.cdr.markForCheck();

    let params = new HttpParams()
      .set('idAgency', idAgencyDms)
      .set('order_dms', orderDms)
      .set('perpage', '50');
    if (agencyConnection) {
      params = params.set('connectionstring', agencyConnection);
    }

    this.http
      .get<unknown>(environment.vanguardia.ordersApiUrl, {
        params,
        headers: {
          'X-Provider-Token': this.vanguardiaProviderToken,
          Accept: 'application/json',
          'Accept-Encoding': 'identity'
        }
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const parsed = this.parseVanguardiaOrdersEnvelope(response);
          if (!parsed) {
            this.ordersLastestByFileId[idFile] = {
              loading: false,
              ok: false,
              error: 'Respuesta inválida de singlefileorderslastest.',
              queryEcho: echo
            };
            this.cdr.markForCheck();
            return;
          }
          const row = this.pickOrderRowFromParsed(parsed.rows, orderDms, idAgencyDms);
          this.ordersLastestByFileId[idFile] = {
            loading: false,
            ok: true,
            row: row ?? null,
            totalRows: parsed.totalRows,
            queryEcho: echo
          };
          this.cdr.markForCheck();
        },
        error: (err: unknown) => {
          const httpErr = err as { status?: number; message?: string; error?: { message?: string } };
          const msg =
            httpErr?.error?.message ||
            httpErr?.message ||
            'Error al consultar singlefileorderslastest';
          this.ordersLastestByFileId[idFile] = {
            loading: false,
            ok: false,
            error: msg,
            httpStatus: typeof httpErr?.status === 'number' ? httpErr.status : undefined,
            queryEcho: echo
          };
          this.cdr.markForCheck();
        }
      });
  }

  reconsultarOrdersLastest(d: Record<string, unknown>): void {
    this.loadOrdersLastestForBloque(d, true);
  }

  ordersLastestState(d: Record<string, unknown>): (typeof this.ordersLastestByFileId)[number] | undefined {
    const id = this.idExpedienteDiag(d);
    return id ? this.ordersLastestByFileId[id] : undefined;
  }

  ordersLastestLoading(d: Record<string, unknown>): boolean {
    return this.ordersLastestState(d)?.loading === true;
  }

  ordersLastestError(d: Record<string, unknown>): string {
    const e = this.ordersLastestState(d)?.error;
    return e ? String(e) : '';
  }

  ordersLastestRow(d: Record<string, unknown>): Record<string, unknown> | null {
    const r = this.ordersLastestState(d)?.row;
    return r && typeof r === 'object' ? r : null;
  }

  ordersLastestQuery(d: Record<string, unknown>): {
    idAgency: string;
    order_dms: string;
    connectionstring?: string;
  } | null {
    const q = this.ordersLastestState(d)?.queryEcho;
    return q ?? null;
  }

  ordersLastestNdFromRow(row: Record<string, unknown>): string {
    const keys = ['ndClientDMS', 'ndCliente', 'customerDMS', 'IdTotalDealer', 'nd_dms', 'nd'];
    for (const k of keys) {
      const v = row[k];
      if (v !== null && v !== undefined && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
    return '';
  }

  private parseVanguardiaOrdersEnvelope(response: unknown): {
    rows: Record<string, unknown>[];
    totalRows: number;
    totalPages: number;
    page: number;
  } | null {
    if (Array.isArray(response)) {
      return {
        rows: response as Record<string, unknown>[],
        totalRows: response.length,
        totalPages: 1,
        page: 1
      };
    }
    if (!response || typeof response !== 'object') {
      return null;
    }
    const r = response as Record<string, unknown>;
    if (r['status'] !== undefined && Number(r['status']) !== 200) {
      return null;
    }
    const payload = r['data'];
    if (!payload) {
      return null;
    }
    if (Array.isArray(payload)) {
      return {
        rows: payload as Record<string, unknown>[],
        totalRows: payload.length,
        totalPages: 1,
        page: 1
      };
    }
    if (typeof payload === 'object' && payload !== null) {
      const p = payload as Record<string, unknown>;
      if (Array.isArray(p['data'])) {
        const rows = p['data'] as Record<string, unknown>[];
        return {
          rows,
          totalRows: Number(p['total_rows']) || rows.length,
          totalPages: Math.max(1, Number(p['total_pages']) || 1),
          page: Number(p['page']) || 1
        };
      }
      if (Array.isArray(p['orders'])) {
        const rows = p['orders'] as Record<string, unknown>[];
        return {
          rows,
          totalRows: rows.length,
          totalPages: 1,
          page: 1
        };
      }
    }
    return null;
  }

  private pickOrderRowFromParsed(
    rows: Record<string, unknown>[],
    orderDms: string,
    idAgencyDms: string
  ): Record<string, unknown> | null {
    const idNorm = idAgencyDms.trim();
    const odNorm = orderDms.trim();
    let hasAgency = false;
    const sameAg: Record<string, unknown>[] = [];
    for (const r of rows) {
      const ia = r['idAgency'];
      if (ia !== null && ia !== undefined && String(ia).trim() !== '') {
        hasAgency = true;
        if (String(ia).trim() === idNorm) {
          sameAg.push(r);
        }
      }
    }
    const pool = hasAgency && sameAg.length ? sameAg : rows;
    const candidates: Record<string, unknown>[] = [];
    for (const r of pool) {
      const od = r['order_dms'] ?? r['orderDMS'] ?? r['numeroPedido'];
      if (od !== null && od !== undefined && String(od).trim() === odNorm) {
        candidates.push(r);
      }
    }
    const pick = candidates.length ? candidates[0] : pool[0];
    return pick ?? null;
  }

  /**
   * @param ndManual si viene definido (incluso cadena vacía), se usa en lugar del nd de factura Vanguardia.
   */
  relacionarPedidoConCliente(d: Record<string, unknown>, ndManual?: string): void {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    const idFile = exp != null ? Number(exp['id']) : 0;
    const idAg = exp != null ? Number(exp['idAgency']) : 0;
    const ndFactura = this.ndClienteFacturaVanguardia(d);
    const nd =
      ndManual !== undefined ? String(ndManual).trim() : ndFactura;
    if (!idFile || !idAg) {
      return;
    }
    if (!nd) {
      this.snack.open('Indique el número de cliente DMS (nd)', 'Cerrar', { duration: 4000 });
      this.cdr.markForCheck();
      return;
    }
    const ok = confirm(
      `¿Relacionar el expediente #${idFile} con el cliente DMS ${nd}?\n\n` +
        'Se usará la misma lógica que «reparar relación»: se buscará el Client.Id en view_client_relations ' +
        'para este nd y agencia, y se actualizará File.IdClient.'
    );
    if (!ok) {
      return;
    }
    this.loadingRelacionCliente = true;
    this.cdr.markForCheck();
    this.panelSoporte
      .repairClientRelation({ ndDMS: nd, idAgency: idAg, idExpediente: idFile })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loadingRelacionCliente = false;
          if (res?.success) {
            delete this.reparacionNdManual[idFile];
            this.snack.open(res?.message || 'Relación de cliente actualizada', 'Cerrar', { duration: 5000 });
            if (this.diagPedidoStr.trim() !== '') {
              this.ejecutarDiagnostico();
            } else {
              this.refrescarDiagnosticoPorIdFile(idFile);
            }
          } else {
            this.snack.open(res?.message || 'No se pudo reparar la relación', 'Cerrar', { duration: 7000 });
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.loadingRelacionCliente = false;
          const msg =
            err?.error?.message || err?.message || 'Error al reparar la relación (¿permisos o sesión?)';
          this.snack.open(msg, 'Cerrar', { duration: 8000 });
          this.cdr.markForCheck();
        }
      });
  }

  relacionarPedidoConClienteFactura(d: Record<string, unknown>): void {
    this.relacionarPedidoConCliente(d);
  }

  relacionarPedidoConClienteNdManual(d: Record<string, unknown>): void {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    const idFile = exp != null ? Number(exp['id']) : 0;
    this.relacionarPedidoConCliente(d, this.getNdManual(idFile));
  }

  /**
   * No mostrar cancelar si ya está liberado o cancelado (alineado con listado de validación).
   */
  puedeCancelarPedidoDiag(d: Record<string, unknown>): boolean {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    if (!exp || exp['id'] == null) {
      return false;
    }
    const est = String(exp['estado'] ?? '').toLowerCase();
    if (est.includes('liberado')) {
      return false;
    }
    if (est.includes('cancel')) {
      return false;
    }
    const idEst = Number(exp['idEstado']);
    if (idEst === 5) {
      return false;
    }
    return true;
  }

  /** Mismo flujo que Validación: motivo + comentario y POST clients-validation/cancelar-pedido */
  abrirCancelarPedido(d: Record<string, unknown>): void {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    const cli = d['cliente'] as Record<string, unknown> | undefined;
    if (!exp || exp['id'] == null) {
      return;
    }
    const idFile = Number(exp['id']);
    const clienteLike = {
      cliente: (cli?.['nombre'] as string) || '—',
      ndPedido: exp['idOrderTotal'],
      proceso: exp['proceso'] ?? '—',
      fase: exp['estado'] ?? '—'
    };
    const dialogData: CancelarPedidoData = { cliente: clienteLike };
    const ref = this.dialog.open(CancelarPedidoDialogComponent, {
      width: 'min(600px, 100vw)',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: true
    });
    ref.afterClosed().subscribe((result: CancelarPedidoResult | undefined) => {
      if (!result) {
        return;
      }
      this.validacionService.cancelarPedido(idFile, result.motivoId, result.comentario).subscribe({
        next: () => {
          this.snack.open('Pedido cancelado correctamente', 'Cerrar', { duration: 5000 });
          if (this.diagPedidoStr.trim() !== '') {
            this.ejecutarDiagnostico();
          } else {
            this.refrescarDiagnosticoPorIdFile(idFile);
          }
        },
        error: (err: Error & { error?: { message?: string } }) => {
          const msg =
            err?.message ||
            err?.error?.message ||
            'No se pudo cancelar el pedido';
          this.snack.open(msg, 'Cerrar', { duration: 7000 });
          this.cdr.markForCheck();
        }
      });
    });
  }

  /** Abre el mismo flujo que Validación: confirmar y DELETE clients-validation/eliminar-pedido */
  abrirEliminarPedido(d: Record<string, unknown>): void {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    const cli = d['cliente'] as Record<string, unknown> | undefined;
    if (!exp || exp['id'] == null) {
      return;
    }
    const idFile = Number(exp['id']);
    const clienteLike = {
      cliente: (cli?.['nombre'] as string) || '—',
      ndPedido: exp['idOrderTotal'],
      proceso: exp['proceso'] ?? '—',
      fase: exp['estado'] ?? '—'
    };
    const ref = this.dialog.open(EliminarPedidoDialogComponent, {
      width: 'min(600px, 100vw)',
      maxWidth: '95vw',
      data: { cliente: clienteLike },
      disableClose: true
    });
    ref.afterClosed().subscribe((result: EliminarPedidoResult | undefined) => {
      if (result?.confirmado) {
        this.validacionService.eliminarPedido(idFile).subscribe({
          next: () => {
            this.snack.open('Pedido eliminado correctamente', 'Cerrar', { duration: 5000 });
            this.diagPayload = null;
            this.diagAgrupado = null;
            this.cdr.markForCheck();
          },
          error: (err) => {
            const msg =
              err?.error?.message || err?.message || 'No se pudo eliminar el pedido';
            this.snack.open(msg, 'Cerrar', { duration: 7000 });
          }
        });
      }
    });
  }

  /** Mismo flujo que Validación: diálogo de fase y PUT cambiar-estatus */
  abrirCambiarFase(d: Record<string, unknown>): void {
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    const cli = d['cliente'] as Record<string, unknown> | undefined;
    if (!exp || exp['id'] == null) {
      return;
    }
    const idFile = Number(exp['id']);
    const clienteLike = {
      idFile,
      IdCurrentState: exp['idEstado'],
      ndPedido: exp['idOrderTotal'],
      proceso: exp['proceso'] ?? '—',
      fase: exp['estado'] ?? '—',
      cliente: (cli?.['nombre'] as string) || '—'
    };
    const ref = this.dialog.open(CambiarEstatusDialogComponent, {
      width: 'min(600px, 100vw)',
      maxWidth: '95vw',
      data: { cliente: clienteLike },
      disableClose: true
    });
    ref.afterClosed().subscribe((result: CambiarEstatusResult | undefined) => {
      if (!result?.nuevoIdCurrentState) {
        return;
      }
      this.validacionService.cambiarEstatus(idFile, result.nuevoIdCurrentState).subscribe({
        next: () => {
          this.snack.open(
            `Fase actualizada a «${result.nuevoEstatus}»`,
            'Cerrar',
            { duration: 5000 }
          );
          this.refrescarDiagnosticoPorIdFile(idFile);
        },
        error: (err) => {
          let errorMessage = 'Error al cambiar la fase';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          this.snack.open(errorMessage, 'Cerrar', { duration: 7000 });
        }
      });
    });
  }

  private refrescarDiagnosticoPorIdFile(idFile: number): void {
    this.loadingDiag = true;
    this.cdr.markForCheck();
    this.panelSoporte
      .diagnosticoExpediente({ idFile })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: unknown) => this.onDiagnosticoResponse(res as { success?: boolean; data?: unknown }),
        error: (err) => this.onDiagnosticoError(err)
      });
  }

  ejecutarAnalisisCliente(): void {
    const nd = this.analisisNdStr.trim();
    if (!nd) {
      this.snack.open('Indique el número de cliente DMS (IdTotalDealer)', 'Cerrar', { duration: 4000 });
      return;
    }
    this.loadingAnalisis = true;
    this.analisisResult = null;
    this.analisisPedidosData.data = [];
    this.analisisGrupos = [];
    this.cdr.markForCheck();
    this.panelSoporte
      .analisisClienteDms(nd, this.selectedAgencyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loadingAnalisis = false;
          if (res?.success && res?.data) {
            this.analisisResult = res.data as Record<string, unknown>;
            const rows = Array.isArray(res.data.pedidos) ? res.data.pedidos : [];
            this.analisisPedidosData.data = rows as Record<string, unknown>[];
            const porAg = Array.isArray(res.data.pedidosPorAgencia) ? res.data.pedidosPorAgencia : [];
            this.analisisGrupos = porAg.map((g: { idAgencia: number; nombreAgencia: string; pedidos: unknown[] }) => ({
              idAgencia: g.idAgencia,
              nombreAgencia: g.nombreAgencia,
              ds: new MatTableDataSource<Record<string, unknown>>(
                (Array.isArray(g.pedidos) ? g.pedidos : []) as Record<string, unknown>[]
              )
            }));
            if (this.analisisGrupos.length === 0 && rows.length) {
              const map = new Map<number, Record<string, unknown>[]>();
              for (const r of rows as Record<string, unknown>[]) {
                const ida = Number(r['idAgency'] ?? 0);
                if (!map.has(ida)) {
                  map.set(ida, []);
                }
                map.get(ida)!.push(r);
              }
              this.analisisGrupos = Array.from(map.entries()).map(([idAgencia, pedidos]) => ({
                idAgencia,
                nombreAgencia: String((pedidos[0] as Record<string, unknown>)['agencia'] ?? ''),
                ds: new MatTableDataSource(pedidos)
              }));
            }
            if (res.message && res.message !== 'OK') {
              this.snack.open(res.message, 'Cerrar', { duration: 6000 });
            }
          } else {
            this.snack.open(res?.message || 'Sin datos', 'Cerrar', { duration: 5000 });
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingAnalisis = false;
          const msg =
            err?.error?.message || err?.message || 'Error al analizar cliente (¿permisos o sesión?)';
          this.snack.open(msg, 'Cerrar', { duration: 6000 });
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Cambia al tab Diagnóstico, rellena agencia + pedido y ejecuta la consulta detallada.
   */
  irADiagnosticoDesdeAnalisis(row: Record<string, unknown>): void {
    const ped = row['idOrderTotal'];
    const idAg = row['idAgency'] as number | undefined;
    if (ped == null || idAg == null) {
      return;
    }
    this.diagPedidoStr = String(ped).trim();
    this.selectedAgencyId = idAg;
    this.tabSoporteIndex = 0;
    this.diagPayload = null;
    this.diagAgrupado = null;
    this.diagAmbiguo = null;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.ejecutarDiagnostico();
    }, 0);
  }
}
