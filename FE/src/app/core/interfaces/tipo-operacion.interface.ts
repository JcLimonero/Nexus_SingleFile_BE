export interface TipoOperacion {
  Id: string;
  Name: string;
  Enabled: string; // "1" para activo, "0" para inactivo
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  LastUserUpdateName?: string; // Nombre del último usuario que actualizó (viene del JOIN en el backend)
}

export interface TipoOperacionCreateRequest {
  Name: string;
  Enabled: string;
}

export interface TipoOperacionUpdateRequest extends Partial<TipoOperacionCreateRequest> {
  Id: string;
}

export interface TipoOperacionResponse {
  success: boolean;
  message: string;
  data: {
    operationTypes: TipoOperacion[];
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
