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
import { User, UserResponse, UserRole, UserRoleResponse, Agency, AgencyResponse } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { UserAccessDialogComponent } from './user-access-dialog/user-access-dialog.component';

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
    MatChipsModule
  ]
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  roles: UserRole[] = [];
  agencies: Agency[] = [];
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['Id', 'Name', 'User', 'Mail', 'IdUserRol', 'DefaultAgency', 'AssignedAgencies', 'Status', 'acciones'];
  loading = false;
  searchTerm = '';
  roleFilter = '';
  agencyFilter = '';
  assignedAgencyFilter = '';
  statusFilter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadAgencies();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm) ||
             data.User.toLowerCase().includes(searchTerm) ||
             data.Mail.toLowerCase().includes(searchTerm);
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
    let usersProcessed = 0;
    const totalUsers = this.users.length;
    
    if (totalUsers === 0) {
      this.dataSource.data = this.users;
      this.applyFilter();
      this.loading = false;
      return;
    }

    this.users.forEach((user, index) => {
      this.userService.getUserAgencies(user.Id).subscribe({
        next: (response: any) => {
          if (response.success) {
            user.AssignedAgencies = response.data.agencies;
            user.AssignedAgencyNames = response.data.agencies_details.map((agency: any) => agency.AgencyName);
          } else {
            user.AssignedAgencies = [];
            user.AssignedAgencyNames = [];
          }
          
          usersProcessed++;
          
          // Cuando se han procesado todos los usuarios, actualizar la tabla
          if (usersProcessed === totalUsers) {
            this.dataSource.data = this.users;
            this.applyFilter();
            this.loading = false;
          }
        },
        error: (error) => {
          console.warn(`Error al cargar agencias para usuario ${user.Id}:`, error);
          user.AssignedAgencies = [];
          user.AssignedAgencyNames = [];
          usersProcessed++;
          
          if (usersProcessed === totalUsers) {
            this.dataSource.data = this.users;
            this.applyFilter();
            this.loading = false;
          }
        }
      });
    });
  }

  loadRoles(): void {
    this.userService.getUserRoles().subscribe({
      next: (response: UserRoleResponse) => {
        if (response.success) {
          this.roles = response.data.roles;
        } else {
          // Error al cargar roles
        }
      },
      error: (error) => {
        // Error loading roles
      }
    });
  }

  loadAgencies(): void {
    this.userService.getAgencies().subscribe({
      next: (response: AgencyResponse) => {
        if (response.success) {
          this.agencies = response.data.agencies.filter(agency => agency.Enabled === '1');
        } else {
          // Error al cargar agencias
        }
      },
      error: (error) => {
        // Error loading agencies
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim();
    
    // Aplicar filtros
    let filteredData = this.users;
    
    // Filtro de rol
    if (this.roleFilter !== '') {
      filteredData = filteredData.filter(user => user.IdUserRol === this.roleFilter);
    }
    
    // Filtro de agencia predeterminada
    if (this.agencyFilter !== '') {
      filteredData = filteredData.filter(user => user.DefaultAgency === this.agencyFilter);
    }
    
    // Filtro de agencias asignadas
    if (this.assignedAgencyFilter !== '') {
      filteredData = filteredData.filter(user => 
        user.AssignedAgencies && 
        Array.isArray(user.AssignedAgencies) && 
        user.AssignedAgencies.includes(this.assignedAgencyFilter)
      );
    }
    
    // Filtro de estado
    if (this.statusFilter !== '') {
      filteredData = filteredData.filter(user => user.Enabled === this.statusFilter);
    }
    
    // Filtro de búsqueda de texto
    if (filterValue !== '') {
      filteredData = filteredData.filter(user => 
        user.Name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.User.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.Mail.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    this.dataSource.data = filteredData;
    
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
        Id: user.Id!,
        Name: user.Name,
        User: user.User,
        Email: user.Mail
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
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar el usuario "${user.Name || user.User}"?`);
    
    if (confirmDelete) {
      this.userService.deleteUser(user.Id).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.users = this.users.filter(u => u.Id !== user.Id);
            this.applyFilter();
            this.snackBar.open('Usuario eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response?.message || 'Error al eliminar usuario', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          this.snackBar.open(`Error al eliminar usuario: ${error.message || 'Error desconocido'}`, 'Error', {
            duration: 5000
          });
        }
      });
    }
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
    const role = this.roles.find(r => r.Id === roleId);
    return role ? role.Name : 'Desconocido';
  }

  getAgencyName(agencyId: string): string {
    const agency = this.agencies.find(a => a.Id === agencyId);
    return agency ? agency.Name : (agencyId === '0' ? 'Sin agencia' : `Agencia ${agencyId}`);
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
