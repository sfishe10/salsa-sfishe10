import {Component, Input} from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';

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

  constructor(private router: Router) {
  }

  @Input()
  option: string = '';

  navigateToAction() {
    // this.router.navigate()
    // if evaluating, go to list of members
    // if leading, go to list of stations
  }

}
