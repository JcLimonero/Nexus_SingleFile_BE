export interface CostumerType {
  Id: string;
  Name: string;
  Enabled: string; // "1" para activo, "0" para inactivo
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  LastUserUpdateName?: string;
}

export interface CostumerTypeCreateRequest {
  Name: string;
  Enabled: string;
}

export interface CostumerTypeUpdateRequest extends Partial<CostumerTypeCreateRequest> {
  Id: string;
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
