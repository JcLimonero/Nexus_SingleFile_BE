export interface Agencia {
  Id: string;
  Name: string;
  IdAgency: string;
  SubFix?: string;
  Enabled: string; // "1" para activo, "0" para inactivo
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  "Tabla 1"?: any;
  "Rec #."?: any;
}

export interface AgenciaCreateRequest {
  Name: string;
  IdAgency: string;
  SubFix?: string;
  Enabled: string;
}

export interface AgenciaUpdateRequest extends Partial<AgenciaCreateRequest> {
  Id: string;
}

export interface AgenciaResponse {
  success: boolean;
  message: string;
  data?: {
    agencies: Agencia[];
    total: number;
    limit?: number | null;
    offset?: number | null;
    count: number;
  };
}
