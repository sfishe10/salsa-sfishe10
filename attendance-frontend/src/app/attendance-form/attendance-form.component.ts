import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../services/event.service';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
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
import {combineLatest, of, switchMap, tap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    pepBand: "",
    termId: -1
  };

  private _snackBar = inject(MatSnackBar);

  attendees: Member[] = [];

  attendanceOptions: string[] = []

  form: FormGroup;

  columnsToDisplay = ['name', 'attendance'];

  sectionMembers: Member[] = [];

  constructor(private route: ActivatedRoute,
              private eventService: EventService,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      attendances: this.fb.array([])
    });
  }

  get attendances() {
    return this.form.get('attendances') as FormArray
  }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    combineLatest([
      this.eventService.getEvent(eventId),
      this.eventService.getSectionMembers(2)
    ]).pipe(
      tap(([event, sectionMembers]) => {
        this.event = event;
        this.sectionMembers = sectionMembers;
        this.attendanceOptions = Utilities.getAttendanceOptions(this.event?.type === this.EVENT);
      }),
      switchMap(([event, sectionMembers]) => {
        if (event?.type === Constants.EVENT_TYPE_EVENT) {
          return this.eventService.getEventAttendees(eventId);
        } else {
          return of(sectionMembers); // wrap static sectionMembers into observable
        }
      })
    ).subscribe(attendees => {
      this.attendees = attendees;
      attendees.forEach((attendee) => {
        this.attendances.push(
          this.fb.group({
            attendance: '',
            sub: ''
          })
        );
      });
    });
  }

  public onSubmit() {
    let entries: EventAttendance[] = [];
    for (let i = 0; i < this.attendees.length; i++) {
      let eventAttendance: EventAttendance = {
        eventId: this.event.eventId,
        memberId: this.attendees[i].memberId,
        attendance: this.attendances.controls[i].get('attendance')?.value
      }
      entries.push(eventAttendance);
    }
    this.eventService.submitAttendanceForm(entries).subscribe(() => {
      this.openSnackBar("Form submitted!", "Ok", 3000);
    }, error => {
      console.log(error);
      this.openSnackBar("Error submitting form", "Ok", 3000);
    })
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
