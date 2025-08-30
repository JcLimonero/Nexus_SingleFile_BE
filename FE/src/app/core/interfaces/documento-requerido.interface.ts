export interface DocumentoRequerido {
  Id: string;
  IdDocumentType: string;
  IdConfigurationProcess: string;
  IdProcess: string;
  IdAgency: string;
  IdOperationType: string;
  IdCostumerType: string;
  Enabled: string;
  RegistrationDate?: string;
  UpdateDate?: string;
  IdLastUserUpdate?: string;
  
  // Campos de relación para mostrar nombres
  ProcesoName?: string;
  AgenciaName?: string;
  TipoClienteName?: string;
  TipoOperacionName?: string;
  TipoDocumentoName?: string;
  
  // Campos del tipo de documento
  Required?: string;
  ReqExpiration?: string;
}

export interface DocumentoRequeridoCreateRequest {
  IdProcess: string;
  IdAgency: string;
  IdCostumerType: string;
  IdOperationType: string;
  IdDocumentType: string;
}

export interface DocumentoRequeridoUpdateRequest extends Partial<DocumentoRequeridoCreateRequest> {
  Id: string;
  Enabled?: string;
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
  IdProcess?: string;
  IdAgency?: string;
  IdCostumerType?: string;
  IdOperationType?: string;
  IdDocumentType?: string;
  Required?: boolean;
  Enabled?: boolean;
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
