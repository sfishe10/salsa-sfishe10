import {Component, OnInit} from '@angular/core';
import {EventService} from '../services/event.service';
import {EventListComponent} from '../event-list/event-list.component';
import {MBEvent} from '../models/mb-event';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [
    EventListComponent
  ],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css'
})
export class UpcomingEventsComponent implements OnInit {
  public eventList: MBEvent[] = [];

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getUpcomingEvents().subscribe(events => {
      this.eventList = events;
    })
  }
}
