export interface User {
  id: string;
  name: string;
  user: string; // username
  mail: string;
  enabled: string; // "1" para activo, "0" para inactivo
  id_user_role: string;
  default_agency: string;
  agency_name?: string;
  profile_image?: string | null;
  registration_date?: string | null;
  update_date?: string | null;
  id_last_user_update?: string;
  last_user_update_name?: string;
  assigned_agencies?: string[];
  assigned_agency_names?: string[];
}

export interface UserCreateRequest {
  name: string;
  user: string;
  mail: string;
  pass: string;
  id_user_role: string;
  default_agency: string;
  enabled: string;
}

export interface UserUpdateRequest extends Partial<UserCreateRequest> {
  id: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    total: number;
    limit?: number;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
    filter_enabled?: string;
  };
}

export interface UserEditDialogData {
  user: User;
  mode: 'create' | 'edit';
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface UserRoleResponse {
  success: boolean;
  message: string;
  data: {
    roles: UserRole[];
    total: number;
  };
}

export interface Agency {
  id: string;
  name: string;
  enabled: string;
  id_agency_dms?: string;
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
  };
}
