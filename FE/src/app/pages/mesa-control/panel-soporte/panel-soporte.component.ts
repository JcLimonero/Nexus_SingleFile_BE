import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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

  constructor(
    private panelSoporte: PanelSoporteService,
    private defaultAgency: DefaultAgencyService,
    private validacionService: ValidacionService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

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
      this.cdr.markForCheck();
      return;
    }
    if (res?.success && res?.data && res?.data?.expediente) {
      this.diagAgrupado = null;
      this.diagPayload = res.data as Record<string, unknown>;
      this.cdr.markForCheck();
      return;
    }
    this.snack.open(res?.message || 'Sin datos de diagnóstico', 'Cerrar', { duration: 5000 });
    this.cdr.markForCheck();
  }

  private onDiagnosticoError(err: any): void {
    this.loadingDiag = false;
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
    if (this.puedeRelacionarClienteFactura(d)) {
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
   * Expediente en portal sin fila en Client, pero la factura DMS ya trae el nd correcto:
   * se puede reparar con repair-client-relation (view_client_relations).
   */
  puedeRelacionarClienteFactura(d: unknown): boolean {
    if (!d || typeof d !== 'object') {
      return false;
    }
    const p = d as Record<string, unknown>;
    const val = p['validacion'] as Record<string, unknown> | undefined;
    if (!val || val['existeClient'] !== false) {
      return false;
    }
    const motivos = (val['motivosSiNoAparece'] as string[] | undefined) ?? [];
    const motivoCliente = motivos.some((m) =>
      m.includes('No existe registro en Client para File.IdClient')
    );
    if (!motivoCliente) {
      return false;
    }
    const vf = this.vanguardiaFactura(d);
    const nd = vf?.['clienteDms'];
    if (nd === null || nd === undefined || String(nd).trim() === '') {
      return false;
    }
    const exp = p['expediente'] as Record<string, unknown> | undefined;
    return exp != null && exp['id'] != null && exp['idAgency'] != null;
  }

  ndClienteFacturaVanguardia(d: unknown): string {
    const vf = this.vanguardiaFactura(d);
    if (!vf) {
      return '';
    }
    const nd = vf['clienteDms'];
    return nd !== null && nd !== undefined ? String(nd).trim() : '';
  }

  relacionarPedidoConClienteFactura(d: Record<string, unknown>): void {
    const nd = this.ndClienteFacturaVanguardia(d);
    const exp = d['expediente'] as Record<string, unknown> | undefined;
    const idFile = exp != null ? Number(exp['id']) : 0;
    const idAg = exp != null ? Number(exp['idAgency']) : 0;
    if (!nd || !idFile || !idAg) {
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
