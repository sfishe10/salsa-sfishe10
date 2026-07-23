import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-station-option',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
  ],
  templateUrl: './station-option.component.html',
  styleUrl: './station-option.component.css'
})
export class StationOptionComponent {

  @Input()
  option: string = '';

  @Output() buttonClicked = new EventEmitter<string>();

  navigateToAction() {
    this.buttonClicked.emit(this.option);
  }

}
