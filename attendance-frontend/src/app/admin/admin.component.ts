import {AfterViewInit, Component, inject, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, NgForm} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {DatePipe, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
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
    MatIcon
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

  userEmail: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  userRole: string = '';

  @ViewChild('createTermDialog') createTermDialog!: TemplateRef<any>;
  termDialogRef!: MatDialogRef<any>;

  @ViewChild('termForm') termForm!: NgForm;

  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;
  userDialogRef!: MatDialogRef<any>;
  @ViewChild('userForm') userForm!: NgForm;

  @ViewChildren(UsersTableComponent) userTables!: QueryList<UsersTableComponent>;

  userRoleOptions: string[] = Utilities.getRoleOptions();

  @ViewChild(EventsTableComponent) eventsTable!: EventsTableComponent;

  @ViewChild(MembersTableComponent) membersTable!: MembersTableComponent;

  constructor(private adminService: AdminService,
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
  }

  onTermChange(term: Term) {
    this.selectedTerm = term;
    this.eventsTable.onTermChange(term.termId);
    this.membersTable.onTermChange(term.termId);
  }


  openTermDialog() {
    this.termDialogRef = this.dialog.open(this.createTermDialog);
  }

  cancelDialog() {
    setTimeout(() => {
      this.termForm?.reset();
    });
    this.dialog.closeAll();
  }

  submitTerm(form: NgForm) {
    let newTerm = {
      termId: -1, // will get assigned when the backend puts it in the database
      termName: form.value.termName,
      startDate: form.value.termStartDate,
      endDate: form.value.termEndDate
    } as Term;

    this.adminService.createTerm(newTerm).subscribe(() => {
      this.terms.push(newTerm);
      this.openSnackBar("Term created!", "Ok", 3000);
      this.termDialogRef.close();
    }, error => {
      console.log(error);
      this.openSnackBar("Error creating Term", "Ok", 3000);
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

  goToAttendance() {
    this.router.navigate(['/attendance/term', this.selectedTerm?.termId])
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  readonly ROLE_ADMIN = Constants.ROLE_ADMIN;
  readonly ROLE_OFFICER = Constants.ROLE_OFFICER;
  readonly ROLE_ATTENDANCE_TAKER = Constants.ROLE_ATTENDANCE_TAKER;
  readonly ROLE_MEMBER = Constants.ROLE_MEMBER;

}
