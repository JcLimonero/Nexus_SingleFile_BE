/**
 * Si el término es solo dígitos, elimina ceros a la izquierda (p. ej. "00018" → "18").
 * Si solo había ceros, queda "0".
 * Cualquier texto no estrictamente numérico se devuelve igual (tras trim).
 */
export function normalizeClientSearchQuery(raw: string): string {
  const t = raw.trim();
  if (t === '') {
    return t;
  }
  if (!/^\d+$/.test(t)) {
    return t;
  }
  const withoutLeadingZeros = t.replace(/^0+/, '');
  return withoutLeadingZeros === '' ? '0' : withoutLeadingZeros;
}
