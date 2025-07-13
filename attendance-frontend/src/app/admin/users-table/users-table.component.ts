import {AfterViewInit, Component, inject, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {User} from '../../models/user';
import {FormsModule, NgForm} from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {SessionCacheService} from '../../services/session-cache.service';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {Utilities} from '../../utilities/utilities';
import {Member} from '../../models/member';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatHeaderRowDef,
    MatRowDef,
    FormsModule,
    NgIf,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private _snackBar = inject(MatSnackBar);

  @Input('role')
  role: string | null = null;

  @ViewChild('userPaginator') userPaginator: MatPaginator | null = null;

  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;
  userDialogRef!: MatDialogRef<any>;

  users: User[] = [];
  userColumns: string[] = [];
  userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.users);

  constructor(private adminService: AdminService,
              private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.userDataSource.paginator = this.userPaginator;
  }

  ngOnInit() {
    this.userColumns = this.role ? ['email', 'name'] : ['email', 'name', 'role'];
    this.fetchUsers();
  }

  fetchUsers() {
    if (!this.role) {
      this.adminService.getAllUsers().subscribe(users => {
        this.users = users;
        this.userDataSource = new MatTableDataSource(this.users);
        this.userDataSource.paginator = this.userPaginator;
      })
    } else {
      this.adminService.getUsersByRole(this.role).subscribe(users => {
        this.users = users;
        this.userDataSource = new MatTableDataSource(this.users);
        this.userDataSource.paginator = this.userPaginator;
      })
    }
  }

  openUserDialog() {
    this.userDialogRef = this.dialog.open(this.addUserDialog);
  }

  onCancelDialog() {
    this.dialog.closeAll();
  }


  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
