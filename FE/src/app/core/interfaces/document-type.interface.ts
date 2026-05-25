export interface DocumentTypeConfiguration {
  id_configuration_process_document_type: number;
  id_configuration_process: number;
  id_sale_type: number;
  id_agency: number;
  id_customer_type: number;
  id_operation_type: number;
  configuration_enabled: number;
  proceso_name: string;
  agencia_name: string;
  tipo_cliente_name: string;
  tipo_operacion_name: string;
}

export interface DocumentType {
  id: string;
  name: string;
  enabled: string; // API devuelve "1" o "0" como strings
  registration_date: string | null;
  update_date: string | null;
  id_last_user_update: string | null;
  req_expiration: string;
  id_sale_type: string;
  required: string;
  id_sub_sale_type: string;
  available_to_client: string;
  last_user_update_name?: string;
  process_type_name?: string;
  sub_process_name?: string;
  configurations?: DocumentTypeConfiguration[];
  configurations_count?: number;
  configurationsCount?: number; // BE aún devuelve camelCase
  /** true si es tipo protegido (ej. Liquidación) - no editable/eliminable */
  protected?: boolean;
}

export interface DocumentTypeResponse {
  success: boolean;
  message: string;
  data: {
    document_types: DocumentType[];
    total: number;
    limit?: number | string;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filter_enabled?: string;
  };
}

export interface DocumentTypeCreateRequest {
  name: string;
  enabled?: string;
  req_expiration?: string;
  id_sale_type?: string;
  required?: string;
  id_sub_sale_type?: string;
  available_to_client?: string;
}

export interface DocumentTypeUpdateRequest {
  name: string;
  enabled?: string;
  req_expiration?: string;
  id_sale_type?: string;
  required?: string;
  id_sub_sale_type?: string;
  available_to_client?: string;
}

export interface DocumentTypeStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    enabled: number;
    disabled: number;
    enabled_percentage: number;
  };
}

export interface DocumentTypeSearchResponse {
  success: boolean;
  message: string;
  data: {
    document_types: DocumentType[];
    count: number;
    query: string;
  };
}

export interface DocumentTypeActiveResponse {
  success: boolean;
  message: string;
  data: {
    document_types: DocumentType[];
    count: number;
  };
}

export interface DocumentTypeEditDialogData {
  documentType?: DocumentType;
  mode: 'create' | 'edit';
}

export interface FileState {
  id: string;
  name: string;
  enabled: string;
}

export interface SubProcess {
  id: string;
  name: string;
  enabled: string;
}

export interface FileStateResponse {
  success: boolean;
  message: string;
  data: {
    file_states: FileState[];
    count: number;
  };
}

export interface SubProcessResponse {
  success: boolean;
  message: string;
  data: {
    sub_processes: SubProcess[];
    count: number;
  };
}
