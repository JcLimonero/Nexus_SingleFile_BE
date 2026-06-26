import { Injectable, computed, signal } from '@angular/core';
import type { DbConfig, TenantSummary, TenantDetail } from '../types/wizard-api';

/**
 * Estado de la sesión del modo administración.
 *
 * Acceso al modo edición requiere dos cosas:
 *   1. Conexión válida a la central DB (mismo paso que provisioning).
 *   2. Login super-admin contra ADMIN_BE → obtiene token (sólo para audit
 *      log; las escrituras al tenant se hacen vía MySQL directo).
 *
 * Una vez ambos están listos, el operador selecciona un tenant de la lista,
 * el handler `tenants:get` devuelve las credenciales descifradas y se
 * guardan en `tenantDbCfg`. Cualquier componente edit puede consumir esta
 * señal para llamar a los handlers `tenant:*`.
 *
 * IMPORTANTE: nunca persistimos `tenantDbCfg` a disco. Si el operador
 * cierra el WIZARD, la sesión se pierde y debe re-autenticarse.
 */
@Injectable({ providedIn: 'root' })
export class TenantSessionService {
  /** Conexión a la central DB (la misma que provisioning) — set por CentralDb step. */
  readonly centralCfg = signal<DbConfig | null>(null);

  /** Token del super-admin (audit trail). */
  readonly superAdminToken = signal<string | null>(null);

  /** Clave AES-256-GCM para descifrar passwords de tenants. Cargada de config/central.env. */
  readonly encryptionKey = signal<string>('');

  /** Lista de tenants visible en /admin/tenants — refrescable. */
  readonly tenants = signal<TenantSummary[]>([]);

  /** Tenant abierto en edición (con creds descifradas). null si no hay sesión activa. */
  readonly selectedTenant = signal<TenantDetail | null>(null);

  /** Atajo: config de conexión al tenant activo. Componentes edit consumen esto. */
  readonly tenantDbCfg = computed<DbConfig | null>(() => this.selectedTenant()?.tenantDb ?? null);

  /**
   * User id del tenant que se grabará en `id_last_user_update` para audit.
   * NO es el id del super-admin (vive en central, no en el tenant). Lo
   * resuelve el backend en `tenants:get` y lo refresca cada `selectTenant()`.
   */
  readonly actorUserId = signal<number>(1);

  /** True si tenemos central + key + token cargados → puede listar tenants. */
  readonly canBrowse = computed(() => {
    const c = this.centralCfg();
    return !!c && !!this.encryptionKey() && !!this.superAdminToken();
  });

  setCentral(cfg: DbConfig, encryptionKey: string): void {
    this.centralCfg.set(cfg);
    this.encryptionKey.set(encryptionKey);
  }

  setSuperAdminToken(token: string | null): void {
    this.superAdminToken.set(token);
    // Importante: NO usar el id del super-admin como actorUserId. Vive en
    // central.super_admin_user, no en tenant.user → rompería FKs al insertar
    // en agency/company/etc. El actorUserId del tenant lo trae selectTenant().
  }

  async refreshTenantsList(): Promise<{ ok: boolean; message?: string }> {
    const cfg = this.centralCfg();
    if (!cfg) return { ok: false, message: 'Falta conexión a central DB' };
    const r = await window.wizardApi.tenants.list(cfg);
    if (r.ok && r.data) {
      this.tenants.set(r.data);
      return { ok: true };
    }
    return { ok: false, message: r.message ?? 'No se pudo cargar la lista' };
  }

  async selectTenant(tenantId: number): Promise<{ ok: boolean; message?: string }> {
    const cfg = this.centralCfg();
    const key = this.encryptionKey();
    if (!cfg || !key) return { ok: false, message: 'Falta sesión central' };
    const r = await window.wizardApi.tenants.get(cfg, tenantId, key);
    if (r.ok && r.data) {
      this.selectedTenant.set(r.data);
      this.actorUserId.set(r.data.actorUserId);
      return { ok: true };
    }
    return { ok: false, message: r.message ?? 'No se pudo abrir el tenant' };
  }

  clearTenant(): void {
    this.selectedTenant.set(null);
  }

  /** Limpia todo el estado de admin — para "Cerrar sesión". */
  reset(): void {
    this.centralCfg.set(null);
    this.superAdminToken.set(null);
    this.encryptionKey.set('');
    this.tenants.set([]);
    this.selectedTenant.set(null);
    this.actorUserId.set(1);
  }
}
