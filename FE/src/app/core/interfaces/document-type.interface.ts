export interface DocumentType {
  Id: string;
  Name: string;
  Enabled: string; // API devuelve "1" o "0" como strings
  RegistrationDate: string | null;
  UpdateDate: string | null;
  IdLastUserUpdate: string | null;
  ReqExpiration: string; // API devuelve "1" o "0" como strings
  IdProcessType: string; // API devuelve IDs como strings
  Required: string; // API devuelve "1" o "0" como strings
  IdSubProcess: string; // API devuelve IDs como strings
  AvailableToClient: string; // API devuelve "1" o "0" como strings
  LastUserUpdateName?: string;
  ProcessTypeName?: string; // Descripción del File_Status (JOIN con File_Status)
  SubProcessName?: string; // Nombre del subestado de archivo (JOIN con File_SubStatus)
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
  Enabled?: string; // "1" o "0"
  ReqExpiration?: string; // "1" o "0"
  IdProcessType?: string; // ID como string
  Required?: string; // "1" o "0"
  IdSubProcess?: string; // ID como string
  AvailableToClient?: string; // "1" o "0"
}

export interface DocumentTypeUpdateRequest {
  Name: string;
  Enabled?: string; // "1" o "0"
  ReqExpiration?: string; // "1" o "0"
  IdProcessType?: string; // ID como string
  Required?: string; // "1" o "0"
  IdSubProcess?: string; // ID como string
  AvailableToClient?: string; // "1" o "0"
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
  Id: string;
  Name: string;
  Enabled: string; // "1" o "0"
}

export interface SubProcess {
  Id: string;
  Name: string;
  Enabled: string; // "1" o "0"
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
