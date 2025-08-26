export interface DocumentType {
  Id: number;
  Name: string;
  Enabled: number;
  RegistrationDate: string | null;
  UpdateDate: string | null;
  IdLastUserUpdate: number | null;
  ReqExpiration: number; // Si requiere fecha de expiración (0/1)
  IdProcessType: number; // ID del tipo de proceso
  Required: number; // Si es requerido (0/1)
  IdSubProcess: number; // ID del subproceso
  LastUserUpdateName?: string;
  ProcessTypeName?: string; // Descripción del File_Status (JOIN con File_Status)
  SubProcessName?: string; // Nombre del subproceso (JOIN con Process)
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
  Name: string;
  Enabled?: number;
  ReqExpiration?: number;
  IdProcessType?: number;
  Required?: number;
  IdSubProcess?: number;
}

export interface DocumentTypeUpdateRequest {
  Name: string;
  Enabled?: number;
  ReqExpiration?: number;
  IdProcessType?: number;
  Required?: number;
  IdSubProcess?: number;
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

// Interfaces para catálogos relacionados
export interface FileStatus {
  Id: number;
  Name: string;
  Enabled: number;
}

export interface SubProcess {
  Id: number;
  Name: string;
  Enabled: number;
}

export interface FileStatusResponse {
  success: boolean;
  message: string;
  data: {
    file_statuses: FileStatus[];
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
