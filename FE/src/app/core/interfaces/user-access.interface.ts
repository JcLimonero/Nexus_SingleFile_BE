export interface UserAccess {
  userId: string;
  agencies: string[]; // Array de IDs de agencias
  processes: string[]; // Array de IDs de procesos
}

export interface Agency {
  id: string;
  name: string;
  enabled: string;
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  id_agency_dms?: string;
  last_user_update_name?: string;
}

export interface Process {
  id: string;
  name: string;
  enabled: string;
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  last_user_update_name?: string;
}

export interface AgencyResponse {
  success: boolean;
  message: string;
  data: {
    agencies: Agency[];
    total: number;
    limit?: number | string;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filter_enabled?: string;
  };
}

export interface ProcessResponse {
  success: boolean;
  message: string;
  data: {
    processes: Process[];
    total: number;
    limit?: number | string;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filter_enabled?: string;
  };
}

export interface UserAccessDialogData {
  user: {
    id: string;
    name: string;
    user: string;
    mail?: string;
  };
  mode: 'view' | 'edit';
}

export interface UserAccessResponse {
  success: boolean;
  message: string;
  data: {
    agencies: string[];
    processes: string[];
    agencies_details?: AgencyDetail[];
    processes_details?: ProcessDetail[];
    summary?: {
      total_agencies: number;
      total_processes: number;
      active_agencies: number;
      active_processes: number;
    };
  };
}

export interface AgencyDetail {
  id_agency: string;
  agency_name: string;
  enabled: string;
}

export interface ProcessDetail {
  id_sale_type: string;
  process_name: string;
  enabled: string;
}
