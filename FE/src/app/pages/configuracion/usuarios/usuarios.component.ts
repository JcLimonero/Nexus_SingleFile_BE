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
import { User, UserResponse } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';

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
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['Id', 'Name', 'User', 'Mail', 'IdUserRol', 'DefaultAgency', 'Enabled', 'acciones'];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  roleFilter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
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
          this.dataSource.data = this.users;
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar usuarios', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error al cargar usuarios', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim();
    
    // Aplicar filtros
    let filteredData = this.users;
    
    // Filtro de estado
    if (this.statusFilter !== '') {
      filteredData = filteredData.filter(user => user.Enabled === this.statusFilter);
    }
    
    // Filtro de rol
    if (this.roleFilter !== '') {
      filteredData = filteredData.filter(user => user.IdUserRol === this.roleFilter);
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

  openCreateDialog(): void {
    const dialogData = {
      user: {} as User,
      mode: 'create'
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

  deleteUser(user: User): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el usuario "${user.Name}"?`)) {
      this.userService.deleteUser(user.Id).subscribe({
        next: (response) => {
          if (response.success) {
            this.users = this.users.filter(u => u.Id !== user.Id);
            this.applyFilter();
            this.snackBar.open('Usuario eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar usuario', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error al eliminar usuario', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleStatus(user.Id).subscribe({
      next: (response) => {
        if (response.success) {
          user.Enabled = user.Enabled === '1' ? '0' : '1';
          this.applyFilter();
          this.snackBar.open(`Usuario ${user.Enabled === '1' ? 'activado' : 'desactivado'} exitosamente`, 'Éxito', {
            duration: 2000
          });
        } else {
          this.snackBar.open(response.message || 'Error al cambiar estado del usuario', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.snackBar.open('Error al cambiar estado del usuario', 'Error', {
          duration: 3000
        });
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
    const roleNames: { [key: string]: string } = {
      '1': 'Administrador',
      '2': 'Usuario',
      '3': 'Supervisor',
      '4': 'Auditor',
      '5': 'Solo Lectura'
    };
    return roleNames[roleId] || 'Desconocido';
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
