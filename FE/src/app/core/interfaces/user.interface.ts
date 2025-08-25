export interface User {
  Id: string;
  Name: string;
  User: string; // username
  Mail: string;
  Enabled: string; // "1" para activo, "0" para inactivo
  IdUserRol: string;
  DefaultAgency: string;
  ProfileImage?: string | null;
  RegistrationDate?: string | null;
  UpdateDate?: string | null;
  IdLastUserUpdate?: string;
  LastUserUpdateName?: string; // Nombre del último usuario que actualizó
}

export interface UserCreateRequest {
  Name: string;
  User: string;
  Mail: string;
  Password: string;
  IdUserRol: string;
  DefaultAgency: string;
  Enabled: string;
}

export interface UserUpdateRequest extends Partial<UserCreateRequest> {
  Id: string;
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
  Id: string;
  Name: string;
  Description?: string;
}

export interface Agency {
  Id: string;
  Name: string;
  Enabled: string;
}
