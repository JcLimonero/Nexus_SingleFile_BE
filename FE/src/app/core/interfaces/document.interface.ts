export interface Document {
  Id: number;
  Name: string;
  Comment?: string | null;
  ExperationDate?: string | null;
  PathDocument?: string | null;
  Enabled: number;
  RegistrationDate: string | null;
  UpdateDate: string | null;
  IdLastUserUpdate: number | null;
  IdFile: number;
  IdValidation?: string | null;
  IdDocumentType: number;
  IdCurrentStatus?: number | null;
  IdDocumentError?: number | null;
  
  // Campos de relaciones (JOINs)
  DocumentTypeName?: string;
  CurrentStatusDescription?: string;
  DocumentErrorDescription?: string;
  LastUserUpdateName?: string;
  FileId?: number;
  FileDescription?: string;
  FileCurrentState?: number;
  FileStatusDescription?: string;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  data: {
    documents: Document[];
    total: number;
    limit?: number | string;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filters?: {
      enabled?: string;
      document_type?: string;
      current_status?: string;
      file_id?: string;
    };
  };
}

export interface DocumentCreateRequest {
  Name: string;
  Comment?: string;
  ExperationDate?: string;
  PathDocument?: string;
  Enabled?: number;
  IdFile: number;
  IdValidation?: string;
  IdDocumentType: number;
  IdCurrentStatus?: number;
  IdDocumentError?: number;
}

export interface DocumentUpdateRequest {
  Name?: string;
  Comment?: string;
  ExperationDate?: string;
  PathDocument?: string;
  Enabled?: number;
  IdValidation?: string;
  IdDocumentType?: number;
  IdCurrentStatus?: number;
  IdDocumentError?: number;
}

export interface DocumentStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    enabled: number;
    disabled: number;
    by_type: DocumentTypeStats[];
    by_status: DocumentStatusStats[];
  };
}

export interface DocumentTypeStats {
  DocumentType: string;
  Count: number;
}

export interface DocumentStatusStats {
  Status: string;
  Count: number;
}

export interface DocumentSearchResponse {
  success: boolean;
  message: string;
  data: {
    documents: Document[];
    count: number;
    query: string;
  };
}

export interface DocumentByFileResponse {
  success: boolean;
  message: string;
  data: {
    documents: Document[];
    count: number;
    file_id: string;
  };
}

export interface DocumentEditDialogData {
  document?: Document;
  mode: 'create' | 'edit' | 'view';
  fileId?: number;
}

// Interfaces para los catálogos relacionados
export interface DocumentFileStatus {
  Id: number;
  Description: string;
}

export interface DocumentFileError {
  Id: number;
  Description: string;
}

export interface FileStatus {
  Id: number;
  Description: string;
}

export interface FileSubStatus {
  Id: number;
  Description: string;
}

// Interfaces para respuestas de catálogos
export interface DocumentFileStatusResponse {
  success: boolean;
  message: string;
  data: {
    statuses: DocumentFileStatus[];
    count: number;
  };
}

export interface DocumentFileErrorResponse {
  success: boolean;
  message: string;
  data: {
    errors: DocumentFileError[];
    count: number;
  };
}

export interface FileStatusResponse {
  success: boolean;
  message: string;
  data: {
    statuses: FileStatus[];
    count: number;
  };
}

export interface FileSubStatusResponse {
  success: boolean;
  message: string;
  data: {
    sub_statuses: FileSubStatus[];
    count: number;
  };
}

// Interface para filtros de documentos
export interface DocumentFilters {
  page?: number;
  limit?: number | string;
  enabled?: string;
  search?: string;
  document_type?: string;
  current_status?: string;
  file_id?: string;
  sort_by?: string;
  sort_order?: string;
}
