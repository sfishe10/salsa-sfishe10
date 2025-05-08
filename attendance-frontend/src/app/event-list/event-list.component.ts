import {Component, Input, OnInit} from '@angular/core';
import {EventComponent} from './event/event.component';
import {NgForOf} from '@angular/common';
import {MBEvent} from '../models/mb-event';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    EventComponent,
    NgForOf
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {

  @Input()
  eventList: MBEvent[] = [];

  constructor() {
  }

  ngOnInit() {
  }
}
