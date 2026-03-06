export interface Proceso {
  id: string;
  name: string;
  enabled: string; // "1" para activo, "0" para inactivo
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  last_user_update_name?: string;
}

export interface ProcesoCreateRequest {
  name: string;
  enabled: string;
}

export interface ProcesoUpdateRequest extends Partial<ProcesoCreateRequest> {
  id: string;
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
