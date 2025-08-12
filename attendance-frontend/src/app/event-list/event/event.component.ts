import {Component, Input} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {EventTagComponent} from './event-tag/event-tag.component';
import {DatePipe, NgIf, NgStyle} from '@angular/common';
import {Router} from '@angular/router';
import {MBEvent} from '../../models/mb-event';
import {Constants} from '../../utilities/constants';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatDivider,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    EventTagComponent,
    DatePipe,
    NgIf,
    NgStyle
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  protected readonly REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;

  constructor(private router: Router) {
  }

  @Input()
  event: MBEvent | null = null;

  @Input()
  fromList: string = '';

  navigateToForm() {
    console.log(this.fromList);
    this.router.navigate(['/attendance-form', this.event?.eventId], { queryParams: { fromList: this.fromList } });
  }

  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;

}
