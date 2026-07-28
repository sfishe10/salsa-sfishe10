import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {Router} from '@angular/router';
import {StationService} from '../../services/station.service';
import {Station} from '../../models/station';
import {DatePipe, NgIf, NgStyle} from '@angular/common';
import {MemberStationStatus} from '../../models/member-station-status';
import {Utilities} from '../../utilities/utilities';
import {Constants} from '../../utilities/constants';

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
    NgIf,
    NgStyle,
    DatePipe
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

  @Input('memberStationsStatus')
  memberStationsStatus?: MemberStationStatus[];

  constructor(private stationsService: StationService) {
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

  protected readonly Utilities = Utilities;
  protected readonly Constants = Constants;
}
