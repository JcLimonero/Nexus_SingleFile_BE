export interface Proceso {
  Id: string;
  Name: string;
  Enabled: string; // "1" para activo, "0" para inactivo
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  LastUserUpdateName?: string; // Nombre del último usuario que actualizó (viene del JOIN en el backend)
}

export interface ProcesoCreateRequest {
  Name: string;
  Enabled: string;
}

export interface ProcesoUpdateRequest extends Partial<ProcesoCreateRequest> {
  Id: string;
}

export interface ProcesoResponse {
  success: boolean;
  message: string;
  data?: {
    processes: Proceso[];
    total: number;
    limit?: number | null;
    offset?: number | null;
    count: number;
  };
}
