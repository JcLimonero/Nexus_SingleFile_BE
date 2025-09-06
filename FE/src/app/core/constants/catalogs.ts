/**
 * Catálogos fijos del sistema
 * Contiene datos que no cambian frecuentemente y se usan en múltiples componentes
 */

export interface CatalogItem {
  id: number;
  name: string;
  value?: string;
}

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
 * Obtener todas las fases para usar en filtros
 */
export function getFasesForFilter(): CatalogItem[] {
  return FASES_CATALOG.map(fase => ({
    id: fase.id,
    name: fase.name,
    value: fase.value
  }));
}
