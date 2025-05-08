import {Component, OnInit} from '@angular/core';
import {EventListComponent} from '../event-list/event-list.component';
import {EventService} from '../services/event.service';
import {MBEvent} from '../models/mb-event';

@Component({
  selector: 'app-recent-events',
  standalone: true,
  imports: [
    EventListComponent
  ],
  templateUrl: './recent-events.component.html',
  styleUrl: './recent-events.component.css'
})
export class RecentEventsComponent implements OnInit {
  public eventList: MBEvent[] = [];

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getRecentEvents().subscribe(events => {
      this.eventList = events;
    })
  }

}
