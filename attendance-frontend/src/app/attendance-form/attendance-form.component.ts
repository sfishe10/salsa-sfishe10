import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../services/event.service';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Constants} from '../utilities/constants';
import {Utilities} from '../utilities/utilities';
import {Member} from '../models/member';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SessionCacheService} from '../services/session-cache.service';
import {MsalBroadcastService} from '@azure/msal-angular';
import {EventMessage, EventType} from '@azure/msal-browser';
import {filter} from 'rxjs';

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
    NgStyle
  ],
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.css'
})
export class AttendanceFormComponent implements OnInit {

  readonly EVENT: string = Constants.EVENT_TYPE_EVENT;
  readonly REHEARSAL: string = Constants.EVENT_TYPE_REHEARSAL;

  event: MBEvent = {
    eventId: -1,
    type: "",
    title: "",
    date: new Date(),
    pepBandId: "",
    termId: -1
  };

  private _snackBar = inject(MatSnackBar);

  attendees: Member[] = [];

  eventAttendances: EventAttendance[] = [];

  attendanceOptions: string[] = []

  form: FormGroup;

  columnsToDisplay = ['name', 'attendance'];

  sectionMembers: Member[] = [];

  showRequiredFieldError: boolean = false;

  showSubError: boolean = false;

  constructor(private route: ActivatedRoute,
              private eventService: EventService,
              private fb: FormBuilder,
              private sessionCacheService: SessionCacheService,
              private msalBroadcastService: MsalBroadcastService) {
    this.form = this.fb.group({
      attendances: this.fb.array([])
    });
  }

  get attendances() {
    return this.form.get('attendances') as FormArray
  }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.sectionMembers = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION_MEMBERS);

    this.eventService.getEvent(eventId).subscribe(event => {
      this.event = event;
      this.attendanceOptions = Utilities.getAttendanceOptions(this.event?.type === this.EVENT);
      event.attendees?.forEach(member => {
        this.attendees.push(member);
      });
      if (event.attendances) {
        event.attendances.forEach(att => this.eventAttendances.push(att));
        this.form = this.fb.group({
          attendances: this.fb.array(event.attendances.map((att) =>
            this.fb.group({
              attendance: [att.attendance],
              sub: [att.subId ? this.sectionMembers.find(m => m.memberId === att.subId) : null]
            })
          ))
        });
      }

    })
  }

  public onSubmit() {
    // clear old error messages
    this.showRequiredFieldError = false;
    this.showSubError = false;

    const formGroups = this.attendances.controls;
    let errors: number = 0;
    for (let i = 0; i < this.attendees.length; i++) {
      const group = formGroups[i];
      const attendance = group.get('attendance')?.value;
      const sub = group.get('sub')?.value;

      if (!attendance) {
        group.get('attendance')?.setErrors(({required: true}));
        this.showRequiredFieldError = true;
        errors++;
      }

      if (attendance == Constants.ATTENDANCE_SUB && !sub) {
        group.get('sub')?.setErrors({required: true})
        this.showSubError = true;
        errors++;
      }

      this.eventAttendances[i].attendance = attendance;
      this.eventAttendances[i].subId = sub ? sub.memberId : null;
    }

    if (errors == 0) {
      this.eventService.submitAttendanceForm(this.eventAttendances).subscribe(() => {
        this.showRequiredFieldError = false;
        this.showSubError = false;
        this.openSnackBar("Form submitted!", "Ok", 3000);
      }, error => {
        console.log(error);
        this.showRequiredFieldError = false;
        this.showSubError = false;
        this.openSnackBar("Error submitting form", "Ok", 3000);
      })
    }
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

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  protected readonly Utilities = Utilities;
  protected readonly Constants = Constants
}
