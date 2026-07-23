import { Component } from '@angular/core';
import {StationOptionComponent} from './station-option/station-option.component';
import {Router} from '@angular/router';
import {Utilities} from '../utilities/utilities';
import {NgForOf} from '@angular/common';
import {Constants} from '../utilities/constants';

@Component({
  selector: 'app-stations-menu-page',
  standalone: true,
  imports: [
    StationOptionComponent,
    NgForOf
  ],
  templateUrl: './stations-menu-page.component.html',
  styleUrl: './stations-menu-page.component.css'
})
export class StationsMenuPageComponent {
  stationsOptions: string[] = [];

  constructor(private router: Router) {
    this.stationsOptions = Utilities.getStationsOptions();
  }

  navigateToAction(option: string) {
    if (option === Constants.STATION_OPTION_EVALUATE) {
      // if evaluating, go to list of members
      this.router.navigate(['stations/evaluate'])
    } else if (option === Constants.STATION_OPTION_LEAD) {
      // if leading, go to list of stations
      this.router.navigate(['stations-list'], {queryParams: {action: 'lead'}})
    }
  }
}
