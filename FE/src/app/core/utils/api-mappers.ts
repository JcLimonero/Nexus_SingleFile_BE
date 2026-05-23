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

/**
 * Cliente row devuelto por `Validacion::getClientes` (mesa-control).
 * Mantiene aliases camelCase para no reescribir todo validacion.component.ts.
 */
export function snakeClienteToCliente(c: any): any {
  if (!c) return c;
  return {
    ...c,
    idFile:           pick(c, 'id_file', 'idFile'),
    ndCliente:        pick(c, 'nd_cliente', 'ndCliente'),
    ndPedido:         pick(c, 'nd_pedido', 'ndPedido'),
    tipoCliente:      pick(c, 'tipo_cliente', 'tipoCliente'),
    idCustomerType:   pick(c, 'id_customer_type', 'idCustomerType'),
    idAgency:         pick(c, 'id_agency', 'idAgency')
  };
}

/**
 * Documento row devuelto por `Validacion::getDocumentos`.
 */
export function snakeDocumentoToDocumento(d: any): any {
  if (!d) return d;
  return {
    ...d,
    idDocumentByFile:        pick(d, 'id_document_by_file', 'idDocumentByFile'),
    idFileDocument:          pick(d, 'id_file_document', 'idFileDocument'),
    idFile:                  pick(d, 'id_file', 'idFile'),
    idDocumentType:          pick(d, 'id_document_type', 'idDocumentType'),
    documentTypeName:        pick(d, 'document_type_name', 'documentTypeName'),
    nombreDocumento:         pick(d, 'nombre_documento', 'nombreDocumento'),
    idCurrentStatus:         pick(d, 'id_current_status', 'idCurrentStatus'),
    fechaCarga:              pick(d, 'fecha_carga', 'fechaCarga'),
    fechaExpiracion:         pick(d, 'fecha_expiracion', 'fechaExpiracion'),
    idDocumentContainer:     pick(d, 'id_document_container', 'idDocumentContainer'),
    fileNameOriginal:        pick(d, 'file_name_original', 'fileNameOriginal')
  };
}
