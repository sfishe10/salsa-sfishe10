import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {SessionCacheService} from '../../services/session-cache.service';
import {Router} from '@angular/router';
import {StationService} from '../../services/station.service';
import {Station} from '../../models/station';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-stations-table',
  standalone: true,
  imports: [
    MatTable,
    MatCell,
    MatColumnDef,
    MatCellDef,
    MatRow,
    MatRowDef,
    NgIf
  ],
  templateUrl: './stations-table.component.html',
  styleUrl: './stations-table.component.css'
})
export class StationsTableComponent implements OnInit {

  @Input('editing') editing: boolean = false;

  @Output() stationClicked = new EventEmitter<number>

  stations: Station[] = [];

  stationsLoaded: boolean = false;

  stationsColumns: string[] = ['rank', 'title'];
  stationsDataSource: MatTableDataSource<Station> = new MatTableDataSource<Station>(this.stations);

  constructor(private stationsService: StationService,
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

  selectStation(stationId: number) {
    this.stationClicked.emit(stationId)
  }

}
