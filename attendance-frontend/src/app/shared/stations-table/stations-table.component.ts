import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {SessionCacheService} from '../../services/session-cache.service';
import {Router} from '@angular/router';
import {StationsService} from '../../services/stations.service';
import {Station} from '../../models/station';

@Component({
  selector: 'app-stations-table',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderRow,
    MatCell,
    MatColumnDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRow,
    MatRowDef
  ],
  templateUrl: './stations-table.component.html',
  styleUrl: './stations-table.component.css'
})
export class StationsTableComponent implements OnInit {

  stations: Station[] = [];

  stationsLoaded: boolean = false;

  stationsColumns: string[] = ['rank', 'title'];
  stationsDataSource: MatTableDataSource<Station> = new MatTableDataSource<Station>(this.stations);

  constructor(private stationsService: StationsService,
              private sessionCacheService: SessionCacheService,
              private router: Router) {
  }

  ngOnInit() {
    this.stationsLoaded = false;
    this.stationsService.getAllStations().subscribe(stations => {
      this.stations = stations;
      this.stationsDataSource = new MatTableDataSource<Station>(this.stations);
      this.stationsLoaded = true;
    })
  }

  navigateToStation(stationId: number) {
    this.router.navigate(['/station', stationId, '/edit']);
  }

}
