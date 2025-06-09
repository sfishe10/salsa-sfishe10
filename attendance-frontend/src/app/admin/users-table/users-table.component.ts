import {AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {NgForOf} from '@angular/common';
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

  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;
  userDialogRef!: MatDialogRef<any>;

  @ViewChild('userPaginator') userPaginator: MatPaginator | null = null;

  @ViewChild('userForm') userForm!: NgForm;

  userRoleOptions: string[] = Utilities.getRoleOptions();

  users: User[] = [];
  userColumns: string[] = ['email', 'name', 'role'];
  userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.users);

  userEmail: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  userRole: string = '';

  constructor(private adminService: AdminService,
              private dialog: MatDialog,
              private sessionCacheService: SessionCacheService) {
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
      this.userDataSource = new MatTableDataSource(this.users);
      this.userDataSource.paginator = this.userPaginator;
    })
  }

  openUserDialog() {
    this.userDialogRef = this.dialog.open(this.addUserDialog);
  }

  onCancelDialog() {
    setTimeout(() => {
      this.userForm?.reset();
    });
    this.dialog.closeAll();
  }

  submitUser(form: NgForm) {
    let newUser = {
      email: form.value.userEmail,
      firstName: form.value.userFirstName,
      lastName: form.value.userLastName,
      role: form.value.userRole
    }

    this.adminService.createUser(newUser).subscribe((insertedUser: User) => {
      this.users.push(insertedUser);
      this.userDataSource = new MatTableDataSource(this.users);
      this.userDataSource.paginator = this.userPaginator;
      this.openSnackBar("User added!", "Ok", 3000);
      form.reset();
      this.userDialogRef.close();
    }, error => {
      if (error.status === 409) {
        this.openSnackBar("Invalid email - already in use", "Ok", 3000);
      } else {
        console.log(error);
        this.openSnackBar("Error adding User", "Ok", 3000);
      }
    })
  }


  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
