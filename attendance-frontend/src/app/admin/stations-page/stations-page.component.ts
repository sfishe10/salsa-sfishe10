import {Component, OnInit} from '@angular/core';
import {StationsTableComponent} from '../../shared/stations-table/stations-table.component';
import {Station} from '../../models/station';
import {StationService} from '../../services/station.service';
import {SessionCacheService} from '../../services/session-cache.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stations-page',
  standalone: true,
  imports: [
    StationsTableComponent
  ],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.css'
})
export class StationsPageComponent implements OnInit {
  stations: Station[] = [];


  constructor(private stationsService: StationService,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.stationsService.getAllStations().subscribe(stations => {
      this.stations = stations;
    })
  }

  navigateToStation(stationId: number) {
    this.router.navigate(['/station', stationId]);
  }
}
