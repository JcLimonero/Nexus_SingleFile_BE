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
 * Convierte recursivamente claves snake_case → camelCase. Inverso lógico
 * del trait `App\Traits\SnakeKeys` del BE. AGREGA aliases camelCase sin
 * descartar las snake — el FE puede leer cualquiera.
 *
 *   {id_cliente: 1, nested: [{nd_pedido: 'a'}]}
 *   →
 *   {id_cliente: 1, idCliente: 1, nested: [{nd_pedido:'a', ndPedido:'a'}]}
 *
 * Reglas:
 *   - snake_case → camelCase  ('id_cliente' → 'idCliente')
 *   - claves ya camel o lower sin cambios
 *   - arrays se procesan elemento por elemento
 *   - objetos plain se recursan; valores escalares pasan tal cual
 *   - acrónimos ALL_CAPS reciben tratamiento estándar
 *     ('aml_umbral_uma' → 'amlUmbralUma')
 *
 * Performance: pensado para responses API (<10MB típico). Para listas muy
 * grandes (>5k items) considera un mapper específico que toque solo los
 * campos necesarios.
 */
export function camelizeKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map(camelizeKeys);
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    const out: any = {};
    for (const k of Object.keys(value)) {
      const v = camelizeKeys((value as any)[k]);
      out[k] = v;
      const camel = toCamelKey(k);
      if (camel !== k && !(camel in value)) {
        out[camel] = v;
      }
    }
    return out;
  }
  return value;
}

