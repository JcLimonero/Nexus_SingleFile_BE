/**
 * Mappers entre la convención del API (snake_case desde la migración) y la
 * convención interna del FE (camelCase para nuevos componentes; mixto en código
 * legacy). Cada mapper toca SOLO los campos no triviales — los que ya están en
 * la misma forma se dejan pasar con spread.
 *
 * Uso típico en un servicio:
 *
 *   this.http.get<ApiResponse>(url).pipe(
 *     map(r => ({ ...r, data: { ...r.data, files: r.data.files.map(snakeFileToFile) } }))
 *   )
 *
 * Importante: estos mappers NO mutan; devuelven copias.
 */

/** Helper genérico: alias snake → camel. */
function pick<T>(obj: any, snake: string, camel: string): T | undefined {
  return obj?.[snake] ?? obj?.[camel];
}

/**
 * File / expediente devuelto por `/api/files/by-agency-client`
 * y endpoints relacionados.
 */
export function snakeFileToFile(f: any): any {
  if (!f) return f;
  return {
    ...f,
    fileId:           pick(f, 'file_id', 'fileId'),
    numeroPedido:     pick(f, 'numero_pedido', 'numeroPedido'),
    numeroInventario: pick(f, 'numero_inventario', 'numeroInventario'),
    tipoCliente:      pick(f, 'tipo_cliente', 'tipoCliente'),
    fechaRegistro:    pick(f, 'fecha_registro', 'fechaRegistro')
  };
}

/**
 * Wrap genérico para responses `{ success, data: { files: [], total } }`
 * tipo `Files::getByAgency`.
 */
export function mapFilesResponse(r: any): any {
  if (!r?.data?.files) return r;
  return {
    ...r,
    data: {
      ...r.data,
      files: Array.isArray(r.data.files) ? r.data.files.map(snakeFileToFile) : r.data.files
    }
  };
}
