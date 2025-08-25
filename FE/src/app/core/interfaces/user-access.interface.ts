export interface UserAccess {
  userId: string;
  agencies: string[]; // Array de IDs de agencias
  processes: string[]; // Array de IDs de procesos
}

export interface Agency {
  Id: string;
  Name: string;
  Enabled: string;
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  IdAgency?: string;
  LastUserUpdateName?: string;
}

export interface Process {
  Id: string;
  Name: string;
  Enabled: string;
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  LastUserUpdateName?: string;
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
    Id: string;
    Name: string;
    User: string;
    Email?: string;
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
  IdAgency: string;
  AgencyName: string;
  Enabled: string;
}

export interface ProcessDetail {
  IdProcess: string;
  ProcessName: string;
  Enabled: string;
}
