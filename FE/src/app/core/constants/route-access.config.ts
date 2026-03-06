/**
 * Matriz de acceso por ruta y rol.
 * - 'all': cualquier usuario autenticado.
 * - number[]: solo los role_id indicados.
 */
export const ROUTE_ACCESS: Record<string, number[] | 'all'> = {
  '/': 'all',
  '/dashboards/global': [5, 6, 7, 8, 14, 15],
  '/procesos/integracion': [1, 2, 5, 6, 7, 8, 14, 15],
  '/procesos/liquidacion': [1, 3, 5, 6, 7, 8, 14, 15],
  '/procesos/liberacion': [1, 4, 5, 6, 7, 8, 14, 15],
  '/mesa-control/consolidacion-dms': [6, 7, 8, 15],
  '/mesa-control/validacion': [5, 6, 7, 8, 14, 15],
  '/mesa-control/clientes': [6, 7, 8, 15],
  '/mesa-control/reportes-cumplimiento': [6, 7, 8, 15],
  '/mesa-control/expedientes-corregir': [7, 15],
};

/** Rutas bajo /configuracion requieren roles 6, 7, 8 y 15 (demo = admin sin IDs). */
const CONFIGURACION_ROLES: number[] = [6, 7, 8, 15];

/**
 * Devuelve los roles permitidos para una ruta.
 * - 'all': acceso para cualquier autenticado.
 * - number[]: solo esos role_id.
 */
export function getAllowedRolesForPath(path: string): number[] | 'all' {
  const normalized = path.replace(/\/$/, '') || '/';
  if (normalized.startsWith('/configuracion')) {
    return CONFIGURACION_ROLES;
  }
  const allowed = ROUTE_ACCESS[normalized];
  return allowed ?? 'all';
}

/**
 * Indica si un role_id tiene acceso a la ruta.
 */
export function canAccessRoute(roleId: number | string | null | undefined, path: string): boolean {
  if (roleId == null) return false;
  const role = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;
  if (Number.isNaN(role)) return false;

  const allowed = getAllowedRolesForPath(path);
  if (allowed === 'all') return true;
  return allowed.includes(role);
}
