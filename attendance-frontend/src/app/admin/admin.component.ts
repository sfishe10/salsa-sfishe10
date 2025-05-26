import {Component, inject, OnInit} from '@angular/core';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormsModule, NgForm} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {Constants} from '../utilities/constants';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {MBEvent} from '../models/mb-event';
import {Term} from '../models/term';
import {EventService} from '../services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PepBand} from '../models/pep-band';

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
    MatDatepickerModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  eventTypeOptions: string[] = [
    Constants.EVENT_TYPE_EVENT,
    Constants.EVENT_TYPE_REHEARSAL
  ]

  pepBandOptions: PepBand[] = [];

  terms: Term[] = [];

  eventTitle: string = "";
  eventType: string | null = null;
  eventPepBand: string | null = null;
  eventDate: Date | null = null;
  eventTime: string = '';
  eventTerm: Term = {
    termId: -1,
    termName: '',
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getTerms().subscribe(terms => {
      terms.forEach(term => {
        this.terms.push(term);
      })
    })

    this.eventService.getPepBands().subscribe(pepBands => {
      pepBands.forEach(band => {
        this.pepBandOptions.push(band);
      })
    })
  }

  submitEvent(form: NgForm) {
    this.combineDateAndTimeInputs();

    let newEvent = {
      eventId: -1, // will get assigned when the backend puts it in the database
      type: form.value.eventType,
      title: form.value.eventTitle,
      date: form.value.eventDate,
      pepBandId: form.value.eventPepBand ? form.value.eventPepBand.bandId : null,
      termId: form.value.eventTerm.termId
    } as MBEvent;

    console.log(newEvent);

    this.eventService.createEvent(newEvent).subscribe(newEvent => {
      this.openSnackBar("Event created!", "Ok", 3000);
    }, error => {
      console.log(error);
      this.openSnackBar("Error creating event", "Ok", 3000);
    })
  }

  combineDateAndTimeInputs() {
    const [hours, minutes] = this.eventTime.split(':').map(Number);
    this.eventDate?.setHours(hours, minutes, 0);
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  readonly EVENT_TYPE_EVENT = Constants.EVENT_TYPE_EVENT
}
