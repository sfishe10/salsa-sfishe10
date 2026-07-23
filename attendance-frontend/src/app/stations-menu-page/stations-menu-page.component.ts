import { Component } from '@angular/core';
import {StationOptionComponent} from './station-option/station-option.component';
import {Constants} from '../utilities/constants';

@Component({
  selector: 'app-stations-menu-page',
  standalone: true,
  imports: [
    StationOptionComponent
  ],
  templateUrl: './stations-menu-page.component.html',
  styleUrl: './stations-menu-page.component.css'
})
export class StationsMenuPageComponent {
  readonly STATION_OPTION_TEACH = Constants.STATION_OPTION_TEACH;
  readonly STATION_OPTION_EVALUATE = Constants.STATION_OPTION_EVALUATE;
  readonly STATION_OPTION_LEAD = Constants.STATION_OPTION_LEAD;
}
