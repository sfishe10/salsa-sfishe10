import {Component, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, NgForm} from '@angular/forms';
import {UsersTableComponent} from '../users-table/users-table.component';
import {Utilities} from '../../utilities/utilities';
import {AdminService} from '../../services/admin.service';
import {UserService} from '../../services/user.service';
import {StationService} from '../../services/station.service';
import {SessionCacheService} from '../../services/session-cache.service';
import {Router} from '@angular/router';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';
import {Constants} from '../../utilities/constants';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForOf} from '@angular/common';
import {User} from '../../models/user';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    UsersTableComponent,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDialogActions,
    FormsModule,
    MatInput,
    NgForOf
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  userEmail: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  userRole: string = '';

  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;
  userDialogRef!: MatDialogRef<any>;
  @ViewChild('userForm') userForm!: NgForm;

  @ViewChild('roleDialog') roleDialog!: TemplateRef<any>;
  roleDialogRef!: MatDialogRef<any>;

  @ViewChildren(UsersTableComponent) userTables!: QueryList<UsersTableComponent>;

  @ViewChild('uploadCsvDialog') uploadCsvDialog!: TemplateRef<any>;
  uploadCsvDialogRef!: MatDialogRef<any>;

  @ViewChild('missingEmailsConfirmationDialog') missingEmailsConfirmationDialog!: TemplateRef<any>;
  missingEmailsConfirmationDialogRef!: MatDialogRef<any>;

  selectedFile: File | null = null;

  emailsMissingUsers: string[] = [];

  userRoleOptions: string[] = Utilities.getRoleOptions();

  constructor(private adminService: AdminService,
              private userService: UserService,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog,
              private router: Router,
              private snackbar: MatSnackBar) {
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

  openRoleDialog() {
    this.roleDialogRef = this.dialog.open(this.roleDialog);
  }

  submitUser(form: NgForm) {
    let newUser = {
      email: form.value.userEmail,
      firstName: form.value.userFirstName,
      lastName: form.value.userLastName,
      role: form.value.userRole
    } as User;

    this.adminService.createUser(newUser).subscribe((insertedUser: User) => {
      this.userTables.forEach(table => {
        table.fetchUsers();
      })
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

  // updateUserRole(form: NgForm) {
  //   const user = {
  //     email: form.value.userEmail,
  //     role: form.value.userRole
  //   } as User;
  //   this.userService.updateUser(user).subscribe(() => {
  //     this.userTables.forEach(table => {
  //       table.fetchUsers();
  //     })
  //     this.openSnackBar("User updated!", "Ok", 3000);
  //     form.reset();
  //     this.roleDialogRef.close();
  //   }, error => {
  //     console.log(error);
  //     this.openSnackBar("Error assigning role", "Ok", 3000);
  //   })
  // }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   this.selectedFile = input.files?.[0] ?? null;
  // }
  //
  // clearFile(fileInput: HTMLInputElement) {
  //   this.selectedFile = null;
  //   fileInput.value = '';
  // }

  onUploadCsvClicked() {
    this.uploadCsvDialogRef = this.dialog.open(this.uploadCsvDialog);
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // if we've already been warned about invalid emails, proceed and ignore them
    formData.append('ignoreInvalidEmails', this.missingEmailsConfirmationDialogRef ? 'true' : 'false');
    this.adminService.uploadRolesCsv(formData).subscribe({
      next: (res: any) => {
        this.emailsMissingUsers = [];
        this.onCancelDialog();
        this.openSnackBar('Roles Assigned', 'OK', 3000);
      },
      error: (err: any) => {
        if (err.status === 422) {
          this.emailsMissingUsers = [];
          err.error.forEach((email: string) => {
            this.emailsMissingUsers.push(email);
          })
          this.missingEmailsConfirmationDialogRef = this.dialog.open(this.missingEmailsConfirmationDialog);
        } else {
          console.error('Upload error:', err)
          this.onCancelDialog();
          this.openSnackBar('Error uploading CSV', 'OK', 3000);
        }
      },
    });
  }

  cancelDialog() {
    setTimeout(() => {
      this.userForm?.reset();
    });
    this.dialog.closeAll();
  }

  closeDialogAndClearEmails() {
    this.emailsMissingUsers = [];
    this.cancelDialog();
  }


  openSnackBar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  readonly ROLE_ADMIN = Constants.ROLE_ADMIN;
  readonly ROLE_OFFICER = Constants.ROLE_OFFICER;
  readonly ROLE_SECTION_LEADER = Constants.ROLE_SECTION_LEADER;
  readonly ROLE_ATTENDANCE_TAKER = Constants.ROLE_ATTENDANCE_TAKER;
  readonly ROLE_MEMBER = Constants.ROLE_MEMBER;
}
