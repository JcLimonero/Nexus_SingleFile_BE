/**
 * Catálogos fijos del sistema
 * Contiene datos que no cambian frecuentemente y se usan en múltiples componentes
 */

export interface CatalogItem {
  id: number;
  name: string;
  value?: string;
}

/** Nombres de fases a ocultar en catálogos/filtros (estados finales) */
export const FASES_OCULTAS = ['Liberado', 'Cancelado', 'Liberado por Excepción'];

/**
 * Catálogo de fases del sistema
 * Mapea los IdCurrentState con sus nombres correspondientes
 */
export const FASES_CATALOG: CatalogItem[] = [
  { id: 1, name: 'Integración', value: '1' },
  { id: 2, name: 'Liquidación', value: '2' },
  { id: 3, name: 'Liberación', value: '3' },
  { id: 4, name: 'Liberado', value: '4' },
  { id: 5, name: 'Cancelado', value: '5' },
  { id: 6, name: 'Liberado por Excepción', value: '6' }
];

/**
 * Catálogo de fases para filtros (oculta Liberado, Cancelado, Liberado por Excepción)
 */
export const FASES_FILTER_CATALOG: CatalogItem[] = FASES_CATALOG.filter(
  f => !FASES_OCULTAS.includes(f.name)
);

/**
 * Obtener el nombre de una fase por su ID
 */
export function getFaseNameById(id: number): string {
  const fase = FASES_CATALOG.find(f => f.id === id);
  return fase ? fase.name : 'Desconocido';
}

/**
 * Obtener el valor de una fase por su ID
 */
export function getFaseValueById(id: number): string {
  const fase = FASES_CATALOG.find(f => f.id === id);
  return fase ? fase.value || '' : '';
}

/**
 * Obtener el ID de una fase por su valor
 */
export function getFaseIdByValue(value: string): number {
  const fase = FASES_CATALOG.find(f => f.value === value);
  return fase ? fase.id : 0;
}

/**
 * Obtener todas las fases para usar en filtros (excluye Liberado, Cancelado, Liberado por Excepción)
 */
export function getFasesForFilter(): CatalogItem[] {
  return FASES_FILTER_CATALOG.map(fase => ({
    id: fase.id,
    name: fase.name,
    value: fase.value
  }));
}
