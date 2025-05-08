import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {EventService} from '../services/event.service';
import {MBEvent} from '../models/mb-event';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  event: MBEvent | null = null;

  constructor(private eventService: EventService) { };

  ngOnInit() {
    this.eventService.getEvent(1).subscribe(value => {
      this.event = value;
    })
    console.log(this.event);
  }

}
