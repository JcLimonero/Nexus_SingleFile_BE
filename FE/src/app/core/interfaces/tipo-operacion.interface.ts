export interface TipoOperacion {
  id: string;
  name: string;
  enabled: string; // "1" para activo, "0" para inactivo
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  last_user_update_name?: string;
}

export interface TipoOperacionCreateRequest {
  name: string;
  enabled: string;
}

export interface TipoOperacionUpdateRequest extends Partial<TipoOperacionCreateRequest> {
  id: string;
}

export interface TipoOperacionResponse {
  success: boolean;
  message: string;
  data: {
    operation_types?: TipoOperacion[];
    operationTypes?: TipoOperacion[]; // BE aún devuelve camelCase
    total: number;
    limit?: number;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filter_enabled?: string;
  };
}

export interface TipoOperacionEditDialogData {
  tipoOperacion: TipoOperacion;
  mode: 'create' | 'edit';
}
