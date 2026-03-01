export interface CostumerType {
  id: string;
  name: string;
  enabled: string; // "1" para activo, "0" para inactivo
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  last_user_update_name?: string;
}

export interface CostumerTypeCreateRequest {
  name: string;
  enabled: string;
}

export interface CostumerTypeUpdateRequest extends Partial<CostumerTypeCreateRequest> {
  id: string;
}

export interface CostumerTypeResponse {
  success: boolean;
  message: string;
  data: {
    costumer_types: CostumerType[];
    total: number;
    limit?: number | string;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filter_enabled?: string;
  };
}

export interface CostumerTypeEditDialogData {
  costumerType: CostumerType;
  mode: 'create' | 'edit';
}
