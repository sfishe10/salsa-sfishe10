import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../services/event.service';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatFormField, MatLabel, MatOption, MatSelect} from '@angular/material/select';
import {
  FormArray,
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Constants} from '../utilities/constants';
import {Utilities} from '../utilities/utilities';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SessionCacheService} from '../services/session-cache.service';
import {Member} from '../models/member';
import {MemberService} from '../services/member.service';
import {Section} from '../models/section';
import {AttendanceSelectComponent} from './attendance-select/attendance-select.component';
import {MemberSelectComponent} from './member-select/member-select.component';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    MatSelect,
    MatOption,
    NgForOf,
    MatFormField,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatButton,
    MatIcon,
    NgStyle,
    MatLabel,
    FormsModule,
    MatIconButton,
    AttendanceSelectComponent,
    MemberSelectComponent
  ],
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.css'
})
export class AttendanceFormComponent implements OnInit {

  readonly PEP_EVENT: string = Constants.EVENT_TYPE_PEP_EVENT;
  readonly REHEARSAL: string = Constants.EVENT_TYPE_REHEARSAL;

  public selectedSection: Section | null = null;

  public sectionOptions: Section[] = [];

  eventId!: number;

  event!: MBEvent;

  private _snackBar = inject(MatSnackBar);

  eventAttendances: EventAttendance[] = [];

  attendanceOptions: string[] = []

  form: FormGroup;

  columnsToDisplay = ['name', 'attendance', 'delete'];

  sectionMembers: Member[] = [];

  showRequiredFieldError: boolean = false;

  showSubError: boolean = false;

  showDuplicateMemberError: boolean = false;

