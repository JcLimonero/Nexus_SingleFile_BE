export interface TipoVenta {
  id: string;
  name: string;
  enabled: string; // "1" para activo, "0" para inactivo
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  last_user_update_name?: string;
}

export interface TipoVentaCreateRequest {
  name: string;
  enabled: string;
}

export interface TipoVentaUpdateRequest extends Partial<TipoVentaCreateRequest> {
  id: string;
}

export interface TipoVentaResponse {
  success: boolean;
  message: string;
  data?: {
    processes: TipoVenta[];
    total: number;
    limit?: number | null;
    offset?: number | null;
    count: number;
  };
}
