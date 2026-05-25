import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs/operators';
import { PhaseService, phaseSlug, PhaseRow } from '../../../core/services/phase.service';

/**
 * Generic phase-by-slug page. Route: /fases/:slug.
 *
 * Resolves the slug against the current user's active phase list (cached in
 * PhaseService) and renders the standard phase shell. Shows the
 * "Cargar comprobante de pago" CTA only when the resolved phase has
 * requires_payment_voucher = 1.
 *
 * This page is INTENTIONALLY thin for the MVP — the real per-phase table of
 * files lives in the existing /procesos/integracion|liquidacion|liberacion
 * components, which keep working unchanged. As we validate the generic page
 * we'll migrate the table logic here and retire the legacy routes.
 */
@Component({
  selector: 'app-process-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    @if (loading()) {
      <div style="text-align: center; padding: 48px;">
        <mat-spinner diameter="36" style="margin: 0 auto;"></mat-spinner>
      </div>
    } @else if (!phase()) {
      <mat-card style="padding: 24px; max-width: 720px; margin: 24px auto;">
        <mat-card-content>
          <h2><mat-icon style="vertical-align: middle;">search_off</mat-icon> Fase no encontrada</h2>
          <p>
            La fase <code>{{ slug() }}</code> no existe en la configuración del grupo del usuario actual.
          </p>
          <p>
            Posibles causas:
          </p>
          <ul>
            <li>El admin todavía no configuró las fases de este grupo.</li>
            <li>La fase fue desactivada o renombrada.</li>
            <li>Aún estás en el modelo legacy de 3 fases (Integración/Liquidación/Liberación).</li>
          </ul>
          <p>
            <a mat-stroked-button routerLink="/dashboards/analytics">
              <mat-icon>home</mat-icon> Ir al dashboard
            </a>
          </p>
        </mat-card-content>
      </mat-card>
    } @else {
      <mat-card style="padding: 24px;">
        <mat-card-content>
          <h2 style="display:flex; align-items:center; gap: 12px;">
            <mat-icon>account_tree</mat-icon>
            {{ phase()!.phase_name }}
          </h2>
          @if (phase()!.requires_payment_voucher) {
            <p style="display: inline-flex; align-items:center; gap:6px; background:#e8f5e9; color:#1b5e20; padding:6px 12px; border-radius:12px; font-size:13px; font-weight:500;">
              <mat-icon style="font-size:16px; height:16px; width:16px;">receipt_long</mat-icon>
              Esta fase recibe comprobantes de pago
            </p>
          }
          <p style="margin-top: 24px; color: #666;">
            Fase activa #{{ phase()!.display_order + 1 }} del flujo.
            Próximamente: tabla de expedientes filtrada por <code>id_current_expedient_state = {{ phase()!.id_expedient_state }}</code>
            y, si aplica, botón para cargar el comprobante (reutiliza el dialog existente de Liquidación).
          </p>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class ProcessPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly phaseService = inject(PhaseService);

  readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), { initialValue: '' });
  readonly allPhases = toSignal(this.phaseService.getActiveForUser$(), { initialValue: [] as PhaseRow[] });

  readonly loading = computed(() => this.allPhases() === null);
  readonly phase = computed(() => {
    const s = this.slug();
    return this.allPhases().find((p) => phaseSlug(p.phase_name) === s) ?? null;
  });
}