function toCamelKey(key: string): string {
  if (!key.includes('_')) return key;
  return key.replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

/**
 * Mapper específico para `FileExtraordinaryReason` (motivos extraordinarios)
 * cuyo modelo BE emite PascalCase manualmente (`Id`, `Name`, `IdTypeReason`)
 * pero el filter snake_resp los baja a snake. Aquí los volvemos a PascalCase
 * para que el componente que lee `reason.Id`, `reason.Name`, etc. funcione.
 */
export function snakeFileExtraordinaryReason(r: any): any {
  if (!r) return r;
  return {
    ...r,
    Id:                  pick(r, 'id', 'Id'),
    Name:                pick(r, 'name', 'Name'),
    IdTypeReason:        pick(r, 'id_type_reason', 'IdTypeReason'),
    Enabled:             pick(r, 'enabled', 'Enabled'),
    RegistrationDate:    pick(r, 'registration_date', 'RegistrationDate'),
    UpdateDate:          pick(r, 'update_date', 'UpdateDate'),
    IdLastUserUpdate:    pick(r, 'id_last_user_update', 'IdLastUserUpdate')
  };
}

/** Wrap completo de una FileExtraordinaryReasonResponse. */
export function mapFileExtraordinaryReasonResponse(r: any): any {
  if (!r?.data?.file_extraordinary_reasons) return r;
  return {
    ...r,
    data: {
      ...r.data,
      file_extraordinary_reasons: Array.isArray(r.data.file_extraordinary_reasons)
        ? r.data.file_extraordinary_reasons.map(snakeFileExtraordinaryReason)
        : r.data.file_extraordinary_reasons
    }
  };
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
 *
 * Mapeo completo del SELECT de Validacion.php:929 — todos los campos
 * camelCase del SQL antes del snake_keys global. Si agregas una columna nueva
 * al SELECT, agrégala también aquí o no se renderiza en la tabla.
 */
export function snakeClienteToCliente(c: any): any {
  if (!c) return c;
  return {
    ...c,
    idFile:                         pick(c, 'id_expedient', 'idFile'),
    ndCliente:                      pick(c, 'nd_cliente', 'ndCliente'),
    ndPedido:                       pick(c, 'nd_pedido', 'ndPedido'),
    tipoCliente:                    pick(c, 'tipo_cliente', 'tipoCliente'),
    idCustomerType:                 pick(c, 'id_customer_type', 'idCustomerType'),
    idAgency:                       pick(c, 'id_agency', 'idAgency'),
    // IdCurrentState es seteado manualmente en el BE (PascalCase) para el FE — el
    // global snake_resp filter lo baja a id_current_expedient_state, lo re-aliasamos aquí.
    IdCurrentState:                 pick(c, 'id_current_expedient_state', 'IdCurrentState'),
    fechaLiberacion:                pick(c, 'fecha_liberacion', 'fechaLiberacion'),
    tieneDocumentosPendientes:      pick(c, 'tiene_documentos_pendientes', 'tieneDocumentosPendientes'),
    documentosNoAprobados:          pick(c, 'documentos_no_aprobados', 'documentosNoAprobados'),
    montoUnidad:                    pick(c, 'monto_unidad', 'montoUnidad'),
    avisoConfidencialidadAceptado:  pick(c, 'aviso_confidencialidad_aceptado', 'avisoConfidencialidadAceptado'),
    cantidadBeneficiarios:          pick(c, 'cantidad_beneficiarios', 'cantidadBeneficiarios'),
    porcentajeBeneficiarios:        pick(c, 'porcentaje_beneficiarios', 'porcentajeBeneficiarios')
  };
}

/**
 * Item de cliente devuelto por `Client::index` (mesa-control/clientes).
 * Distinto de `snakeClienteToCliente` (que es para Validacion::getClientes
 * con shape totalmente diferente: idFile, ndPedido, etc).
 */
export function snakeClienteMesaToCliente(c: any): any {
  if (!c) return c;
  return {
    ...c,
    idCliente:        pick(c, 'id_cliente', 'idCliente'),
    ndCliente:        pick(c, 'nd_cliente', 'ndCliente'),
    idClientHeader:   pick(c, 'id_client_header', 'idClientHeader'),
    idHeaderClient:   pick(c, 'id_header_client', 'idHeaderClient'),
    excedeUmbralAML:  pick(c, 'excede_umbral_aml', 'excedeUmbralAML')
  };
}

/**
 * Wrap completo para responses de `Client::index` (incluye top-level
 * `amlUmbral` que también vino como `aml_umbral` después del snake_resp).
 */
export function mapClientesMesaResponse(r: any): any {
  if (!r?.data) return r;
  return {
    ...r,
    data: {
      ...r.data,
      clientes: Array.isArray(r.data.clientes)
        ? r.data.clientes.map(snakeClienteMesaToCliente)
        : r.data.clientes,
      amlUmbral: pick(r.data, 'aml_umbral', 'amlUmbral')
    }
  };
}

/**
 * Documento row devuelto por `Validacion::getDocumentos`.
 *
 * Mapeo completo del SELECT en Validacion.php:1604 — todos los aliases
 * camelCase y PascalCase del query original quedan re-expuestos como
 * camelCase aunque el global snake_resp filter haya convertido las claves.
 */
export function snakeDocumentoToDocumento(d: any): any {
  if (!d) return d;
  return {
    ...d,
    idFileDocument:      pick(d, 'id_expedient_document', 'idFileDocument'),
    idDocumentByFile:    pick(d, 'id_expedient_document', 'idDocumentByFile'),
    idDocumentType:      pick(d, 'id_document_type', 'idDocumentType'),
    tipoDocumento:       pick(d, 'tipo_documento', 'tipoDocumento'),
    idEstatus:           pick(d, 'id_estatus', 'idEstatus'),
    EstatusName:         pick(d, 'estatus_name', 'EstatusName'),
    ReqExpiration:       pick(d, 'req_expiration', 'ReqExpiration'),
    fechaExpiracion:     pick(d, 'fecha_expiracion', 'fechaExpiracion'),
    documentContainer:   pick(d, 'document_container', 'documentContainer'),
    DisponibleCliente:   pick(d, 'disponible_cliente', 'DisponibleCliente'),
    receiptAmount:       pick(d, 'receipt_amount', 'receiptAmount'),
    idPaymentMethod:     pick(d, 'id_payment_method', 'idPaymentMethod'),
    paymentMethodName:   pick(d, 'payment_method_name', 'paymentMethodName'),
    paymentDate:         pick(d, 'payment_date', 'paymentDate'),
    registrationDate:    pick(d, 'registration_date', 'registrationDate')
  };
}
