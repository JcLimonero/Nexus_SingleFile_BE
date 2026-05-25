export interface DocumentoRequerido {
  id: string;
  id_document_type: string;
  id_configuration_process: string;
  id_sale_type: string;
  id_agency: string;
  id_operation_type: string;
  id_customer_type: string;
  enabled: string;
  registration_date?: string;
  update_date?: string;
  id_last_user_update?: string;

  proceso_name?: string;
  agencia_name?: string;
  tipo_cliente_name?: string;
  tipo_operacion_name?: string;
  tipo_documento_name?: string;

  required?: string;
  req_expiration?: string;
  id_sub_sale_type?: string;
  process_type_name?: string;
  sub_process_name?: string;
}

export interface DocumentoRequeridoCreateRequest {
  id_sale_type: string;
  id_agency: string;
  id_customer_type: string;
  id_operation_type: string;
  id_document_type: string;
}

export interface DocumentoRequeridoUpdateRequest extends Partial<DocumentoRequeridoCreateRequest> {
  id: string;
  enabled?: string;
}

export interface DocumentoRequeridoResponse {
  success: boolean;
  message: string;
  data: {
    documentos: DocumentoRequerido[];
    total: number;
    limit?: number;
    offset?: number;
    count: number;
  };
}

export interface DocumentoRequeridoFilters {
  id_sale_type?: string;
  id_agency?: string;
  id_company?: string | number;
  id_customer_type?: string;
  id_operation_type?: string;
  id_document_type?: string;
  required?: boolean;
  enabled?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface DocumentoRequeridoStats {
  total_documentos: number;
  documentos_requeridos: number;
  documentos_opcionales: number;
  procesos_count: number;
  agencias_count: number;
}
