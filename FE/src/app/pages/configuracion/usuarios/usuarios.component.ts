import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { User, UserResponse, UserRole, UserRoleResponse, Agency, AgencyResponse } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { UserAccessDialogComponent } from './user-access-dialog/user-access-dialog.component';
import { CompanyAgencyFilterComponent } from '../../../shared/components/company-agency-filter/company-agency-filter.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatCardModule,
    CompanyAgencyFilterComponent
  ]
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  roles: UserRole[] = [];
  agencies: Agency[] = [];
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = [];
  loading = false;
  loadingCatalogs = false;
  searchTerm = '';
  roleFilter = '';
  agencyFilter: number | '' = '';
  assignedAgencyFilter = '';
  statusFilter = '';

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this._paginator = value;
    if (this._paginator && this.dataSource) {
      this.dataSource.paginator = this._paginator;
    }
  }
  get paginator(): MatPaginator {
    return this._paginator!;
  }
  private _paginator?: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private defaultAgencyService: DefaultAgencyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private confirmDialog: ConfirmDialogService
  ) { }

  /** Roles 7 (Administrador) y 8 (Soporte) no se muestran en listados, excepto si quien está logueado es Administrador (7). */
  private readonly restrictedRoleIds = new Set(['7', '8']);

  /** Si el usuario logueado es Administrador (7), puede ver roles 7 y 8 en listados. */
  get isLoggedInAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user ? String(user.role_id) === '7' : false;
  }

  get rolesForFilter(): UserRole[] {
    if (this.isLoggedInAdmin) {
      return this.roles;
    }
    return this.roles.filter(r => !this.restrictedRoleIds.has(String(r.id)));
  }

  /** Ocultar rol en tabla (mostrar "—") cuando es 7 u 8 y el logueado NO es admin. */
  isHiddenRole(roleId: string): boolean {
    return !this.isLoggedInAdmin && this.restrictedRoleIds.has(String(roleId));
  }

  ngOnInit(): void {
    this.displayedColumns = this.authService.getDisplayedColumnsWithOptionalId(['id', 'name', 'user', 'mail', 'id_user_role', 'default_agency', 'AssignedAgencies', 'Status', 'acciones']);
    this.loadUsers();
    this.loadRoles();
    this.loadAgencies();
  }

  ngAfterViewInit(): void {
    if (this._paginator) {
      this.dataSource.paginator = this._paginator;
    }
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm) ||
             data.user.toLowerCase().includes(searchTerm) ||
             data.mail.toLowerCase().includes(searchTerm);
    };
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (response: UserResponse) => {
        if (response.success) {
          this.users = response.data.users;
          // Obtener agencias asignadas para cada usuario
          this.loadUserAgencies();
        } else {
          this.snackBar.open(response.message || 'Error al cargar usuarios', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar usuarios', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  loadUserAgencies(): void {
    const totalUsers = this.users.length;
    
    if (totalUsers === 0) {
      this.dataSource.data = this.users;
      this.applyFilter();
      this.loading = false;
      return;
    }

    // Obtener IDs de todos los usuarios
    const userIds = this.users.map(user => user.id).join(',');
    
    // Hacer una sola llamada para obtener todas las agencias de todos los usuarios
    this.userService.getUsersAgenciesBatch(userIds).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          // Procesar la respuesta y asignar agencias a cada usuario
          this.users.forEach(user => {
            const uid = user.id ?? (user as any).Id;
            const userAgencies = response.data[uid];
            if (userAgencies) {
              user.assigned_agencies = userAgencies.agencies || [];
              user.assigned_agency_names = userAgencies.agencies_details?.map((agency: any) => agency.AgencyName ?? agency.agency_name) || [];
            } else {
              user.assigned_agencies = [];
              user.assigned_agency_names = [];
            }
          });
        } else {
          // Si no hay respuesta exitosa, inicializar arrays vacíos
          this.users.forEach(user => {
            user.assigned_agencies = [];
            user.assigned_agency_names = [];
          });
        }
        
        // Actualizar la tabla
        this.dataSource.data = this.users;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {

        // En caso de error, inicializar arrays vacíos para todos los usuarios
        this.users.forEach(user => {
          user.assigned_agencies = [];
          user.assigned_agency_names = [];
        });
        
        // Actualizar la tabla
        this.dataSource.data = this.users;
        this.applyFilter();
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.loadingCatalogs = true;
    this.userService.getUserRoles().subscribe({
      next: (response: UserRoleResponse) => {
        if (response.success) {
          this.roles = response.data.roles;
        } else {
          this.snackBar.open(response.message || 'Error al cargar roles', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar roles', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
  }

  loadAgencies(): void {
    this.loadingCatalogs = true;
    // Usar DefaultAgencyService que maneja caché en localStorage
    this.defaultAgencyService.obtenerAgencias().subscribe({
      next: (agencias) => {
        // Filtrar solo agencias habilitadas y convertir al formato esperado
        this.agencies = agencias
          .filter(ag => this.defaultAgencyService.esAgenciaHabilitada(ag))
          .map(ag => ({
            id: String((ag as any).id ?? (ag as any).Id),
            name: (ag as any).name ?? (ag as any).Name,
            enabled: typeof (ag as any).enabled === 'boolean' ? ((ag as any).enabled ? '1' : '0') : 
                     typeof (ag as any).enabled === 'string' ? (ag as any).enabled : 
                     String((ag as any).Enabled ?? (ag as any).enabled ?? '0')
          })) as Agency[];
        this.checkCatalogsLoaded();
      },
      error: (error) => {
        this.snackBar.open('Error al cargar agencias', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
  }

  private checkCatalogsLoaded(): void {
    // Verificar si todos los catálogos han sido procesados
    const totalCatalogs = 2; // roles y agencias
    const catalogsProcessed = (this.roles.length >= 0 ? 1 : 0) + 
                             (this.agencies.length >= 0 ? 1 : 0);
    
    if (catalogsProcessed >= totalCatalogs) {
      this.loadingCatalogs = false;

      // Si no hay catálogos, mostrar mensaje de error
      if (this.roles.length === 0 && this.agencies.length === 0) {
        this.snackBar.open('No se pudieron cargar los catálogos. Verifica la conexión con el backend.', 'Error', { duration: 5000 });
      }
    }
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim();
    
    // Aplicar filtros
    let filteredData = this.users;
    
    // Filtro de rol
    if (this.roleFilter !== '') {
      filteredData = filteredData.filter(user => user.id_user_role === this.roleFilter);
    }
    
    // Filtro de agencia predeterminada
    if (this.agencyFilter !== '') {
      filteredData = filteredData.filter(user => user.default_agency === this.agencyFilter);
    }
    
    // Filtro de agencias asignadas
    if (this.assignedAgencyFilter !== '') {
      filteredData = filteredData.filter(user => 
        user.assigned_agencies && 
        Array.isArray(user.assigned_agencies) && 
        user.assigned_agencies.includes(this.assignedAgencyFilter)
      );
    }
    
    // Filtro de estado
    if (this.statusFilter !== '') {
      filteredData = filteredData.filter(user => user.enabled === this.statusFilter);
    }
    
    // Filtro de búsqueda de texto
    if (filterValue !== '') {
      filteredData = filteredData.filter(user => 
        user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.user.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.mail.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    this.dataSource.data = filteredData;
    
    // Conectar paginador si aún no está conectado (puede no existir al inicio por *ngIf)
    if (this._paginator && !this.dataSource.paginator) {
      this.dataSource.paginator = this._paginator;
    }
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = '';
    this.agencyFilter = '';
    this.assignedAgencyFilter = '';
    this.statusFilter = '';
    this.applyFilter();
  }

  openCreateDialog(): void {
    const dialogData = {
      user: {} as User,
      mode: 'create' as const
    };

    try {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        width: '700px',
        data: dialogData,
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshData();
        }
      });
    } catch (error) {
      // Error opening dialog
    }
  }

  openEditDialog(user: User): void {
    const dialogData = {
      user: user,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '700px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  openAccessDialog(user: User): void {
    const dialogData = {
      user: {
        id: user.id,
        name: user.name,
        user: user.user,
        mail: user.mail
      },
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(UserAccessDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false
    });

          dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Accesos actualizados para usuario
        }
      });
  }

  deleteUser(user: User): void {
    const userName = user.name || user.user || 'este usuario';

    this.userService.checkUserCanDelete(user.id).subscribe({
      next: (response) => {
        if (response.canDelete) {
          this.confirmDialog.confirmDelete(
            `¿Eliminar el usuario "${userName}"?`,
            'Eliminar usuario'
          ).subscribe(ok => {
            if (ok) this.ejecutarEliminacion(user);
          });
        } else {
          const yaDeshabilitado = String(user.enabled) === '0';
          if (yaDeshabilitado) {
            this.snackBar.open('Este usuario ya está deshabilitado y no puede eliminarse por tener registros relacionados.', 'Cerrar', {
              duration: 4000
            });
          } else {
            const relationsText = response.relations?.length
              ? response.relations.join(', ')
              : 'registros relacionados';
            this.confirmDialog.confirm({
              title: 'No se puede eliminar',
              message: `Este usuario tiene ${relationsText} relacionados. ¿Deshabilitarlo en su lugar?`,
              variant: 'warning',
              confirmText: 'Deshabilitar',
              cancelText: 'Cancelar'
            }).subscribe(ok => {
              if (ok) this.ejecutarDeshabilitacion(user);
            });
          }
        }
      },
      error: (error) => {
        this.snackBar.open(
          `Error al verificar usuario: ${error?.error?.message || error?.message || 'Error desconocido'}`,
          'Error',
          { duration: 5000 }
        );
      }
    });
  }

  private ejecutarEliminacion(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.users = this.users.filter(u => u.id !== user.id);
          this.applyFilter();
          this.snackBar.open('Usuario eliminado exitosamente', 'Éxito', { duration: 2000 });
        } else {
          this.snackBar.open(response?.message || 'Error al eliminar usuario', 'Error', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open(
          `Error al eliminar usuario: ${error?.error?.message || error?.message || 'Error desconocido'}`,
          'Error',
          { duration: 5000 }
        );
      }
    });
  }

  private ejecutarDeshabilitacion(user: User): void {
    this.userService.disableUser(user.id).subscribe({
      next: (response) => {
        if (response && response.success) {
          const idx = this.users.findIndex(u => u.id === user.id);
          if (idx >= 0) {
            this.users[idx] = { ...this.users[idx], enabled: '0' };
          }
          this.applyFilter();
          this.snackBar.open('Usuario deshabilitado exitosamente', 'Éxito', { duration: 2000 });
        } else {
          this.snackBar.open(response?.message || 'Error al deshabilitar usuario', 'Error', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open(
          `Error al deshabilitar usuario: ${error?.error?.message || error?.message || 'Error desconocido'}`,
          'Error',
          { duration: 5000 }
        );
      }
    });
  }

  getRoleColor(roleId: string): string {
    const roleColors: { [key: string]: string } = {
      '1': 'bg-blue-100 text-blue-800',
      '2': 'bg-green-100 text-green-800',
      '3': 'bg-yellow-100 text-yellow-800',
      '4': 'bg-purple-100 text-purple-800',
      '5': 'bg-red-100 text-red-800'
    };
    return roleColors[roleId] || 'bg-gray-100 text-gray-800';
  }

  getRoleName(roleId: string): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Desconocido';
  }

  getAgencyName(agencyId: string): string {
    const agency = this.agencies.find(a => a.id === agencyId);
    return agency ? agency.name : (agencyId === '0' ? 'Sin agencia' : `Agencia ${agencyId}`);
  }

  getUserStatus(enabled: string): { text: string; class: string; icon: string } {
    if (enabled === '1') {
      return {
        text: 'Activo',
        class: 'bg-green-100 text-green-800 border-green-200',
        icon: 'check_circle'
      };
    } else {
      return {
        text: 'Inactivo',
        class: 'bg-red-100 text-red-800 border-red-200',
        icon: 'cancel'
      };
    }
  }

  getPageRange(): string {
    if (!this.paginator || this.dataSource.filteredData.length === 0) {
      return '0-0';
    }
    
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.dataSource.filteredData.length);
    
    return `${startIndex}-${endIndex}`;
  }
}
