import {Component, Input} from '@angular/core';
import {MatCard, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-event-tag',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle
  ],
  templateUrl: './event-tag.component.html',
  styleUrl: './event-tag.component.css'
})
export class EventTagComponent {
  @Input()
  tagText: string| null | undefined = '';

}
