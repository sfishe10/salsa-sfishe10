import {AfterViewInit, Component, inject, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, NgForm} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Constants} from '../utilities/constants';
import {
  MatDatepickerModule
} from '@angular/material/datepicker';
import {Term} from '../models/term';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {EventsTableComponent} from './events-table/events-table.component';
import {MembersTableComponent} from './members-table/members-table.component';
import {AdminService} from '../services/admin.service';
import {UsersTableComponent} from './users-table/users-table.component';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatDivider} from '@angular/material/divider';
import {User} from '../models/user';
import {MatTableDataSource} from '@angular/material/table';
import {Utilities} from '../utilities/utilities';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {SessionCacheService} from '../services/session-cache.service';
import {UserService} from '../services/user.service';
import {Station} from '../models/station';
import {StationsService} from '../services/stations.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatFormField,
    MatInputModule,
    FormsModule,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatButton,
    MatDatepickerModule,
    MatTabGroup,
    MatTab,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    DatePipe,
    EventsTableComponent,
    MembersTableComponent,
    UsersTableComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatIcon,
    NgIf,
    MatIconButton
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, AfterViewInit {

  private _snackBar = inject(MatSnackBar);

  terms: Term[] = [];

  selectedTerm: Term | null = null;

  termName: string = "";
  termStartDate: Date | null = null;
  termEndDate: Date | null = null;

  editingTerm: boolean = false;

  userEmail: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  userRole: string = '';

  stations: Station[] = [];

  @ViewChild('termDialog') termDialog!: TemplateRef<any>;
  termDialogRef!: MatDialogRef<any>;

  @ViewChild('termForm') termForm!: NgForm;

  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;
  userDialogRef!: MatDialogRef<any>;
  @ViewChild('userForm') userForm!: NgForm;

  @ViewChild('roleDialog') roleDialog!: TemplateRef<any>;
  roleDialogRef!: MatDialogRef<any>;

  @ViewChildren(UsersTableComponent) userTables!: QueryList<UsersTableComponent>;

  userRoleOptions: string[] = Utilities.getRoleOptions();

  @ViewChild(EventsTableComponent) eventsTable!: EventsTableComponent;

  @ViewChild(MembersTableComponent) membersTable!: MembersTableComponent;

  @ViewChild('uploadCsvDialog') uploadCsvDialog!: TemplateRef<any>;
  uploadCsvDialogRef!: MatDialogRef<any>;

  @ViewChild('missingEmailsConfirmationDialog') missingEmailsConfirmationDialog!: TemplateRef<any>;
  missingEmailsConfirmationDialogRef!: MatDialogRef<any>;

  selectedFile: File | null = null;

  emailsMissingUsers: string[] = [];

  constructor(private adminService: AdminService,
              private userService: UserService,
              private stationsService: StationsService,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.adminService.getTerms().subscribe(terms => {
      let closestDiff: number | null = null;
      let closestTerm: Term | null = null;

      let now = new Date();

      terms.forEach(term => {
        const start = new Date(term.startDate);
        const end = new Date(term.endDate);

        this.terms.push(term);
        if (start <= now && end >= now) {
          this.selectedTerm = term;
        }
        // Track the term with start date closest to now
        const diff = Math.abs(start.getTime() - now.getTime());
        if ((!closestDiff || diff < closestDiff) && start > now) {
          closestDiff = diff;
          closestTerm = term;
        }
      })
      // If no current term matches, fallback to the closest start date
      this.selectedTerm = this.selectedTerm ?? closestTerm;

      if (this.selectedTerm) {
        this.onTermChange(this.selectedTerm);
      }
    })

    this.stationsService.getAllStations().subscribe(stations => {
      this.stations = stations;
    })
  }

  onTermChange(term: Term) {
    this.selectedTerm = term;
    this.eventsTable.onTermChange(term.termId);
    this.membersTable.onTermChange(term.termId);
  }


  openTermDialog(editing: boolean) {
    this.editingTerm = editing;
    if (editing) {
      this.termName = this.selectedTerm?.termName ?? '';
      this.termStartDate = this.selectedTerm?.startDate ? new Date(this.selectedTerm?.startDate) : null;
      this.termEndDate = this.selectedTerm?.endDate ? new Date(this.selectedTerm?.endDate) : null;
    }
    this.termDialogRef = this.dialog.open(this.termDialog);
  }

  cancelDialog() {
    setTimeout(() => {
      this.termForm?.reset();
    });
    this.dialog.closeAll();
  }

  submitTerm(form: NgForm) {
    let newTerm = {
      termId: this.editingTerm ? this.selectedTerm?.termId : -1, // will get assigned when the backend puts it in the database
      termName: form.value.termName,
      startDate: form.value.termStartDate,
      endDate: form.value.termEndDate
    } as Term;

    if (this.editingTerm) {
      this.adminService.updateTerm(newTerm).subscribe(() => {
        if (this.selectedTerm) {
          this.selectedTerm.termName = newTerm.termName;
          this.selectedTerm.startDate = new Date(newTerm.startDate);
          this.selectedTerm.endDate = new Date(newTerm.endDate);
        }
        this.openSnackBar("Term updated!", "Ok", 3000);
        this.termDialogRef.close();
      }, error => {
        console.log(error);
        this.openSnackBar("Error updating Term", "Ok", 3000);
      })
    }
     else {
      this.adminService.createTerm(newTerm).subscribe(() => {
        this.terms.push(newTerm);
        this.openSnackBar("Term created!", "Ok", 3000);
        this.termDialogRef.close();
      }, error => {
        console.log(error);
        this.openSnackBar("Error creating Term", "Ok", 3000);
      })
    }
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

  updateUserRole(form: NgForm) {
    const user = {
      email: form.value.userEmail,
      role: form.value.userRole
    } as User;
    this.userService.updateUser(user).subscribe(() => {
      this.userTables.forEach(table => {
        table.fetchUsers();
      })
      this.openSnackBar("User updated!", "Ok", 3000);
      form.reset();
      this.roleDialogRef.close();
    }, error => {
      console.log(error);
      this.openSnackBar("Error assigning role", "Ok", 3000);
    })
  }

  goToAttendance() {
    this.router.navigate(['/attendance/term', this.selectedTerm?.termId])
  }

  onUploadCsvClicked() {
    this.uploadCsvDialogRef = this.dialog.open(this.uploadCsvDialog);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  clearFile(fileInput: HTMLInputElement) {
    this.selectedFile = null;
    fileInput.value = '';
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

  closeDialogAndClearEmails() {
    this.emailsMissingUsers = [];
    this.onCancelDialog();
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  readonly ROLE_ADMIN = Constants.ROLE_ADMIN;
  readonly ROLE_OFFICER = Constants.ROLE_OFFICER;
  readonly ROLE_SECTION_LEADER = Constants.ROLE_SECTION_LEADER;
  readonly ROLE_ATTENDANCE_TAKER = Constants.ROLE_ATTENDANCE_TAKER;
  readonly ROLE_MEMBER = Constants.ROLE_MEMBER;

}