  fromList: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private eventService: EventService,
              private fb: FormBuilder,
              public sessionCacheService: SessionCacheService,
              private memberService: MemberService) {
    this.form = this.fb.group({
      attendances: this.fb.array([])
    });
  }

  get attendances() {
    return this.form.get('attendances') as FormArray
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fromList = params['fromList'] || 'upcoming';
    })

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    let sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION_ID);
    this.sectionMembers = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION_MEMBERS);

    this.eventService.getEvent(this.eventId).subscribe(event => {
      this.event = event;
      this.attendanceOptions = Utilities.getAttendanceOptions(this.event?.type === this.PEP_EVENT);
    })

    this.eventService.getEventAttendance(this.eventId, sectionId).subscribe(attendances => {
      console.log(attendances)
      attendances.forEach(att => {
        this.eventAttendances.push(att);
      });
      this.form = this.fb.group({
        attendances: this.fb.array(attendances.map((att) =>
          this.fb.group({
            attendanceId: [att.attendanceId],
            memberId: [att.member?.memberId],
            attendance: [att.attendance],
            sub: [att.sub],
            required: [att.required]
          })
        ))
      });
      console.log(this.form);
    })

    this.sectionOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS);

    this.selectedSection = this.sectionOptions
      .find((section: Section) => section.sectionId == sectionId) ?? null;
  }

  onSectionChange(section: Section) {
    let sectionId = section.sectionId;

    this.memberService.getMembersBySectionId(sectionId).subscribe(members => {
      this.sectionMembers = members;
    })

    if (!this.eventId) {
      return;
    }

    this.eventService.getEventAttendance(this.eventId, sectionId).subscribe(attendances => {
      this.eventAttendances = [];

      attendances.forEach(att => {
        this.eventAttendances.push(att);
      });
      this.form = this.fb.group({
        attendances: this.fb.array(attendances.map((att) =>
          this.fb.group({
            attendanceId: [att.attendanceId],
            memberId: [att.member?.memberId],
            attendance: [att.attendance],
            sub: [att.sub],
            required: [att.required]
          })
        ))
      });
    })
  }

  public onSubmit() {
    // clear old error messages
    this.showRequiredFieldError = false;
    this.showSubError = false;

    let errors = this.validateForm();

    if (errors == 0) {
      this.eventService.submitAttendanceForm(this.eventAttendances).subscribe(() => {
        this.showRequiredFieldError = false;
        this.showSubError = false;
        this.showDuplicateMemberError = false;
        this.openSnackBar("Form submitted!", "Ok", 3000);
      }, error => {
        console.log(error);
        this.showRequiredFieldError = false;
        this.showSubError = false;
        this.showDuplicateMemberError = false;
        this.openSnackBar("Error submitting form", "Ok", 3000);
      })
    }
  }

  private validateForm() {
    const formGroups = this.attendances.controls;
    let errors: number = 0;
    let seenMemberIds: number[] = [];
    for (let i = 0; i < this.eventAttendances.length; i++) {
      const group = formGroups[i];
      const memberId = group.get('memberId')?.value;
      const attendance = group.get('attendance')?.value;
      const sub = group.get('sub')?.value;
      const required = group.get('required')?.value;

      if (!attendance) {
        group.get('attendance')?.setErrors(({required: true}));
        this.showRequiredFieldError = true;
        errors++;
      }

      if (!memberId) {
        group.get('memberId')?.setErrors({required: true});
        this.showRequiredFieldError = true;
        errors++;
      }

      if (attendance == Constants.ATTENDANCE_SUB && !sub) {
        group.get('sub')?.setErrors({required: true})
        this.showSubError = true;
        errors++;
      }

      if (seenMemberIds.includes(memberId)) {
        group.get('memberId')?.setErrors({required: true});
        this.showDuplicateMemberError = true;
        errors++;
      }

      seenMemberIds.push(memberId);

      this.eventAttendances[i].member = this.sectionMembers.find(m => m.memberId === memberId) ?? null;
      this.eventAttendances[i].attendance = attendance;
      this.eventAttendances[i].sub = sub ?? null;
      this.eventAttendances[i].required = required;
    }
    return errors;
  }

  public markAllPresent() {
    this.attendances.controls.forEach(control => {
      let group = control as FormGroup;
      group.get('attendance')?.setValue(Constants.ATTENDANCE_PRESENT);
    })
  }

  public clearForm() {
    this.attendances.controls.forEach(control => {
      let group = control as FormGroup;
      group.get('attendance')?.setValue('');
    })
  }

  public addAttendee() {
    this.eventService.addAttendance(this.eventId, null).subscribe(response => {
      const newAttendance = {
        attendanceId: response.attendanceId,
        event: this.event,
        attendance: '',
        member: null,
        sub: null,
        required: false
      } as EventAttendance
      this.eventAttendances.push(newAttendance);
      this.eventAttendances = [...this.eventAttendances];
      this.attendances.push(
        this.fb.group({
          attendanceId: [response.attendanceId],
          memberId: [null],
          attendance: [''],
          sub: [null],
          required: [false]
        })
      );
    }, error => {
      console.log(error);
      this.openSnackBar("Error Adding Attendee", "Ok", 3000);
    })
  }

  public removeAttendee(eventAttendance: EventAttendance) {
    console.log(this.eventAttendances);
    console.log(this.attendances);
    let attendanceId = eventAttendance.attendanceId;
    console.log(eventAttendance);
    this.eventService.removeAttendance(attendanceId).subscribe(() => {
      this.eventAttendances = this.eventAttendances.filter(a => a.attendanceId != attendanceId);
      const index = this.attendances.controls.findIndex(ctrl => ctrl.get('attendanceId')?.value === attendanceId);
      this.attendances.removeAt(index);

    }, error => {
      console.log(error);
      this.openSnackBar("Error Removing Attendee", "Ok", 3000);
    })
  }

  getAvailableMembers(i: number): Member[] {
    let members = this.sectionMembers.filter(m =>
      !this.eventAttendances.some(a => a.required && a.member?.memberId === m.memberId)
    );
    return members
  }

  includeSubOption(): boolean {
    return this.event?.type === Constants.EVENT_TYPE_PEP_EVENT;
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  goBack() {
    this.router.navigate(['/events'], { queryParams: { type: this.fromList } })
  }

  protected readonly Utilities = Utilities;
  protected readonly Constants = Constants
}
